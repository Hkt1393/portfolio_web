import { SectionHeading } from "../../components/ui/SectionHeading";

export function About() {
  return (
    <section className="section about-section" id="about">
      <div className="container about-grid">
        <div>
          <SectionHeading
            label="ENGINEERING PHILOSOPHY"
            title="Turning Complex Ideas Into Bulletproof Software."
          />
          <p className="body-copy">
            Over the past 4+ years, I have engineered client-facing mobile
            systems and web software from blank Git repositories through scaled
            production releases. I believe mobile performance is not an
            afterthought; it is an architectural decision made on day one.
          </p>
          <p className="body-copy">
            Whether connecting offline-first synchronization protocols with
            embedded SQLite for field agents in intermittent cellular
            connectivity, or engineering real-time WebSocket portals serving
            concurrent traders, my focus remains rooted in deterministic state
            management, minimal JS-to-Native bridge latency, and strict type
            safety.
          </p>
          <div className="principles">
            <div>
              <span className="principle-icon">⌘</span>
              <b>Modular Design</b>
              <p>
                Decoupled UI systems with predictable, well-defined ownership
                boundaries.
              </p>
            </div>
            <div>
              <span className="principle-icon teal">↻</span>
              <b>Local-First Sync</b>
              <p>
                Deterministic, bidirectional data reconciliation with offline
                resilience.
              </p>
            </div>
            <div>
              <span className="principle-icon blue">◈</span>
              <b>60 FPS Native</b>
              <p>
                Native-first rendering patterns with zero-frame-drop
                interactions.
              </p>
            </div>
          </div>
        </div>
        <aside className="impact-list" aria-label="Career highlights">
          <div>
            <span className="impact-icon">↗</span>
            <b>4+ Years</b>
            <strong>Engineering Production Leadership</strong>
            <p>
              Shipping resilient experiences across mobile &amp; web platforms.
            </p>
          </div>
          <div>
            <span className="impact-icon teal">◈</span>
            <b>12+ Apps</b>
            <strong>Shipped to App Store &amp; Cloud</strong>
            <p>Production apps powering teams and customers at scale.</p>
          </div>
          <div>
            <span className="impact-icon blue">✓</span>
            <b>99.8%</b>
            <strong>Crash-Free User Sessions</strong>
            <p>Maintained across high-volume production deployments.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
