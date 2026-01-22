import { useAnalyzer } from "../../hooks/useAnalyzer";
import "./styled.css";

export function NavBar() {
    const {theme, handleThemeToggle} = useAnalyzer();

    return (
        <main className="navbar">
            <div></div>
            <div className="logo">&lt;bot_analyzer/&gt;</div>
            <button className="theme-toggle" onClick={handleThemeToggle} aria-label="Toggle theme">
                <i className={theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill'}></i>
            </button>
        </main>
    )
}