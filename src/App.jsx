import { useState } from "react";
import "./App.css";

function BrandLogo({ negative = false }) {
  const filename = negative
    ? "RESILIACT Negative Colored Logo.png"
    : "RESILIACT Main Logo.png";
  return (
    <span className="brand-logo">
      <img
        src={import.meta.env.BASE_URL + filename}
        alt="RESILIACT"
        width="2135"
        height="736"
      />
    </span>
  );
}

const seedNews = [];
const seedEvents = [];
const seedResults = [];
const seedMedia = [];
const storageKey = "resiliact-content-cordis-v2";
const eventsStorageKey = "resiliact-events-cordis-v2";
const resultsStorageKey = "resiliact-results-cordis-v2";
const mediaStorageKey = "resiliact-media-cordis-v2";
const cordisUrl = "https://cordis.europa.eu/project/id/101309693";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getStoredNews() {
  try {
    const stored = window.localStorage.getItem(storageKey);
    const records = stored ? JSON.parse(stored) : seedNews;
    return records.map((item, index) => ({ ...item, id: item.id || `news-${slugify(item.title)}-${index}` }));
  } catch {
    return seedNews;
  }
}
function getStoredEvents() {
  try {
    const stored = window.localStorage.getItem(eventsStorageKey);
    return stored ? JSON.parse(stored) : seedEvents;
  } catch {
    return seedEvents;
  }
}
function getStoredResults() {
  try {
    const stored = window.localStorage.getItem(resultsStorageKey);
    return stored ? JSON.parse(stored) : seedResults;
  } catch {
    return seedResults;
  }
}
function getStoredMedia() {
  try {
    const stored = window.localStorage.getItem(mediaStorageKey);
    return stored ? JSON.parse(stored) : seedMedia;
  } catch {
    return seedMedia;
  }
}
const pilots = [
  {
    slug: "oslo",
    place: "Oslo",
    code: "NO",
    challenge: "Disaster Risk Management Innovation Hub",
    status: "Demonstration hub",
    color: "green",
    region: "NORDIC CAPITAL / DEMONSTRATION",
    summary:
      "One of five Nordic Disaster Risk Management Innovation Hubs where RESILIACT will validate its solutions through real-world Living Lab exercises.",
  },
  {
    slug: "reykjavik",
    place: "Reykjavík",
    code: "IS",
    challenge: "Disaster Risk Management Innovation Hub",
    status: "Demonstration hub",
    color: "green",
    region: "NORDIC CAPITAL / DEMONSTRATION",
    summary:
      "One of five Nordic Disaster Risk Management Innovation Hubs where RESILIACT will validate its solutions through real-world Living Lab exercises.",
  },
  {
    slug: "helsinki",
    place: "Helsinki",
    code: "FI",
    challenge: "Disaster Risk Management Innovation Hub",
    status: "Demonstration hub",
    color: "green",
    region: "NORDIC CAPITAL / DEMONSTRATION",
    summary:
      "One of five Nordic Disaster Risk Management Innovation Hubs where RESILIACT will validate its solutions through real-world Living Lab exercises.",
  },
  { slug: "copenhagen", place: "Copenhagen", code: "DK", challenge: "Disaster Risk Management Innovation Hub", status: "Demonstration hub", color: "green", region: "NORDIC CAPITAL / DEMONSTRATION", summary: "One of five Nordic Disaster Risk Management Innovation Hubs where RESILIACT will validate its solutions through real-world Living Lab exercises." },
  { slug: "stockholm", place: "Stockholm", code: "SE", challenge: "Disaster Risk Management Innovation Hub", status: "Demonstration hub", color: "green", region: "NORDIC CAPITAL / DEMONSTRATION", summary: "One of five Nordic Disaster Risk Management Innovation Hubs where RESILIACT will validate its solutions through real-world Living Lab exercises." },
  { slug: "brussels", place: "Brussels", code: "BE", challenge: "Replication and assessment region", status: "Replication region", color: "cyan", region: "EUROPE / REPLICATION", summary: "One of six additional regions where RESILIACT results will be replicated and assessed." },
  { slug: "attica", place: "Attica", code: "GR", challenge: "Replication and assessment region", status: "Replication region", color: "cyan", region: "EUROPE / REPLICATION", summary: "One of six additional regions where RESILIACT results will be replicated and assessed." },
  { slug: "bratislava", place: "Bratislava", code: "SK", challenge: "Replication and assessment region", status: "Replication region", color: "cyan", region: "EUROPE / REPLICATION", summary: "One of six additional regions where RESILIACT results will be replicated and assessed." },
  { slug: "lisbon", place: "Lisbon", code: "PT", challenge: "Replication and assessment region", status: "Replication region", color: "cyan", region: "EUROPE / REPLICATION", summary: "One of six additional regions where RESILIACT results will be replicated and assessed." },
  { slug: "canvey-island", place: "Canvey Island", code: "UK", challenge: "Replication and assessment region", status: "Replication region", color: "cyan", region: "EUROPE / REPLICATION", summary: "One of six additional regions where RESILIACT results will be replicated and assessed." },
  { slug: "algiers", place: "Algiers", code: "DZ", challenge: "Replication and assessment region", status: "Replication region", color: "cyan", region: "NORTH AFRICA / REPLICATION", summary: "One of six additional regions where RESILIACT results will be replicated and assessed." },
];
const graphNodes = [
  {
    id: "challenge",
    label: "Interconnected risk",
    x: 16,
    y: 48,
    tone: "navy",
    description:
      "Climate change, urbanisation, and systemic dependencies are creating increasingly complex and interconnected disaster risks.",
  },
  {
    id: "evidence",
    label: "MSDIF",
    x: 42,
    y: 18,
    tone: "cyan",
    description:
      "The Multi-System Data Interoperability Framework harmonises data exchange across hazard, exposure, and vulnerability domains.",
  },
  {
    id: "partners",
    label: "MHIF",
    x: 42,
    y: 78,
    tone: "green",
    description:
      "The Multi-Hazard Interaction Framework models concurrent and cascading hazard processes.",
  },
  {
    id: "methods",
    label: "MIF-EWS",
    x: 67,
    y: 33,
    tone: "amber",
    description:
      "The Multi-Hazard Impact Forecast-Based Early Warning System translates hazard interactions into actionable impact forecasts.",
  },
  {
    id: "pilots",
    label: "DSS",
    x: 67,
    y: 68,
    tone: "green",
    description:
      "The Decision Support System links forecasts to decisions through predefined rules and thresholds.",
  },
  {
    id: "impact",
    label: "MCERC",
    x: 88,
    y: 50,
    tone: "navy",
    description:
      "The Multi-Channel Emergency Risk Communication environment supports coordinated, accessible, and trusted risk communication.",
  },
];

function App() {
  const [admin, setAdmin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [activeNode, setActiveNode] = useState("challenge");
  const [motion, setMotion] = useState(true);
  const [contentType, setContentType] = useState("News");
  const [saved, setSaved] = useState(false);
  const [newsItems, setNewsItems] = useState(getStoredNews);
  const [eventItems, setEventItems] = useState(getStoredEvents);
  const [resultItems, setResultItems] = useState(getStoredResults);
  const [mediaItems] = useState(getStoredMedia);
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedPilot, setSelectedPilot] = useState(null);
  const [view, setView] = useState("home");
  const active = graphNodes.find((node) => node.id === activeNode);
  function handleLogin(event) {
    event.preventDefault();
    setLoggedIn(true);
    setLoginOpen(false);
    setAdmin(true);
  }
  function handleSave(event) {
    event.preventDefault();
    window.localStorage.setItem(
      "resiliact-draft-v1",
      JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
    );
    setSaved(true);
  }
  function handlePublish(event) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const article = {
      id: `${contentType.toLowerCase()}-${Date.now()}`,
      type: contentType.toUpperCase(),
      date: fields.date || "25 AUG 2026",
      title: fields.title,
      text: fields.standfirst,
      slug: slugify(fields.title),
      published: true,
    };
    if (contentType === "Event") {
      const nextEvents = [article, ...eventItems];
      setEventItems(nextEvents);
      window.localStorage.setItem(eventsStorageKey, JSON.stringify(nextEvents));
      setAdmin(true);
      setSaved(false);
      return;
    }
    if (contentType === "Result") {
      const nextResults = [article, ...resultItems];
      setResultItems(nextResults);
      window.localStorage.setItem(resultsStorageKey, JSON.stringify(nextResults));
      setAdmin(true);
      setSaved(false);
      return;
    }
    const next = [article, ...newsItems];
    setNewsItems(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    setSelectedNews(article);
    setAdmin(false);
    setSaved(false);
  }
  function handleDelete(slug) {
    const next = newsItems.filter((item) => item.id !== slug);
    setNewsItems(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    const nextEvents = eventItems.filter((item) => item.id !== slug);
    setEventItems(nextEvents);
    window.localStorage.setItem(eventsStorageKey, JSON.stringify(nextEvents));
    const nextResults = resultItems.filter((item) => item.id !== slug);
    setResultItems(nextResults);
    window.localStorage.setItem(resultsStorageKey, JSON.stringify(nextResults));
  }
  function handleUpdate(slug, event) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const next = newsItems.map((item) => item.id === slug ? { ...item, title: fields.title, text: fields.standfirst, date: fields.date || item.date, type: contentType.toUpperCase() } : item);
    setNewsItems(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    const updateRecord = (items, key, setter) => {
      const updated = items.map((item) => item.id === slug ? { ...item, title: fields.title, text: fields.standfirst, date: fields.date || item.date, type: contentType.toUpperCase() } : item);
      setter(updated);
      window.localStorage.setItem(key, JSON.stringify(updated));
    };
    updateRecord(eventItems, eventsStorageKey, setEventItems);
    updateRecord(resultItems, resultsStorageKey, setResultItems);
  }
  function handleEdit() {
    setAdmin(true);
  }
  if (admin && loggedIn)
    return (
      <Admin
        onExit={() => {
          setAdmin(false);
          setView("home");
        }}
        onLogout={() => {
          setLoggedIn(false);
          setAdmin(false);
        }}
        contentType={contentType}
        setContentType={setContentType}
        saved={saved}
        onSave={handleSave}
        onPublish={handlePublish}
        newsItems={newsItems}
        eventItems={eventItems}
        resultItems={resultItems}
        mediaItems={mediaItems}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onUpdate={handleUpdate}
      />
    );
  const loginProps = {
    loginOpen,
    onCloseLogin: () => setLoginOpen(false),
    onLogin: handleLogin,
    onAdmin: () => {
      setSelectedNews(null);
      setSelectedPilot(null);
      setView("home");
      setLoginOpen(true);
    },
  };
  if (selectedNews)
    return (
      <NewsDetail
        article={selectedNews}
        onBack={() => {
          setSelectedNews(null);
          setView("updates");
        }}
        {...loginProps}
      />
    );
  if (selectedPilot)
    return (
      <PilotDetail
        pilot={selectedPilot}
        onBack={() => {
          setSelectedPilot(null);
          setView("pilots");
        }}
        {...loginProps}
      />
    );
  if (view !== "home")
    return (
      <ContentPage
        view={view}
        newsItems={newsItems}
        eventItems={eventItems}
        onNavigate={setView}
        onSelectNews={setSelectedNews}
        onSelectPilot={setSelectedPilot}
        {...loginProps}
      />
    );
  return (
    <div className={motion ? "site" : "site reduce-motion"}>
      <div className="topline">
        <span>HORIZON EUROPE RESEARCH AND INNOVATION ACTION</span>
        <span>GRANT AGREEMENT 101309693</span>
      </div>
      <header className="nav-wrap">
        <button
          className="wordmark"
          onClick={() => setView("home")}
          aria-label="RESILIACT home"
        >
          <BrandLogo />
        </button>
        <nav aria-label="Primary navigation">
          <button onClick={() => setView("approach")}>Approach</button>
          <button onClick={() => setView("pilots")}>Hubs &amp; regions</button>
          <button onClick={() => setView("updates")}>Updates</button>
          <button onClick={() => setView("resources")}>Resources</button>
        </nav>
        <div className="nav-actions">
          <button
            className="motion-toggle"
            onClick={() => setMotion(!motion)}
            aria-pressed={!motion}
          >
            {motion ? "Motion on" : "Motion off"}
          </button>
          <button className="admin-link" onClick={() => setLoginOpen(true)}>
            Admin login <span>↗</span>
          </button>
        </div>
      </header>
      <main id="top">
        <section className="hero page-grid">
          <div className="hero-copy reveal">
            <p className="eyebrow">
              <span className="pulse" /> PROJECT PERIOD / JUN 2026—MAY 2029
            </p>
            <h1>
              Forecast impacts.
              <br />
              <em>Act earlier.</em>
            </h1>
            <p className="hero-lede">
              RESILIACT is developing an operational, web-based platform for
              multi-hazard impact forecasting, impact-based early warning, and
              anticipatory decision-making.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#approach">
                Explore the platform <span>↓</span>
              </a>
              <a className="text-link" href="#pilots">
                Explore the hubs <span>↗</span>
              </a>
            </div>
          </div>
          <div
            className="hero-art reveal delay-1"
            aria-label="Abstract fieldwork landscape illustration"
            role="img"
          >
            <div className="art-label">01 / 05 &nbsp; INTEROPERABLE COMPONENTS</div>
            <div className="sun" />
            <div className="ridge ridge-back" />
            <div className="ridge ridge-front" />
            <div className="scanline" />
            <div className="coordinate">
              GRANT 101309693
              <br />
              COORDINATED BY NORSAR
            </div>
          </div>
        </section>
        <section className="ticker">
          <span>THE PROJECT AT A GLANCE</span>
          <div className="ticker-line" />
          <strong>Data → impact forecasts → decisions</strong>
          <span>SCROLL TO EXPLORE ↓</span>
        </section>
        <section className="intro page-grid" id="approach">
          <div className="section-number">
            01 <span>/</span> 05
          </div>
          <div>
            <p className="eyebrow">THE WHY</p>
            <h2>
              Disaster risks are connected.
              <br />
              <span>Decisions need the full picture.</span>
            </h2>
          </div>
          <div className="intro-copy">
            <p>
              Climate change, urbanisation, and systemic dependencies are
              increasing the complexity of disaster risk. RESILIACT connects
              hazard, exposure, and vulnerability data to support anticipatory,
              impact-based disaster risk governance.
            </p>
            <a className="arrow-link" href="#graph">
              See how it connects <span>↗</span>
            </a>
          </div>
        </section>
        <section className="graph-section" id="graph">
          <div className="section-heading">
            <div>
              <p className="eyebrow light">THE RESILIACT MODEL</p>
              <h2>
                Five components.
                <br />
                <em>One operational platform.</em>
              </h2>
            </div>
            <p className="heading-note">
              Select a node to explore the platform.
              <br />
              Each component is defined in the CORDIS objective.
            </p>
          </div>
          <div className="graph-layout">
            <div
              className="graph"
              aria-label="Interactive project concept graph"
            >
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <line x1="16" y1="48" x2="42" y2="18" />
                <line x1="16" y1="48" x2="42" y2="78" />
                <line x1="42" y1="18" x2="67" y2="33" />
                <line x1="42" y1="78" x2="67" y2="68" />
                <line x1="67" y1="33" x2="88" y2="50" />
                <line x1="67" y1="68" x2="88" y2="50" />
              </svg>
              {graphNodes.map((node) => (
                <button
                  key={node.id}
                  className={`graph-node ${node.tone} ${activeNode === node.id ? "selected" : ""}`}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  onClick={() => setActiveNode(node.id)}
                >
                  <span className="node-dot" />
                  <span>{node.label}</span>
                </button>
              ))}
            </div>
            <aside className="graph-detail">
              <p className="eyebrow">SELECTED NODE</p>
              <div className={`detail-mark ${active.tone}`} />
              <h3>{active.label}</h3>
              <p>{active.description}</p>
              <span className="detail-index">
                0{graphNodes.indexOf(active) + 1} / 06
              </span>
            </aside>
          </div>
        </section>
        <section className="pilots page-grid" id="pilots">
          <div className="section-number">
            02 <span>/</span> 05
          </div>
          <div className="section-heading light-heading">
            <div>
              <p className="eyebrow">DEMONSTRATION &amp; REPLICATION</p>
              <h2>
                Test in five hubs.
                <br />
                <em>Replicate in six regions.</em>
              </h2>
            </div>
            <button className="text-link" onClick={() => setView("pilots")}>
              View all locations <span>↗</span>
            </button>
          </div>
          <div className="pilot-list">
            {pilots.slice(0, 5).map((pilot, index) => (
              <button
                className="pilot-row"
                key={pilot.place}
                onClick={() => setSelectedPilot(pilot)}
              >
                <span className="pilot-num">{String(index + 1).padStart(2, "0")}</span>
                <span className="pilot-code">{pilot.code}</span>
                <div>
                  <h3>{pilot.place}</h3>
                  <p>{pilot.challenge}</p>
                </div>
                <span className={`status ${pilot.color}`}>
                  <i /> {pilot.status}
                </span>
                <span className="row-arrow">↗</span>
              </button>
            ))}
          </div>
        </section>
        <section className="updates page-grid" id="updates">
          <div className="section-number">
            03 <span>/</span> 05
          </div>
          <div className="updates-heading">
            <p className="eyebrow">PROJECT NEWS</p>
            <h2>
              Verified updates
              <br />
              <em>as they are published.</em>
            </h2>
            <button className="arrow-link" onClick={() => setView("updates")}>
              All updates <span>↗</span>
            </button>
          </div>
          <div className="news-list">
            {newsItems.length === 0 && (
              <article className="news-card empty-state">
                <div className="news-meta"><span>PROJECT NEWS</span></div>
                <h3>No project news has been published yet.</h3>
                <p>Verified updates will appear here when they are released by the project.</p>
              </article>
            )}
            {newsItems.slice(0, 3).map((item) => (
              <article className="news-card" key={item.id}>
                <div className="news-meta">
                  <span>{item.type}</span>
                  <time>{item.date}</time>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <button
                  className="news-read"
                  onClick={() => setSelectedNews(item)}
                >
                  Read story <span>↗</span>
                </button>
              </article>
            ))}
          </div>
        </section>
        <section className="resource-band" id="resources">
          <div>
            <p className="eyebrow light">A LIVING LIBRARY</p>
            <h2>
              Take the work
              <br />
              <em>with you.</em>
            </h2>
            <p>
              The official European Commission record provides the verified
              project facts, objective, funding information, and participant list.
            </p>
            <a className="button button-light" href={cordisUrl} target="_blank" rel="noreferrer">
              Open CORDIS record <span>↗</span>
            </a>
          </div>
          <div className="video-tease">
            <div className="play">▶</div>
            <div>
              <span>OFFICIAL SOURCE</span>
              <strong>
                Grant agreement
                <br />
                101309693
              </strong>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <a className="wordmark" href="#top">
          <BrandLogo negative />
        </a>
        <p>
          Horizon Europe · Civil Security for Society · Grant agreement 101309693.
        </p>
        <div>
          <a href={cordisUrl} target="_blank" rel="noreferrer">CORDIS ↗</a>
          <a href="https://www.norsar.no/" target="_blank" rel="noreferrer">Coordinator ↗</a>
        </div>
      </footer>
      {loginOpen && (
        <div className="modal-backdrop" role="presentation">
          <form className="login-modal" onSubmit={handleLogin}>
            <button
              type="button"
              className="close"
              onClick={() => setLoginOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <p className="eyebrow">PRIVATE WORKSPACE</p>
            <h2>Welcome back.</h2>
            <p>Sign in to manage project updates and resources.</p>
            <label>
              Email
              <input
                type="email"
                placeholder="Editor email"
                required
              />
            </label>
            <label>
              Password
              <input type="password" defaultValue="demo" required />
            </label>
            <button className="button button-dark" type="submit">
              Sign in <span>↗</span>
            </button>
            <small>
              Demo prototype: any valid email and password opens the editor.
            </small>
          </form>
        </div>
      )}
    </div>
  );
}

function ContentPage({
  view,
  newsItems,
  eventItems,
  onNavigate,
  onSelectNews,
  onSelectPilot,
  loginOpen,
  onCloseLogin,
  onLogin,
  onAdmin,
}) {
  const pageData = {
    approach: {
      label: "THE PLATFORM",
      title: (
        <>
          Connect the data.
          <br />
          <em>Support earlier action.</em>
        </>
      ),
      intro:
        "The operational, web-based RESILIACT Platform combines five interoperable components for multi-hazard impact forecasting, impact-based early warning, decision support, and risk communication.",
    },
    pilots: {
      label: "DEMONSTRATION & REPLICATION",
      title: (
        <>
          Five Nordic hubs.
          <br />
          <em>Six replication regions.</em>
        </>
      ),
      intro:
        "RESILIACT will validate its solutions through real-world Living Lab exercises in five Nordic capitals, then replicate and assess the results in six additional regions.",
    },
    updates: {
      label: "PROJECT NEWS",
      title: (
        <>
          Verified updates
          <br />
          <em>as they are published.</em>
        </>
      ),
      intro:
        "Verified project news and announced events will be published here as they become available.",
    },
    resources: {
      label: "A LIVING LIBRARY",
      title: (
        <>
          Take the work
          <br />
          <em>with you.</em>
        </>
      ),
      intro:
        "Official project information and, when published, verified results and materials from RESILIACT.",
    },
  }[view];
  return (
    <div className="detail-page content-page">
      <header className="nav-wrap">
        <button
          className="wordmark detail-home"
          onClick={() => onNavigate("home")}
          aria-label="RESILIACT home"
        >
          <BrandLogo />
        </button>
        <nav aria-label="Page navigation">
          <button
            className={view === "approach" ? "current" : ""}
            onClick={() => onNavigate("approach")}
          >
            Approach
          </button>
          <button
            className={view === "pilots" ? "current" : ""}
            onClick={() => onNavigate("pilots")}
          >
            Hubs &amp; regions
          </button>
          <button
            className={view === "updates" ? "current" : ""}
            onClick={() => onNavigate("updates")}
          >
            Updates
          </button>
          <button
            className={view === "resources" ? "current" : ""}
            onClick={() => onNavigate("resources")}
          >
            Resources
          </button>
        </nav>
        <button className="admin-link" onClick={onAdmin}>
          Admin login <span>↗</span>
        </button>
      </header>
      <main>
        <div className="page-hero">
          <p className="eyebrow">{pageData.label} / RESILIACT</p>
          <h1>{pageData.title}</h1>
          <p className="article-lede">{pageData.intro}</p>
        </div>
        {view === "updates" && (
          <>
          <div className="updates-subheading"><p className="eyebrow">LATEST NEWS</p><span>{newsItems.length} published stories</span></div>
          <div className="all-news-grid">
            {newsItems.length === 0 && (
              <article className="news-card empty-state">
                <div className="news-meta"><span>PROJECT NEWS</span></div>
                <h3>No project news has been published yet.</h3>
                <p>New items will appear here after they have been verified and published.</p>
              </article>
            )}
            {newsItems.map((item) => (
                <article className="news-card" key={item.id}>
                <div className="news-meta">
                  <span>{item.type}</span>
                  <time>{item.date}</time>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <button
                  className="news-read"
                  onClick={() => onSelectNews(item)}
                >
                  Open update <span>↗</span>
                </button>
              </article>
            ))}
          </div>
          <div className="updates-subheading upcoming-heading"><p className="eyebrow">UPCOMING EVENTS</p><span>{eventItems.length} scheduled activities</span></div>
          <div className="event-list">
            {eventItems.length === 0 && (
              <article className="event-row empty-state">
                <div><h3>No upcoming events have been published.</h3><p>Verified event details will appear here when announced.</p></div>
              </article>
            )}
            {eventItems.map((item) => (
              <article className="event-row" key={item.id}>
                <time>{item.date}</time><div><h3>{item.title}</h3><p>{item.text}</p></div><span className="event-status">UPCOMING <b>↗</b></span>
              </article>
            ))}
          </div>
          </>
        )}
        {view === "approach" && (
          <>
          <div className="page-panels">
            <article>
              <span>01</span>
              <h2>Integrate data.</h2>
              <p>
                MSDIF harmonises data exchange across hazard, exposure, and
                vulnerability domains.
              </p>
            </article>
            <article>
              <span>02</span>
              <h2>Model interactions.</h2>
              <p>
                MHIF models concurrent and cascading hazard processes.
              </p>
            </article>
            <article>
              <span>03</span>
              <h2>Forecast impacts.</h2>
              <p>
                MIF-EWS translates hazard interactions into actionable impact forecasts.
              </p>
            </article>
            <article>
              <span>04</span>
              <h2>Support decisions.</h2>
              <p>DSS links forecasts to decisions through predefined rules and thresholds.</p>
            </article>
            <article>
              <span>05</span>
              <h2>Communicate risk.</h2>
              <p>MCERC enables coordinated, accessible, and trusted risk communication.</p>
            </article>
          </div>
          <div className="resource-page-grid project-facts">
            <article>
              <span>PROJECT INFORMATION</span>
              <h2>Cross-regional action for enhanced impact forecasting, early warning, and resilient governance</h2>
              <p>RESILIACT · 1 June 2026–31 May 2029 · Horizon Europe Research and Innovation Action.</p>
            </article>
            <article>
              <span>FUNDING &amp; COORDINATION</span>
              <h2>€3,498,903.63 EU contribution</h2>
              <p>Coordinated by Stiftelsen NORSAR, Norway, under grant agreement 101309693.</p>
            </article>
          </div>
          </>
        )}
        {view === "pilots" && (
          <div className="page-pilot-list">
            {pilots.map((pilot, index) => (
              <button
                className="pilot-row"
                key={pilot.place}
                onClick={() => onSelectPilot(pilot)}
              >
                <span className="pilot-num">{String(index + 1).padStart(2, "0")}</span>
                <span className="pilot-code">{pilot.code}</span>
                <div>
                  <h3>{pilot.place}</h3>
                  <p>{pilot.challenge}</p>
                </div>
                <span className={`status ${pilot.color}`}>
                  <i /> {pilot.status}
                </span>
                <span className="row-arrow">↗</span>
              </button>
            ))}
          </div>
        )}
        {view === "resources" && (
          <div className="resource-page-grid">
            <article>
              <span>OFFICIAL PROJECT RECORD</span>
              <h2>CORDIS fact sheet</h2>
              <p>
                Project objective, programme, funding, coordinator, participant list,
                dates, and grant information from the European Commission.
              </p>
              <a
                className="button button-dark"
                href={cordisUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open CORDIS <span>↗</span>
              </a>
            </article>
            <article>
              <span>PROJECT IDENTIFIER</span>
              <h2>DOI 10.3030/101309693</h2>
              <p>Persistent identifier for the official RESILIACT project record.</p>
              <a
                className="button button-outline"
                href="https://doi.org/10.3030/101309693"
                target="_blank"
                rel="noreferrer"
              >
                Open DOI <span>↗</span>
              </a>
            </article>
          </div>
        )}
      </main>
      <footer>
        <button className="wordmark" onClick={() => onNavigate("home")}>
          <BrandLogo negative />
        </button>
        <p>
          Horizon Europe · Civil Security for Society · Grant agreement 101309693.
        </p>
      </footer>
      {loginOpen && <LoginModal onSubmit={onLogin} onClose={onCloseLogin} />}
    </div>
  );
}

function LoginModal({ onSubmit, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <form className="login-modal" onSubmit={onSubmit}>
        <button
          type="button"
          className="close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <p className="eyebrow">PRIVATE WORKSPACE</p>
        <h2>Welcome back.</h2>
        <p>Sign in to manage project updates and resources.</p>
        <label>
          Email
          <input
            type="email"
            placeholder="Editor email"
            required
          />
        </label>
        <label>
          Password
          <input type="password" defaultValue="demo" required />
        </label>
        <button className="button button-dark" type="submit">
          Sign in <span>↗</span>
        </button>
        <small>
          Demo prototype: any valid email and password opens the editor.
        </small>
      </form>
    </div>
  );
}

function PilotDetail({ pilot, onBack, onAdmin }) {
  return (
    <div className="detail-page pilot-detail">
      <header className="nav-wrap">
        <button
          className="wordmark detail-home"
          onClick={onBack}
          aria-label="Back to hubs and regions"
        >
          <BrandLogo />
        </button>
        <button className="admin-link" onClick={onAdmin}>
          Admin login <span>↗</span>
        </button>
      </header>
      <main>
        <div className="detail-crumb">
          <button onClick={onBack}>← All hubs &amp; regions</button>
          <span>/ {pilot.code}</span>
        </div>
        <div className="pilot-detail-head">
          <div>
            <p className="eyebrow">
              LOCATION / {pilot.code} / {pilot.status.toUpperCase()}
            </p>
            <h1>
              {pilot.place}
              <br />
              <em>{pilot.challenge}.</em>
            </h1>
            <p className="article-lede">{pilot.summary}</p>
            <span className="pilot-coordinate">{pilot.region}</span>
          </div>
          <div
            className="pilot-map"
            role="img"
            aria-label={`Abstract location graphic for ${pilot.place}`}
          >
            <div className="map-grid-lines" />
            <div className="map-land land-one" />
            <div className="map-land land-two" />
            <div className="map-river" />
            <span className="map-north">N ↑</span>
            <span className="map-scale">CORDIS PROJECT LOCATION</span>
          </div>
        </div>
        <section className="pilot-story-grid">
          <div className="pilot-hotspot-detail">
            <p className="eyebrow">ROLE IN RESILIACT</p>
            <h2>{pilot.status}</h2>
            <p>{pilot.summary}</p>
            <a className="arrow-link" href={cordisUrl} target="_blank" rel="noreferrer">
              Verify on CORDIS <span>↗</span>
            </a>
          </div>
          <div className="pilot-method">
            <p className="eyebrow">PROJECT VALIDATION PATHWAY</p>
            <h2>Demonstrate. Replicate. Assess.</h2>
            <p>
              RESILIACT is co-created through a Public–Private–Civil Partnership®
              and demonstrated across five Nordic hubs through real-world Living
              Lab exercises. Results are then replicated and assessed in six
              additional regions.
            </p>
            <div className="method-line">
              <span>01</span>
              <strong>Co-create</strong>
              <span>→</span>
              <span>02</span>
              <strong>Validate</strong>
              <span>→</span>
              <span>03</span>
              <strong>Replicate</strong>
            </div>
          </div>
        </section>
        <div className="article-actions">
          <button className="button button-dark" onClick={onBack}>
            Back to all locations <span>↗</span>
          </button>
          <button
            className="text-link"
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
          >
            Copy case study link <span>↗</span>
          </button>
        </div>
      </main>
    </div>
  );
}

function NewsDetail({ article, onBack, onAdmin }) {
  return (
    <div className="detail-page">
      <header className="nav-wrap">
        <button className="wordmark detail-home" onClick={onBack}>
          <BrandLogo />
        </button>
        <button className="admin-link" onClick={onAdmin}>
          Admin login <span>↗</span>
        </button>
      </header>
      <main>
        <div className="detail-crumb">
          <button onClick={onBack}>← All updates</button>
          <span>/ {article.type}</span>
        </div>
        <article className="article-content">
          <p className="eyebrow">
            {article.type} / {article.date}
          </p>
          <h1>{article.title}</h1>
          <p className="article-lede">{article.text}</p>
          <div className="article-rule" />
          <p>
            This item was published through the local RESILIACT content prototype. Refer
            to the official CORDIS record for the authoritative project facts.
          </p>
          <div className="article-actions">
            <button className="button button-dark" onClick={onBack}>
              Back to updates <span>↗</span>
            </button>
            <button
              className="text-link"
              onClick={() =>
                navigator.clipboard?.writeText(window.location.href)
              }
            >
              Copy link <span>↗</span>
            </button>
          </div>
        </article>
      </main>
    </div>
  );
}

function Admin({
  onExit,
  onLogout,
  contentType,
  setContentType,
  saved,
  onSave,
  onPublish,
  newsItems,
  eventItems,
  resultItems,
  mediaItems,
  onDelete,
  onEdit,
  onUpdate,
}) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaPreview, setMediaPreview] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  function handleFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    setMediaUrl(file.name);
    setMediaPreview(URL.createObjectURL(file));
  }

  function startEdit(item) {
    setEditingItem(item);
    setContentType(item.type === "EVENT" ? "Event" : item.type === "RESULT" ? "Result" : "News");
    setActiveTab(item.type === "EVENT" ? "Events" : item.type === "RESULT" ? "Results" : "News");
    setShowEditor(true);
    onEdit(item);
  }

  function startCreate(type) {
    setEditingItem(null);
    setContentType(type);
    setShowEditor(true);
    setActiveTab("Create new");
  }

  function removeItem(item) {
    if (window.confirm(`Delete “${item.title}”?`)) onDelete(item.id);
  }

  function submitForm(event) {
    if (editingItem) {
      onUpdate(editingItem.id, event);
      setEditingItem(null);
    } else onSave(event);
  }

  function publishForm(event) {
    const form = event.currentTarget.form;
    if (editingItem) {
      if (form.reportValidity()) {
        onUpdate(editingItem.id, { preventDefault: () => {}, currentTarget: form });
        setEditingItem(null);
      }
    }
    else publishFromForm({ currentTarget: event.currentTarget });
  }

  const tabs = ["Overview", "News", "Events", "Results", "Media library"];
  function publishFromForm(event) {
    const form = event.currentTarget.form;
    if (form.reportValidity())
      onPublish({ preventDefault: () => {}, currentTarget: form });
  }
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="wordmark" href="#top">
          <BrandLogo negative />
        </a>
        <p className="eyebrow">CONTENT STUDIO</p>
        <button className={`sidebar-create ${showEditor ? "active" : ""}`} onClick={() => startCreate("News")}>+ Create new</button>
        <nav>
          {tabs.map((tab) => (
            <button
              className={activeTab === tab ? "active" : ""}
              key={tab}
              onClick={() => { setActiveTab(tab); setShowEditor(false); setEditingItem(null); }}
            >
              {tab}
              {tab === "News" && <b>{newsItems.length}</b>}
              {tab === "Events" && <b>{eventItems.length}</b>}
            </button>
          ))}
        </nav>
        <div className="admin-user">
          <span>ED</span>
          <div>
            <strong>Project editor</strong>
            <small>Local prototype account</small>
          </div>
          <button onClick={onLogout}>Log out</button>
        </div>
      </aside>
      <main className={`admin-main ${showEditor ? "create-mode" : ""}`}>
        <header className="admin-top">
          <div>
            <p className="eyebrow">CONTENT STUDIO / {activeTab.toUpperCase()}</p>
            <h1>Content workspace.</h1>
          </div>
          <div>
            <button className="text-link" onClick={onExit}>
              View public site ↗
            </button>
          </div>
        </header>
        {activeTab === "Overview" && <AdminOverview items={newsItems} onEdit={startEdit} onDelete={removeItem} />}
        {activeTab === "Events" && <AdminCollection title="Events" summary="Workshops, conferences, registrations, and recordings." items={eventItems} onCreate={() => startCreate("Event")} onEdit={startEdit} onDelete={removeItem} />}
        {activeTab === "Results" && <AdminCollection title="Results" summary="Publications, reports, tools, datasets, and policy briefs." items={resultItems} onCreate={() => startCreate("Result")} onEdit={startEdit} onDelete={removeItem} />}
        {activeTab === "Media library" && <AdminPlaceholder title="Media library" text="Images, documents, credits, alt text, usage rights, and external video links." items={mediaItems} onCreate={() => startCreate("Media")} />}
        {activeTab === "News" && !showEditor && <ContentList items={newsItems} onEdit={startEdit} onDelete={removeItem} onCreate={() => startCreate("News")} />}
        {showEditor && <>
        <section className="admin-stats">
          <div>
            <span>Published news</span>
            <strong>{newsItems.length}</strong>
            <small>Stored in this local prototype</small>
          </div>
          <div>
            <span>In review</span>
            <strong>0</strong>
            <small>No review service connected</small>
          </div>
          <div>
            <span>Next event</span>
            <strong>—</strong>
            <small>No event published</small>
          </div>
        </section>
        <section className="editor-grid">
          <form className="editor-form" key={editingItem?.id || "new"} onSubmit={submitForm}>
            <div className="form-head">
              <div>
                <p className="eyebrow">CREATE NEW</p>
                <h2>Publish an update</h2>
              </div>
              <select
                value={contentType}
                onChange={(event) => setContentType(event.target.value)}
              >
                <option>News</option>
                <option>Event</option>
                <option>Result</option>
                <option>Pilot story</option>
                <option>Media</option>
              </select>
            </div>
            <label>
              Title
              <input
                id="title"
                name="title"
                defaultValue={editingItem?.title || ""}
                placeholder="Give your update a clear title"
                required
              />
            </label>
            <label>
              Standfirst
              <textarea
                name="standfirst"
                rows="3"
                defaultValue={editingItem?.text || ""}
                placeholder="Give a short summary for cards and search results"
                required
              />
            </label>
            <div className="field-row">
              <label>
                Publication date
                <input name="date" type="date" defaultValue={editingItem?.date || ""} required />
              </label>
              <label>
                Topic
                <select name="topic">
                  <option>Project progress</option>
                  <option>Fieldwork</option>
                  <option>Publication</option>
                  <option>Partner story</option>
                </select>
              </label>
            </div>
            <label>
              Hero media
              <div className="upload">
                <span>+</span>
                <div>
                  <strong>{mediaUrl || "Drop an image or browse"}</strong>
                  <small>JPG, PNG, WebP up to 10MB · Alt text required</small>
                </div>
                <input className="media-file" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} />
              </div>
            </label>
            <label>Online image URL<input name="mediaUrl" type="url" value={mediaUrl} onChange={(event) => { setMediaUrl(event.target.value); setMediaPreview(event.target.value) }} placeholder="https://.../figure.jpg" /></label>
            {mediaPreview && <img className="media-preview" src={mediaPreview} alt="Selected hero preview" onError={() => setMediaPreview("")} />}
            <div className="form-footer">
              <span>
                {editingItem ? "Editing published content" : saved ? "✓ Draft saved locally" : "Autosave enabled"}
              </span>
              <div className="form-actions">
                <button className="button button-outline" type="submit">
                  Save as draft
                </button>
                <button
                  className="button button-dark"
                  type="button"
                  onClick={publishForm}
                >
                  {editingItem ? "Update content" : "Publish now"} <span>↗</span>
                </button>
              </div>
            </div>
          </form>
          <section className="admin-content-list"><div className="admin-list-head"><p className="eyebrow">PUBLISHED NEWS CONTENT</p><span>{newsItems.length} items</span></div>{newsItems.map((item) => <article className="admin-content-row" key={item.id}><div><strong>{item.title}</strong><small>{item.type} · {item.date} · ID: {item.id}</small></div><div className="row-actions"><button onClick={() => startEdit(item)}>Edit</button><button className="delete-action" onClick={() => removeItem(item)}>Delete</button></div></article>)}</section>
          <aside className="activity">
            <p className="eyebrow">PROTOTYPE STATUS</p>
            <h2>No production data connected.</h2>
            <p>Publishing workflow and analytics values will appear only after a CMS and analytics service are configured.</p>
            <div className="traffic-summary">
              <p className="eyebrow">WEBSITE TRAFFIC</p>
              <h3>Analytics unavailable</h3>
              <div className="traffic-metrics">
                <div><strong>—</strong><small>VISITORS</small></div>
                <div><strong>—</strong><small>PAGE VIEWS</small></div>
                <div><strong>—</strong><small>AVG. SESSION</small></div>
              </div>
            </div>
          </aside>
        </section>
        </>}
      </main>
    </div>
  );
}

function AdminOverview({ items, onEdit, onDelete }) {
  return <section className="admin-overview"><section className="admin-stats"><div><span>Published news</span><strong>{items.length}</strong><small>Stored in this local prototype</small></div><div><span>In review</span><strong>0</strong><small>No review service connected</small></div><div><span>Next event</span><strong>—</strong><small>No event published</small></div></section><div className="overview-columns"><section className="recent-content"><div className="admin-list-head"><p className="eyebrow">RECENT PUBLISHED NEWS</p><span>{items.length} items</span></div>{items.slice(0, 4).map((item) => <article className="admin-content-row" key={item.id}><div><strong>{item.title}</strong><small>{item.type} · {item.date}</small></div><div className="row-actions"><button onClick={() => onEdit(item)}>Edit</button><button className="delete-action" onClick={() => onDelete(item)}>Delete</button></div></article>)}</section><ActivityPanel /></div></section>;
}

function ActivityPanel() {
  return <aside className="activity"><p className="eyebrow">PROTOTYPE STATUS</p><h2>No production data connected.</h2><p>Workflow and analytics values will appear only after production services are configured.</p><div className="traffic-summary"><p className="eyebrow">WEBSITE TRAFFIC</p><h3>Analytics unavailable</h3><div className="traffic-metrics"><div><strong>—</strong><small>VISITORS</small></div><div><strong>—</strong><small>PAGE VIEWS</small></div><div><strong>—</strong><small>AVG. SESSION</small></div></div></div></aside>;
}

function ContentList({ items, onEdit, onDelete, onCreate }) {
  return <section className="admin-collection"><div className="collection-heading"><div><p className="eyebrow">CONTENT STUDIO / NEWS</p><h2>News</h2><p>Project progress, field notes, partner stories, and publications.</p></div><button className="button button-dark" onClick={onCreate}>+ Create news</button></div><div className="collection-list">{items.map((item) => <article className="admin-content-row" key={item.id}><div><strong>{item.title}</strong><small>{item.type} · {item.date} · ID: {item.id}</small><p>{item.text}</p></div><div className="row-actions"><button onClick={() => onEdit(item)}>Edit</button><button className="delete-action" onClick={() => onDelete(item)}>Delete</button></div></article>)}</div></section>;
}

function AdminPlaceholder({ title, text, items = [], onCreate }) {
  return <section className="admin-tab-panel"><p className="eyebrow">CONTENT STUDIO / {title.toUpperCase()}</p><h2>{title}</h2><p>{text}</p><button className="button button-dark" onClick={onCreate}>+ Create {title.toLowerCase()}</button>{items.length > 0 && <div className="admin-placeholder-list">{items.map((item) => <article key={item.id}><strong>{item.title}</strong><small>{item.date} · ID: {item.id}</small><p>{item.text}</p></article>)}</div>}</section>;
}

function AdminCollection({ title, summary, items, onCreate, onEdit, onDelete }) {
  return <section className="admin-collection"><div className="collection-heading"><div><p className="eyebrow">CONTENT STUDIO / {title.toUpperCase()}</p><h2>{title}</h2><p>{summary}</p></div><button className="button button-dark" onClick={onCreate}>+ Create {title.toLowerCase()}</button></div><div className="collection-list">{items.map((item) => <article className="admin-content-row" key={item.id}><div><strong>{item.title}</strong><small>{item.type} · {item.date} · ID: {item.id}</small><p>{item.text}</p></div><div className="row-actions"><button onClick={() => onEdit(item)}>Edit</button><button className="delete-action" onClick={() => onDelete(item)}>Delete</button></div></article>)}</div></section>;
}

export default App;
