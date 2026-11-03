import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { parseHTML } from "linkedom";
import { projects } from "../src/data/projects.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");

async function load(relative) {
  const html = await readFile(join(dist, relative), "utf8");
  return { html, document: parseHTML(html).document };
}

async function entryPath() {
  const entries = await readdir(join(dist, "devlog"), { withFileTypes: true });
  const entry = entries.find((item) => item.isDirectory());
  assert.ok(entry, "expected at least one built Log entry");
  return join("devlog", entry.name, "index.html");
}

const entry = await entryPath();
const pages = [
  { name: "home", ...(await load("index.html")) },
  { name: "projects", ...(await load("projects/index.html")) },
  { name: "devlog index", ...(await load("devlog/index.html")) },
  { name: "log entry", ...(await load(entry)) },
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

const markdownEntries = (
  await readdir(join(root, "src", "content", "devlog"))
).filter((file) => file.endsWith(".md"));

test("every route is built", async () => {
  for (const page of pages) {
    assert.ok(page.html.length > 0, `${page.name} should not be empty`);
    assert.ok(page.document.title.length > 0, `${page.name} needs a title`);
  }
});

test("nav uses the canonical vocabulary on every page", () => {
  for (const page of pages) {
    const nav = page.document.querySelector("nav.site-nav");
    assert.ok(nav, `${page.name} needs primary navigation`);
    const labels = [...nav.querySelectorAll("a")].map((a) =>
      a.textContent.trim()
    );
    assert.deepEqual(labels, ["Projects", "Devlog", "Resume"]);
    assert.doesNotMatch(page.document.body.textContent, /\bBlog\b/i);
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

    const skip = document.querySelector("a.skip-link");
    assert.ok(skip, `${page.name} needs a skip link`);
    assert.equal(skip.getAttribute("href"), "#main-content");
    assert.ok(document.querySelector("main#main-content"));

    assert.ok(document.querySelector("header.site-header"));
    assert.ok(document.querySelector("footer.site-footer"));

    const footer = document.querySelector("footer.site-footer");
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
  assert.equal(document.querySelectorAll(".bench-row").length, 4);
  assert.ok(document.querySelector('.actions a[href$="/resume.pdf"]'));
  assert.ok(document.querySelector('a[href="/projects"]'));
});

test("projects render from the data module and hide placeholder URLs", () => {
  const { document, html } = projectsPage;
  const rows = document.querySelectorAll(".project-row");
  assert.equal(rows.length, projects.length);

  const titles = [...document.querySelectorAll(".project-row h3")].map((h) =>
    h.textContent.trim()
  );
  assert.deepEqual(
    titles,
    projects.map((project) => project.title)
  );

  for (const status of document.querySelectorAll(".project-row .status")) {
    assert.equal(status.textContent.trim(), "Placeholder");
  }

  assert.doesNotMatch(html, /your-username|example\.com/);
  assert.equal(document.querySelectorAll(".links-pending").length, projects.length);
});

test("devlog index renders one entry per Markdown file", () => {
  const { document, html } = devlogPage;
  const entries = document.querySelectorAll(".log-entry");
  assert.equal(entries.length, markdownEntries.length);
  assert.match(html, /LOG 001/);

  for (const link of entries) {
    assert.match(link.getAttribute("href"), /^\/devlog\/.+/);
  }
});

test("a Log entry renders its Markdown body and links back", () => {
  const { document } = entryPage;
  assert.equal(document.querySelector("h1").textContent.trim(), "Pilot!");
  assert.ok(document.querySelector(".prose h2"));
  assert.match(document.querySelector(".prose").textContent, /currently working on/i);
  assert.ok(document.querySelector('a[href="/devlog"]'));
});

test("design tokens and reduced motion reach the emitted CSS", () => {
  const tokens = {
    "--paper": "#f6f1e8",
    "--surface": "#fcf9f3",
    "--ink": "#26202e",
    "--muted": "#6f6678",
    "--lilac": "#6e519b",
    "--lilac-soft": "#e9e1f4",
    "--rule": "#d9cfc1",
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
