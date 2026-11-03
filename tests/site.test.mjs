import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { parseHTML } from "linkedom";
import { projects } from "../src/data/projects.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const contentDir = join(root, "src", "content", "devlog");

const isRealUrl = (url) =>
  Boolean(url) && !/your-username|example\.com/.test(url);
const statusLabels = {
  placeholder: "Placeholder",
  "in progress": "In progress",
  shipped: "Shipped",
};

async function load(relative) {
  const html = await readFile(join(dist, relative), "utf8");
  return { html, document: parseHTML(html).document };
}

const bodyText = (document) =>
  document.body.textContent.replace(/\s+/g, " ").trim();

const frontmatter = (markdown, key) =>
  markdown.match(new RegExp(`^${key}:\\s*"([^"]+)"`, "m"))?.[1] ?? "";

const markdownEntries = (await readdir(contentDir)).filter((file) =>
  file.endsWith(".md")
);

const entryDir = (
  await readdir(join(dist, "devlog"), { withFileTypes: true })
).find((item) => item.isDirectory());
assert.ok(entryDir, "expected at least one built Log entry");

const entryMarkdown = await readFile(
  join(contentDir, `${entryDir.name}.md`),
  "utf8"
);

const pages = [
  { name: "home", ...(await load("index.html")) },
  { name: "projects", ...(await load("projects/index.html")) },
  { name: "devlog index", ...(await load("devlog/index.html")) },
  { name: "log entry", ...(await load(join("devlog", entryDir.name, "index.html"))) },
];
const home = pages[0];
const projectsPage = pages[1];
const devlogPage = pages[2];
const entryPage = pages[3];

const cssFiles = (await readdir(join(dist, "_astro"))).filter((file) =>
  file.endsWith(".css")
);
const css = (
  await Promise.all(
    cssFiles.map((file) => readFile(join(dist, "_astro", file), "utf8"))
  )
).join("\n");

test("every route is built", () => {
  for (const page of pages) {
    assert.ok(page.html.length > 0, `${page.name} should not be empty`);
    assert.ok(page.document.title.length > 0, `${page.name} needs a title`);
  }
});

test("nav uses the canonical vocabulary on every page", () => {
  for (const page of pages) {
    const nav = page.document.querySelector('nav[aria-label="Primary"]');
    assert.ok(nav, `${page.name} needs primary navigation`);
    const labels = [...nav.querySelectorAll("a")].map((link) =>
      link.textContent.trim()
    );
    assert.deepEqual(labels, ["Projects", "Devlog", "Resume"]);
    assert.doesNotMatch(nav.textContent, /\bBlog\b/i);
  }
});

test("shared chrome and accessibility basics are present", () => {
  for (const page of pages) {
    const { document } = page;
    assert.equal(document.documentElement.getAttribute("lang"), "en");
    assert.equal(
      document.querySelectorAll("h1").length,
      1,
      `${page.name} needs exactly one h1`
    );

    const skip = document.querySelector('a[href="#main-content"]');
    assert.ok(skip, `${page.name} needs a skip link`);
    assert.ok(document.querySelector("main#main-content"));

    assert.ok(document.querySelector("header"));
    const footer = document.querySelector("footer");
    assert.ok(footer);
    assert.match(footer.textContent, /Tanvi Shashikanth/);
    assert.ok(footer.querySelector('a[href^="mailto:"]'));
    assert.ok(footer.querySelector('a[href*="linkedin.com"]'));
  }
});

test("home states the thesis and renders the bench", () => {
  const { document } = home;
  const h1 = document.querySelector("h1");
  assert.match(h1.textContent, /hardware/i);
  assert.match(h1.textContent, /software/i);

  const text = bodyText(document);
  for (const label of ["Studying", "Building", "Learning", "Next"]) {
    assert.ok(text.includes(label), `missing ${label} row`);
  }

  assert.ok(document.querySelector('a[href$="/resume.pdf"]'));
  assert.ok(document.querySelector('a[href="/projects"]'));
});

test("projects render from the data module and hide placeholder URLs", () => {
  const { document, html } = projectsPage;
  const text = bodyText(document);

  assert.equal(document.querySelectorAll("h3").length, projects.length);

  for (const project of projects) {
    assert.ok(text.includes(project.title), `missing ${project.title}`);
    assert.ok(
      text.includes(project.description.slice(0, 40)),
      `missing the description for ${project.title}`
    );
    const label = statusLabels[project.status] ?? "In progress";
    assert.ok(text.includes(label), `missing the ${label} status`);
  }

  const linkless = projects.filter(
    (project) => !isRealUrl(project.githubUrl) && !isRealUrl(project.liveUrl)
  ).length;
  assert.equal((text.match(/Links coming soon/g) ?? []).length, linkless);
  assert.doesNotMatch(html, /your-username|example\.com/);
});

test("devlog index renders one entry per Markdown file", async () => {
  const { document } = devlogPage;
  const text = bodyText(document);

  for (const file of markdownEntries) {
    const markdown = await readFile(join(contentDir, file), "utf8");
    assert.ok(text.includes(frontmatter(markdown, "title")), `missing ${file}`);
    assert.ok(
      text.includes(frontmatter(markdown, "summary")),
      `missing the summary for ${file}`
    );
  }

  assert.match(text, /LOG 001/);
  assert.equal(
    document.querySelectorAll('a[href^="/devlog/"]').length,
    markdownEntries.length
  );
});

test("a Log entry renders its Markdown body and links back", () => {
  const { document } = entryPage;
  const text = bodyText(document);

  assert.equal(
    document.querySelector("h1").textContent.trim(),
    frontmatter(entryMarkdown, "title")
  );
  assert.match(text, /currently working on/i);
  assert.ok(document.querySelector("h2"), "Markdown headings should render");
  assert.ok(document.querySelector('a[href="/devlog"]'));
});

test("no placeholder URL is rendered as a real destination", () => {
  for (const page of pages) {
    assert.doesNotMatch(
      page.html,
      /href="[^"]*(your-username|example\.com)[^"]*"/
    );
  }
});

test("design tokens and reduced motion reach the emitted CSS", () => {
  const tokens = {
    "--paper": "#f4eff4",
    "--surface": "#fbf8fb",
    "--ink": "#26202e",
    "--muted": "#6f6678",
    "--lilac": "#6e519b",
    "--lilac-soft": "#e9e1f4",
    "--rule": "#d9cfd8",
  };

  for (const [token, value] of Object.entries(tokens)) {
    assert.ok(
      css.includes(`${token}:${value}`) || css.includes(`${token}: ${value}`),
      `emitted CSS should define ${token} as ${value}`
    );
  }

  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /--font-display/);
  assert.match(css, /--font-body/);
  assert.match(css, /--font-mono/);
});
