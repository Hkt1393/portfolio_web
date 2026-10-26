import { navigation } from "../../data/navigation";
import { site } from "../../data/site";
import { useTheme } from "../../hooks/useTheme";
import type { Theme } from "../../types/common";

const themes: { name: Theme; icon: string }[] = [
  { name: "light", icon: "☼" },
  { name: "dark", icon: "◐" },
  { name: "system", icon: "◉" },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="site-header">
      <nav className="nav container" aria-label="Main navigation">
        <a className="wordmark" href="#home">
          <span className="mark">H.</span>
          <span>
            <b>{site.name}</b>
            <small>SOFTWARE ENGINEER</small>
          </span>
        </a>
        <div className="nav-links">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <div className="theme-control" role="group" aria-label="Color theme">
            {themes.map(({ name, icon }) => (
              <button
                type="button"
                key={name}
                className={theme === name ? "selected" : ""}
                onClick={() => setTheme(name)}
                aria-label={`${name[0].toUpperCase()}${name.slice(1)} theme`}
                aria-pressed={theme === name}
                title={`${name[0].toUpperCase()}${name.slice(1)} theme`}
              >
                {icon}
              </button>
            ))}
          </div>
          <a className="button button-small" href="#contact">
            Let’s Talk <span>↗</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
