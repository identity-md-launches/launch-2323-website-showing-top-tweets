import data from "./data/posts.json";

export type Post = (typeof data.posts)[number];
export type SortKey = "likes" | "views" | "newest";

export const capturedAt = data.capturedAt;
export const posts: Post[] = data.posts;

export const sortOptions: { key: SortKey; label: string }[] = [
  { key: "likes", label: "Most liked" },
  { key: "views", label: "Most viewed" },
  { key: "newest", label: "Newest" },
];

export function authorsOf(list: Post[]) {
  const seen = new Map<string, string>();
  for (const p of list) seen.set(p.author.handle, p.author.name);
  return [...seen].map(([handle, name]) => ({ handle, name }));
}

export function selectPosts(list: Post[], opts: { query: string; author: string; sort: SortKey }) {
  const q = opts.query.trim().toLowerCase();
  const filtered = list.filter(
    (p) =>
      (opts.author === "all" || p.author.handle === opts.author) &&
      (q === "" ||
        p.text.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        p.author.handle.toLowerCase().includes(q)),
  );
  const score = (p: Post) =>
    opts.sort === "newest" ? Date.parse(p.createdAt) : opts.sort === "views" ? p.views : p.likes;
  return filtered.sort((a, b) => score(b) - score(a));
}

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const full = new Intl.NumberFormat("en");
export const formatCount = (n: number) => compact.format(n);
export const formatFull = (n: number) => full.format(n);

const dateFmt = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
export const formatDate = (iso: string) => dateFmt.format(new Date(iso));
