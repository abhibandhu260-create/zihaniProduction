import React, { useState, useEffect, useRef, useCallback } from "react";

const CHAPTERS = [
  { id: "hero", label: "Open", kind: "hero" },
  { id: "p1",
     label: "Tumbbad", kind: "project",
      year: "2018", role: "Production Designer",
       note: "A cursed world carved from shadow — weathered architecture, ritualistic props, haunting period detail.",
        tone: "#7A6A4E" },
  { id: "p2", label: "Atrangi Re", kind: "project", year: "2021", role: "Production Designer", note: "Love through contrasting worlds — colorful urban landscapes and intimate lived-in interiors.", tone: "#5C6B73" },
  { id: "p3", label: "Kalki 2898-AD", kind: "project", year: "2024", role: "Production Designer", note: "A future imagined from ancient myths — dystopian megastructures, weathered civilizations, and handcrafted sci-fi worlds.", tone: "#8C5A42" },
  { id: "p4", label: "Khauf (Web Series)", kind: "project", year: "2025", role: "Production Designer", note: "Every room tells a darker story — haunting domestic spaces shaped by light, shadow, and unease.", tone: "#3E4A5C" },
  { id: "p5", label: "Tere Ishk Mein", kind: "project", year: "2025", role: "Production Designer", note: "Romance shaped through atmosphere — poetic spaces, rich textures, and expressive production design.", tone: "#3E4A5C" },
  { id: "about", label: "About", kind: "about" },
  { id: "press", label: "Press", kind: "press" },
  { id: "contact", label: "Contact", kind: "contact" },
];

const PROJECT_CHAPTERS = CHAPTERS.filter((c) => c.kind === "project");

export default function Backlot() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [indexOpen, setIndexOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Track which chapter is active via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
            const idx = sectionRefs.current.indexOf(entry.target);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { threshold: [0.55] }
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToIndex = useCallback((idx) => {
    const el = sectionRefs.current[idx];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setIndexOpen(false);
  }, []);

  return (
    <div
      style={{
        fontFamily:
          "'Helvetica Neue', Arial, sans-serif",
        background: "#0A0A0A",
        color: "#F2EFEA",
        position: "relative",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <GlobalStyle />

      {/* Page-load leader: black frame that pulls back like a shutter */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "#0A0A0A",
          zIndex: 200,
          pointerEvents: "none",
          transform: loaded ? "scaleY(0)" : "scaleY(1)",
          transformOrigin: "top",
          transition: "transform 900ms cubic-bezier(0.76, 0, 0.24, 1)",
        }}
      />

      <Filmstrip
        chapters={CHAPTERS}
        activeIndex={activeIndex}
        menuOpen={indexOpen}
        onOpenIndex={() => setIndexOpen((v) => !v)}
      />

      <ChapterIndexOverlay
        open={indexOpen}
        chapters={CHAPTERS}
        onSelect={scrollToIndex}
        onClose={() => setIndexOpen(false)}
      />

      <div
        ref={containerRef}
        style={{
          height: "100vh",
          overflowY: "auto",
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
        }}
      >
        {CHAPTERS.map((chapter, i) => (
          <Frame
            key={chapter.id}
            ref={(el) => (sectionRefs.current[i] = el)}
            chapter={chapter}
            isActive={i === activeIndex}
            onNext={() => scrollToIndex(Math.min(i + 1, CHAPTERS.length - 1))}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Global type / motion / focus styles ---------------- */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,500;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');

      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }

      .backlot-display {
        font-family: 'Bodoni Moda', Georgia, serif;
        letter-spacing: 0.01em;
      }
      .backlot-eyebrow {
        font-family: 'Inter', sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.28em;
        font-weight: 500;
      }
      .backlot-body {
        font-family: 'Inter', sans-serif;
        font-weight: 300;
      }

      .backlot-focusable:focus-visible {
        outline: 2px solid #C9B27E;
        outline-offset: 4px;
      }

      @media (prefers-reduced-motion: reduce) {
        * { transition-duration: 1ms !important; animation-duration: 1ms !important; }
      }

      ::-webkit-scrollbar { width: 0px; height: 0px; }
    `}</style>
  );
}

/* ---------------- Signature element: the Filmstrip scrubber ---------------- */

function Filmstrip({ chapters, activeIndex, onOpenIndex, menuOpen }) {
  const progress = (activeIndex / (chapters.length - 1)) * 100;

  return (
    <>
      {/* Top filmstrip bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "clamp(36px, 8vw, 38px)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          background: "rgba(10,10,10,0.55)",
          backdropFilter: "blur(6px)",
          borderBottom: "1px solid rgba(242,239,234,0.08)",
        }}
      >
        {/* sprocket ticks — hidden below 420px so it never collides with the counter/hamburger */}
        <div
          className="filmstrip-ticks"
          style={{
            flex: 1,
            height: "100%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            minWidth: 0,
          }}
        >
          {chapters.map((c, i) => {
            const left = (i / (chapters.length - 1)) * 100;
            const isPast = i <= activeIndex;
            return (
              <div
                key={c.id}
                style={{
                  position: "absolute",
                  left: `${left}%`,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: isPast ? "#C9B27E" : "rgba(242,239,234,0.25)",
                  transform: "translateX(-50%)",
                  transition: "background 400ms ease",
                }}
              />
            );
          })}
          {/* progress fill line */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              height: 1,
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, rgba(201,178,126,0.15), #C9B27E)",
              transform: "translateY(-50%)",
              transition: "width 500ms cubic-bezier(0.65,0,0.35,1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
              height: 1,
              background: "rgba(242,239,234,0.12)",
              transform: "translateY(-50%)",
            }}
          />
        </div>

        {/* chapter counter — current / total */}
        <div
          className="backlot-eyebrow filmstrip-counter"
          style={{
            fontSize: 10,
            color: "#C9B27E",
            padding: "0 12px",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {String(activeIndex + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
        </div>

        {/* hamburger trigger — opens the site menu (About / Projects / Press / Contact) */}
        <button
          onClick={onOpenIndex}
          className="backlot-focusable"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          style={{
            background: "none",
            border: "none",
            color: "#F2EFEA",
            padding: "0 18px",
            height: "100%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: "relative",
              width: 20,
              height: 14,
              display: "block",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                top: menuOpen ? 6 : 0,
                width: 20,
                height: 1.5,
                background: "#F2EFEA",
                transform: menuOpen ? "rotate(45deg)" : "none",
                transition: "top 250ms ease, transform 250ms ease",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 6,
                width: 20,
                height: 1.5,
                background: "#F2EFEA",
                opacity: menuOpen ? 0 : 1,
                transition: "opacity 200ms ease",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: 0,
                top: menuOpen ? 6 : 12,
                width: 20,
                height: 1.5,
                background: "#F2EFEA",
                transform: menuOpen ? "rotate(-45deg)" : "none",
                transition: "top 250ms ease, transform 250ms ease",
              }}
            />
          </span>
        </button>
      </div>

      <style>{`
        @media (max-width: 420px) {
          .filmstrip-ticks { display: none; }
          .filmstrip-counter { padding: 0 10px; }
        }
      `}</style>
    </>
  );
}

/* ---------------- Hamburger site menu ---------------- */

// Top-level site links the hamburger exposes. "Projects" expands to the
// individual project chapters since those are sections of this one page;
// About / Press / Contact map straight to their chapters. In a multi-page
// build, each href below would point to its own route instead of a chapter id.
const MENU_LINKS = [
  { label: "Home", chapterId: "hero" },
  {
    label: "Projects",
    chapterId: null,
    children: PROJECT_CHAPTERS.map((p) => ({ label: p.label, chapterId: p.id, year: p.year })),
  },
  { label: "About", chapterId: "about" },
  { label: "Recognition", chapterId: "press" },
  { label: "Contact", chapterId: "contact" },
];

function ChapterIndexOverlay({ open, chapters, onSelect, onClose }) {
  const [projectsExpanded, setProjectsExpanded] = useState(false);

  const goTo = (chapterId) => {
    const idx = chapters.findIndex((c) => c.id === chapterId);
    if (idx !== -1) onSelect(idx);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label="Site menu"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 150,
        background: "#0A0A0A",
        pointerEvents: open ? "auto" : "none",
        opacity: open ? 1 : 0,
        transition: "opacity 500ms ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 24px",
        }}
      >
        <span
          className="backlot-eyebrow"
          style={{ fontSize: 11, color: "#C9B27E" }}
        >
          Menu
        </span>
        <button
          onClick={onClose}
          className="backlot-focusable"
          aria-label="Close menu"
          style={{
            background: "none",
            border: "none",
            color: "#F2EFEA",
            fontSize: 13,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Close ✕
        </button>
      </div>

      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 8vw",
          overflowY: "auto",
        }}
      >
        {MENU_LINKS.map((link) => {
          const hasChildren = !!link.children;
          return (
            <div
              key={link.label}
              style={{
                borderBottom: "1px solid rgba(242,239,234,0.08)",
              }}
            >
              <button
                onClick={() =>
                  hasChildren ? setProjectsExpanded((v) => !v) : goTo(link.chapterId)
                }
                className="backlot-focusable"
                aria-expanded={hasChildren ? projectsExpanded : undefined}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  padding: "16px 0",
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  color: "#F2EFEA",
                }}
              >
                <span
                  className="backlot-display"
                  style={{
                    fontSize: "clamp(28px, 6vw, 56px)",
                    fontWeight: 400,
                  }}
                >
                  {link.label}
                </span>
                {hasChildren && (
                  <span
                    className="backlot-eyebrow"
                    style={{
                      fontSize: 11,
                      color: "#C9B27E",
                      transform: projectsExpanded ? "rotate(180deg)" : "none",
                      transition: "transform 250ms ease",
                    }}
                  >
                    ▾
                  </span>
                )}
              </button>

              {hasChildren && (
                <div
                  style={{
                    maxHeight: projectsExpanded ? 400 : 0,
                    overflow: "hidden",
                    transition: "max-height 400ms ease",
                  }}
                >
                  {link.children.map((child) => (
                    <button
                      key={child.chapterId}
                      onClick={() => goTo(child.chapterId)}
                      className="backlot-focusable backlot-body"
                      style={{
                        width: "100%",
                        background: "none",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        padding: "10px 0 10px 6px",
                        display: "flex",
                        justifyContent: "space-between",
                        color: "#B9B5AC",
                        fontSize: "clamp(15px, 2.4vw, 18px)",
                        fontStyle: "italic",
                      }}
                    >
                      <span>{child.label}</span>
                      <span style={{ opacity: 0.5, fontStyle: "normal" }}>{child.year}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

/* ---------------- Per-chapter Frame router ---------------- */

const Frame = React.forwardRef(({ chapter, isActive, onNext }, ref) => {
  const baseStyle = {
    height: "100vh",
    width: "100%",
    scrollSnapAlign: "start",
    scrollSnapStop: "always",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflow: "hidden",
  };

  if (chapter.kind === "hero") {
    return <HeroFrame ref={ref} style={baseStyle} isActive={isActive} onNext={onNext} />;
  }
  if (chapter.kind === "project") {
    return (
      <ProjectFrame
        ref={ref}
        style={baseStyle}
        isActive={isActive}
        chapter={chapter}
      />
    );
  }
  if (chapter.kind === "about") {
    return <AboutFrame ref={ref} style={baseStyle} isActive={isActive} />;
  }
  if (chapter.kind === "press") {
    return <PressFrame ref={ref} style={baseStyle} isActive={isActive} />;
  }
  if (chapter.kind === "contact") {
    return <ContactFrame ref={ref} style={baseStyle} isActive={isActive} />;
  }
  return null;
});

/* ---------------- Hero: opening shot ---------------- */

const HeroFrame = React.forwardRef(({ style, isActive, onNext }, ref) => (
  <section ref={ref} style={style} aria-label="Opening">
    {/* faux still: gradient standing in for a desaturated production photo */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse at 30% 40%, rgba(60,55,48,0.9), #0A0A0A 70%), linear-gradient(160deg, #14120F, #0A0A0A)",
        transform: isActive ? "scale(1)" : "scale(1.06)",
        transition: "transform 1400ms ease",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "repeating-linear-gradient(180deg, transparent 0 2px, rgba(0,0,0,0.18) 2px 4px)",
        opacity: 0.5,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />

    <div
      style={{
        position: "relative",
        zIndex: 2,
        textAlign: "center",
        padding: "0 6vw",
        opacity: isActive ? 1 : 0,
        transform: isActive ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 900ms ease 200ms, transform 900ms ease 200ms",
      }}
    >
      <p
        className="backlot-eyebrow"
        style={{ fontSize: 12, color: "#C9B27E", marginBottom: 28 }}
      >
        Production Designer
      </p>
      <h1
        className="backlot-display"
        style={{
          fontSize: "clamp(48px, 11vw, 140px)",
          lineHeight: 0.95,
          margin: 0,
          fontWeight: 400,
        }}
      >
        Zihani Nitin Choudhary
      </h1>
      <p
        className="backlot-body"
        style={{
          fontSize: "clamp(14px, 1.6vw, 18px)",
          color: "#B9B5AC",
          maxWidth: 520,
          margin: "28px auto 0",
          lineHeight: 1.6,
        }}
      >
        Crafting immersive worlds for film — where every frame tells a story.
      </p>
    </div>

    <ScrollCue onClick={onNext} isActive={isActive} />
  </section>
));

function ScrollCue({ onClick, isActive }) {
  return (
    <button
      onClick={onClick}
      className="backlot-focusable"
      aria-label="Scroll to next chapter"
      style={{
        position: "absolute",
        bottom: 40,
        left: "50%",
        transform: "translateX(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#C9B27E",
        opacity: isActive ? 0.85 : 0,
        transition: "opacity 800ms ease 600ms",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        className="backlot-eyebrow"
        style={{ fontSize: 10, color: "#B9B5AC" }}
      >
        Scroll
      </span>
      <span
        style={{
          width: 1,
          height: 36,
          background:
            "linear-gradient(180deg, #C9B27E, transparent)",
          animation: isActive ? "pulseLine 2.2s ease-in-out infinite" : "none",
        }}
      />
      <style>{`
        @keyframes pulseLine {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </button>
  );
}

/* ---------------- Project chapter: one "scene" per project ---------------- */

const ProjectFrame = React.forwardRef(({ style, isActive, chapter }, ref) => (
  <section ref={ref} style={style} aria-label={chapter.label}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle at 70% 30%, ${chapter.tone}33, #0A0A0A 65%)`,
        transition: "background 600ms ease",
      }}
    />
    {/* parallax "set piece" block — standing in for a production still.
        Hidden on narrow screens (see .project-setpiece media query below)
        so it never collides with the text column; on mobile the radial
        gradient above carries the per-project color identity instead. */}
    <div
      className="project-setpiece"
      style={{
        position: "absolute",
        right: "6vw",
        top: "50%",
        width: "min(42vw, 560px)",
        height: "min(60vh, 620px)",
        transform: isActive
          ? "translateY(-50%) scale(1)"
          : "translateY(-46%) scale(0.96)",
        background: `linear-gradient(155deg, ${chapter.tone}, #15130F)`,
        borderRadius: 2,
        boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)",
        transition: "transform 1100ms cubic-bezier(0.22,1,0.36,1)",
        opacity: isActive ? 1 : 0,
      }}
    />

    <div
      className="project-text"
      style={{
        position: "relative",
        zIndex: 2,
        padding: "0 6vw",
        maxWidth: 620,
        opacity: isActive ? 1 : 0,
        transform: isActive ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 800ms ease 150ms, transform 800ms ease 150ms",
      }}
    >
      <p className="backlot-eyebrow" style={{ fontSize: 11, color: "#C9B27E" }}>
        {chapter.year} &nbsp;·&nbsp; {chapter.role}
      </p>
      <h2
        className="backlot-display"
        style={{
          fontSize: "clamp(36px, 7vw, 88px)",
          fontStyle: "italic",
          fontWeight: 400,
          margin: "18px 0 22px",
          lineHeight: 1,
        }}
      >
        {chapter.label}
      </h2>
      <p
        className="backlot-body"
        style={{ fontSize: 16, color: "#C7C3BA", lineHeight: 1.7, maxWidth: 460 }}
      >
        {chapter.note}
      </p>
    </div>

    <style>{`
      @media (max-width: 700px) {
        .project-setpiece { display: none; }
        .project-text { max-width: 100% !important; padding: 0 7vw !important; }
        .project-text p:last-child { max-width: 100% !important; }
      }
    `}</style>
  </section>
));

/* ---------------- About: director's statement ---------------- */

const AboutFrame = React.forwardRef(({ style, isActive }, ref) => (
  <section ref={ref} style={style} aria-label="About">
    <div style={{ position: "absolute", inset: 0, background: "#0F0E0C" }} />
    <div
      style={{
        position: "relative",
        zIndex: 2,
        padding: "0 6vw",
        maxWidth: 760,
        margin: "0 auto",
        textAlign: "left",
        opacity: isActive ? 1 : 0,
        transform: isActive ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 800ms ease 150ms, transform 800ms ease 150ms",
      }}
    >
      <p className="backlot-eyebrow" style={{ fontSize: 11, color: "#C9B27E" }}>
        About
      </p>
      <h2
        className="backlot-display"
        style={{
          fontSize: "clamp(28px, 5vw, 56px)",
          lineHeight: 1.25,
          margin: "20px 0 0",
          fontWeight: 400,
        }}
      >
        Crafting Cinematic Worlds Through Visionary Production Design and Spatial Storytelling.
      </h2>
      <p
        className="backlot-body"
        style={{
          fontSize: 16,
          color: "#B9B5AC",
          lineHeight: 1.8,
          marginTop: 28,
          maxWidth: 560,
        }}
      >
Nithin Zihani Choudhary creates immersive cinematic environments where every space enhances storytelling, emotion, and atmosphere through thoughtful production design.
      </p>
    </div>
  </section>
));

/* ---------------- Press: quiet marquee ---------------- */

const PRESS_ITEMS = [
    "National Film Award — Best Production Design, 2026 (Kalki 2898-AD)",
        "Filmfare Awards South — Best Production Design, 2025 (Kalki 2898-AD)",
  "Filmfare Award — Best Production Design, 2019 (Tumbbad)",
  "Zee Cine Award — Best Production Design, 2019 (Tumbbad)",
  "Critics' Choice Film Award — Best Production Design, 2019 (Tumbbad)",
  "FOI Online Awards — Best Production Design, 2018 (Tumbbad)",

];

const PressFrame = React.forwardRef(({ style, isActive }, ref) => (
  <section ref={ref} style={style} aria-label="Press and awards">
    <div style={{ position: "absolute", inset: 0, background: "#0A0A0A" }} />

    <div
      style={{
        position: "relative",
        zIndex: 2,
        padding: "0 6vw",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        opacity: isActive ? 1 : 0,
        transition: "opacity 900ms ease 150ms",
      }}
    >
      <p
        className="backlot-eyebrow"
        style={{
          fontSize: "clamp(10px, 2vw, 11px)",
          color: "#C9B27E",
          marginBottom: "clamp(20px, 4vw, 36px)",
        }}
      >
        Recognition
      </p>

      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {PRESS_ITEMS.map((item, i) => (
          <li
            key={i}
            className="backlot-display"
            style={{
              fontSize: "clamp(15px, 2.8vw, 32px)",
              fontWeight: 400,
              color: "#E7E3DA",
              padding: "clamp(10px, 2vw, 16px) 0",
              borderTop:
                i === 0 ? "1px solid rgba(242,239,234,0.12)" : "none",
              borderBottom: "1px solid rgba(242,239,234,0.12)",
              lineHeight: 1.35,
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  </section>
));

/* ---------------- Contact: end card ---------------- */

const ContactFrame = React.forwardRef(({ style, isActive }, ref) => (
  <section ref={ref} style={style} aria-label="Contact">
    <div style={{ position: "absolute", inset: 0, background: "#000" }} />

    <div
      style={{
        position: "relative",
        zIndex: 2,
        textAlign: "center",
        padding: "0 6vw",
        maxWidth: "100%",
        overflowX: "hidden",
        opacity: isActive ? 1 : 0,
        transform: isActive ? "translateY(0)" : "translateY(20px)",
        transition:
          "opacity 1000ms ease 200ms, transform 1000ms ease 200ms",
      }}
    >
      <p
        className="backlot-eyebrow"
        style={{
          fontSize: "clamp(10px, 2vw, 11px)",
          color: "#C9B27E",
          padding: "0 10px",
        }}
      >
        Designing Worlds for Film, Television & Commercials
      </p>

      <h2
        className="backlot-display"
        style={{
          fontSize: "min(5vw, 72px)",
          margin: "22px 0 0",
          fontWeight: 400,
          whiteSpace: "nowrap",
          lineHeight: 1.1,
        }}
      >
        admin@zihaniproduction.com
      </h2>

      <p
        className="backlot-body"
        style={{
          marginTop: 16,
          fontSize: "clamp(12px, 2vw, 15px)",
          color: "#B9B5AC",
          letterSpacing: "0.06em",
          whiteSpace: "nowrap",
        }}
      >
        zihaniproduction@gmail.com
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "clamp(20px, 5vw, 40px)",
          marginTop: 40,
          flexWrap: "wrap",
        }}
      >
        <a
          href="https://www.imdb.com/name/nm9960811/"
          target="_blank"
          rel="noopener noreferrer"
          className="backlot-body backlot-focusable"
          style={{
            fontSize: 13,
            color: "#B9B5AC",
            textDecoration: "none",
            letterSpacing: "0.08em",
            borderBottom: "1px solid rgba(242,239,234,0.3)",
            paddingBottom: 4,
          }}
        >
          IMDb
        </a>

        <span
          className="backlot-body"
          style={{
            fontSize: 13,
            color: "#B9B5AC",
            letterSpacing: "0.08em",
          }}
        >
          +91 89200 13944
        </span>
      </div>

      <p
        className="backlot-body"
        style={{
          fontSize: "clamp(10px, 2vw, 11px)",
          color: "#5C5A55",
          marginTop: 64,
          padding: "0 10px",
        }}
      >
        © 2026 Zihani Nitin Choudhary. All rights reserved.
      </p>
    </div>
  </section>
));
