// Refreshes src/data/posts.json and public/avatars/ from FxTwitter's public status API.
// Usage: node scripts/capture-posts.mjs
// Edit POST_IDS to change which posts the site shows. No X credentials are needed or used.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const POST_IDS = [
  "2105853348188459389",
  "2102050129440133156",
  "2105396759342059873",
  "2099914270888559088",
  "2089613122390708261",
  "2093052175538659353",
  "2086860795741184283",
  "2094764730317484378",
];

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const avatarDir = join(root, "public", "avatars");
await mkdir(avatarDir, { recursive: true });

const posts = [];
const avatars = new Map();
for (const id of POST_IDS) {
  const res = await fetch(`https://api.fxtwitter.com/status/${id}`);
  if (!res.ok) throw new Error(`FxTwitter returned ${res.status} for ${id}`);
  const { tweet } = await res.json();
  const handle = tweet.author.screen_name;
  if (!avatars.has(handle)) {
    // Ask for the 200px rendition so avatars stay sharp at 2x.
    const url = tweet.author.avatar_url.replace("_normal.", "_200x200.");
    const img = await fetch(url);
    if (!img.ok) throw new Error(`Avatar ${url} returned ${img.status}`);
    const file = `${handle}.jpg`;
    await writeFile(join(avatarDir, file), Buffer.from(await img.arrayBuffer()));
    avatars.set(handle, `avatars/${file}`);
  }
  posts.push({
    id: tweet.id,
    url: `https://x.com/${handle}/status/${tweet.id}`,
    author: { name: tweet.author.name, handle, avatar: avatars.get(handle) },
    createdAt: new Date(tweet.created_timestamp * 1000).toISOString(),
    text: tweet.text,
    hasMedia: Boolean(tweet.media),
    likes: tweet.likes,
    reposts: tweet.retweets,
    replies: tweet.replies,
    views: tweet.views ?? 0,
  });
}

const out = {
  capturedAt: new Date().toISOString(),
  source: "https://api.fxtwitter.com/status/{id}",
  posts,
};
await writeFile(join(root, "src", "data", "posts.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`Captured ${posts.length} posts from ${avatars.size} authors.`);
