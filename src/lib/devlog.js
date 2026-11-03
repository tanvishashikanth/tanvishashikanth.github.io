export function sortLogEntries(posts) {
  return [...posts].sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
}

export function numberLogEntries(posts) {
  const ordered = sortLogEntries(posts);
  return ordered.map((post, index) => ({
    post,
    logNumber: ordered.length - index,
  }));
}
