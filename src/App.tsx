import { useId, useMemo, useState } from "react";
import {
  authorsOf,
  capturedAt,
  formatCount,
  formatDate,
  formatFull,
  posts,
  selectPosts,
  sortOptions,
  type Post,
  type SortKey,
} from "./feed";

const EXCERPT = 240;

// Cut at a word boundary and fold blank lines, so the ellipsis always ends a sentence fragment.
function excerpt(text: string) {
  const cut = text.slice(0, EXCERPT).replace(/\n\s*\n/g, "\n");
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,.:;-]+$/, "") + "…";
}

const icons = {
  likes: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
  reposts: "M7 7h10l-3-3M17 17H7l3 3M5 13V9a2 2 0 0 1 2-2M19 11v4a2 2 0 0 1-2 2",
  replies: "M5 5h14v10H9l-4 4z",
  views: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
} as const;

const metricLabels: Record<keyof typeof icons, string> = {
  likes: "likes",
  reposts: "reposts",
  replies: "replies",
  views: "views",
};

function Icon({ d }: { d: string }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={d} />
    </svg>
  );
}

function PostCard({ post, rank }: { post: Post; rank: number }) {
  const [open, setOpen] = useState(false);
  const textId = useId();
  const long = post.text.length > EXCERPT + 40;
  return (
    <li className="post">
      <article aria-labelledby={`${textId}-by`}>
        <header className="post-head">
          <span className="rank" aria-label={`Rank ${rank}`}>
            {rank}
          </span>
          <img className="avatar" src={post.author.avatar} alt="" width="44" height="44" loading="lazy" />
          <div className="byline" id={`${textId}-by`}>
            <span className="author">{post.author.name}</span>
            <span className="meta">
              @{post.author.handle} · <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
            </span>
          </div>
        </header>
        <p id={textId} className="post-text">
          {long && !open ? excerpt(post.text) : post.text}
        </p>
        {long && (
          <button
            type="button"
            className="link-button"
            aria-expanded={open}
            aria-controls={textId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Show less" : "Show full post"}
          </button>
        )}
        {post.hasMedia && <p className="media-note">Includes a photo or video on X.</p>}
        <footer className="post-foot">
          <ul className="metrics" aria-label="Engagement">
            {(Object.keys(icons) as (keyof typeof icons)[]).map((k) => (
              <li key={k} title={`${formatFull(post[k])} ${metricLabels[k]}`}>
                <Icon d={icons[k]} />
                <span className="count">{formatCount(post[k])}</span>
                <span className="visually-hidden"> {metricLabels[k]}</span>
              </li>
            ))}
          </ul>
          <a className="open-link" href={post.url} target="_blank" rel="noopener noreferrer">
            Open on X<span className="visually-hidden">: post by {post.author.name}, opens in a new tab</span>
          </a>
        </footer>
      </article>
    </li>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [author, setAuthor] = useState("all");
  const [sort, setSort] = useState<SortKey>("likes");
  const authors = useMemo(() => authorsOf(posts), []);
  const shown = useMemo(() => selectPosts(posts, { query, author, sort }), [query, author, sort]);
  const filtered = query.trim() !== "" || author !== "all";

  const clear = () => {
    setQuery("");
    setAuthor("all");
    document.getElementById("search")?.focus();
  };

  return (
    <>
      <a className="skip-link" href="#feed">
        Skip to posts
      </a>
      <header className="site-bar">
        <div className="wrap site-bar-inner">
          <a className="brand" href="./">
            <img src="favicon.svg" alt="" width="32" height="32" />
            Pepe Wire
          </a>
          <a className="bar-link" href="https://www.imd.fun/" target="_blank" rel="noopener noreferrer">
            Visit imd.fun<span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>
      </header>

      <main className="wrap">
        <section className="intro" aria-labelledby="title">
          <div className="intro-copy">
            <h1 id="title">Top posts about IdentityMD</h1>
            <p className="lede">The most liked and viewed X posts about the IMD agent network, in one searchable list.</p>
          </div>
          <img
            className="intro-art"
            src="pepe-armed.svg"
            alt="A pepe in a glowing AI visor holding a neural blaster"
            width="340"
            height="320"
          />
        </section>

        <form className="controls" role="search" aria-label="Filter posts" onSubmit={(e) => e.preventDefault()}>
          <div className="field field-search">
            <label htmlFor="search">Search posts</label>
            <input
              id="search"
              type="search"
              placeholder="daemon, oracle, NFT"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="author">Author</label>
            <select id="author" value={author} onChange={(e) => setAuthor(e.target.value)}>
              <option value="all">All authors</option>
              {authors.map((a) => (
                <option key={a.handle} value={a.handle}>
                  {a.name} (@{a.handle})
                </option>
              ))}
            </select>
          </div>
          <fieldset className="sort">
            <legend>Sort by</legend>
            <div className="segments">
              {sortOptions.map((o) => (
                <label key={o.key} className="segment">
                  <input
                    type="radio"
                    name="sort"
                    value={o.key}
                    checked={sort === o.key}
                    onChange={() => setSort(o.key)}
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </form>

        <section id="feed" className="feed" aria-labelledby="feed-title" tabIndex={-1}>
          <div className="feed-head">
            <h2 id="feed-title">Ranked posts</h2>
            <p className="count-line" role="status">
              Showing {shown.length} of {posts.length} posts
            </p>
          </div>
          {shown.length > 0 ? (
            <ol className="posts">
              {shown.map((p, i) => (
                <PostCard key={p.id} post={p} rank={i + 1} />
              ))}
            </ol>
          ) : (
            <div className="empty">
              <p className="empty-title">
                No posts match {query.trim() ? `“${query.trim()}”` : "this author"}
                {query.trim() && author !== "all" ? " from this author" : ""}.
              </p>
              <p>Try a shorter word, or show every post again.</p>
              {filtered && (
                <button type="button" className="button" onClick={clear}>
                  Clear filters
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="site-foot">
        <div className="wrap">
          <p>
            Counts are a snapshot from FxTwitter’s public post data, captured {formatDate(capturedAt)}. Live numbers on X
            keep moving.
          </p>
          <p>Pepe art drawn for this site. Not affiliated with X.</p>
        </div>
      </footer>
    </>
  );
}
