import { navigation } from "../../data/navigation";
import { site } from "../../data/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <a className="wordmark" href="#home">
            <span className="mark">H.</span>
            <span>
              <b className="wordmark-text text-3xl">{site.name}</b>
              <small>SOFTWARE ENGINEER</small>
            </span>
          </a>
          <p>
            Architecting resilient cross-platform mobile apps &amp;
            <br /> performant web applications with 4+ years of production
            experience.
          </p>
          <div className="footer-links">
            <div>
              <small>SITEMAP</small>
              {navigation.slice(0, 3).map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label === "Projects" ? "Selected Work" : link.label}
                </a>
              ))}
            </div>
            <div>
              <small>CONTACT</small>
              <a href="#contact">Contact details</a>
              <a href={`mailto:${site.email}`}>Email ↗</a>
            </div>
            <div>
              <small>AVAILABILITY</small>
              <b className="available">
                <i /> AVAILABLE FOR OPPORTUNITIES
              </b>
              <span>Full-time &amp; select contracts</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {site.name}. Engineered with React
            &amp; TypeScript.
          </span>
          <span>BUILT WITH INTENTION · DESIGNED TO LAST</span>
        </div>
      </div>
    </footer>
  );
}
