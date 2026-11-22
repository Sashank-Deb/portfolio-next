import { BLOG_URL, FEATURED_POST, POSTS, POST_COUNT, postUrl } from '@/content/writing';
import { Dot } from '../ui/Dot';
import { CountChip, SectionHead } from '../ui/SectionHead';

const NBSP = ' ';

function Meta({ date, read }: { date: string; read: string }) {
  return (
    <span className="post__meta">
      {`${date} · ${read} `}
      <i className="uil uil-arrow-up-right" />
    </span>
  );
}

export function Writing() {
  const f = FEATURED_POST;
  return (
    <section className="section writing" id="writing">
      <div className="container">
        <SectionHead
          index="07"
          label="Writing"
          title="Notes from Binary Trek"
          aside={<CountChip href={BLOG_URL}>{`${POST_COUNT} posts on Hashnode`}</CountChip>}
        />

        <a
          className="post-feature"
          href={postUrl(f.slug)}
          target="_blank"
          rel="noopener noreferrer"
          data-reveal
        >
          <span className="post-feature__cover" aria-hidden="true">
            <span className="post-feature__kicker">{f.kicker}</span>
            <span className="post-feature__big">
              {`2.7${NBSP}kB of`}
              <br />
              liquid colour
              <Dot />
            </span>
            <span className="post-feature__blob" />
          </span>
          <span className="post-feature__body">
            <span className="post__chips">
              <span className="post__chip post__chip--hot">Featured</span>
              {f.chips.map((c) => (
                <span key={c} className="post__chip">
                  {c}
                </span>
              ))}
            </span>
            <span className="post-feature__title">{f.title}</span>
            <span className="post-feature__brief">{f.brief}</span>
            <Meta date={f.date} read={f.read} />
          </span>
        </a>

        <div className="post-grid">
          {POSTS.map((p, i) => (
            <a
              key={p.slug}
              className="post"
              href={postUrl(p.slug)}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
            >
              <span className="post__top">
                <span className="post__num">{String(i + 2).padStart(2, '0')}</span>
                <span className="post__tag">{p.tag}</span>
              </span>
              <h3 className="post__title">{p.title}</h3>
              <p className="post__brief">{p.brief}</p>
              <Meta date={p.date} read={p.read} />
            </a>
          ))}
        </div>

        <a
          className="blog-banner"
          href={BLOG_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-reveal
        >
          <span className="blog-banner__text">
            <span className="eyebrow">The blog</span>
            <span className="blog-banner__title">Read everything on Binary Trek</span>
          </span>
          <span className="blog-banner__go" aria-hidden="true">
            <i className="uil uil-arrow-right" />
          </span>
        </a>
      </div>
    </section>
  );
}
