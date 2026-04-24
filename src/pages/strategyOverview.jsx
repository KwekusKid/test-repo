import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { tracks } from "../components/tracks";
import FinancialFreedomImg from "../images/FinancialFreedom.png";
import WealthGrowthImg from "../images/WealthGrowth.png";
import PeaceOfMindImg from "../images/PeaceOfMind.png";
import "../pagesCss/strategyOverview.css";

const StrategyOverview = () => {
    const [debts, setDebts] = useState(() => {
        try { return JSON.parse(localStorage.getItem("debts") || "[]"); }
        catch { return []; }
    });

    const [fixedCosts, setFixedCosts] = useState(() => {
        try { return JSON.parse(localStorage.getItem("fixedCosts") || "[]"); }
        catch { return []; }
    });

    useEffect(() => {
        const sync = () => {
            try { setDebts(JSON.parse(localStorage.getItem("debts") || "[]")); } catch {}
            try { setFixedCosts(JSON.parse(localStorage.getItem("fixedCosts") || "[]")); } catch {}
        };
        const interval = setInterval(sync, 1000);
        return () => clearInterval(interval);
    }, []);

    // ── Debt calculations ─────────────────────────────────────────────────────
    const totalDebt = debts.reduce((s, d) => s + Number(d.obligation || 0), 0);
    const topDebts = [...debts]
        .sort((a, b) => Number(b.obligation) - Number(a.obligation))
        .slice(0, 3);

    // ── Fixed cost calculations ───────────────────────────────────────────────
    const totalFixed = fixedCosts.reduce((s, c) => s + Number(c.amount || 0), 0);
    const topFixed = [...fixedCosts]
        .sort((a, b) => Number(b.amount) - Number(a.amount))
        .slice(0, 3);

    const trackCards = [
        {
            id: "financialFreedom",
            name: tracks.financialFreedom.name,
            description: tracks.financialFreedom.description,
            img: FinancialFreedomImg,
            accent: "#6366f1",
            path: "/track/financialFreedom",
        },
        {
            id: "investment",
            name: tracks.investment.name,
            description: tracks.investment.description,
            img: WealthGrowthImg,
            accent: "#22d3ee",
            path: "/track/investment",
        },
        {
            id: "peaceOfMind",
            name: tracks.peaceOfMind.name,
            description: tracks.peaceOfMind.description,
            img: PeaceOfMindImg,
            accent: "#10b981",
            path: "/track/peaceOfMind",
        },
    ];

    return (
        <div className="so-page">
            {/* ── Header ── */}
            <div className="so-header">
                <h1 className="so-title">Strategy Tracks</h1>
                <p className="so-subtitle">See how far you've come</p>
            </div>

            {/* ── Summary cards row ── */}
            <div className="so-summary-row">
                {/* Debt card */}
                <Link to="/debtPage" className="so-summary-card so-debt-card">
                    <div className="so-card-inner">
                        <span className="so-card-eyebrow">Monthly Obligations</span>
                        <h2 className="so-card-title">Debt Progression</h2>
                        <div className="so-card-amount">
                            <span className="so-amount-number">R{totalDebt.toLocaleString()}</span>
                            <span className="so-amount-label">total debt this month</span>
                        </div>
                        <div className="so-tags">
                            {topDebts.length === 0 ? (
                                <span className="so-tag">No debts recorded</span>
                            ) : (
                                topDebts.map((d, i) => (
                                    <span key={i} className="so-tag so-tag-debt">{d.name}</span>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="so-card-arrow">→</div>
                </Link>

                {/* Fixed costs card */}
                <Link to="/fixedCosts" className="so-summary-card so-fixed-card">
                    <div className="so-card-inner">
                        <span className="so-card-eyebrow">Monthly Commitments</span>
                        <h2 className="so-card-title">Fixed Costs</h2>
                        <div className="so-card-amount">
                            <span className="so-amount-number">R{totalFixed.toLocaleString()}</span>
                            <span className="so-amount-label">total fixed costs this month</span>
                        </div>
                        <div className="so-tags">
                            {topFixed.length === 0 ? (
                                <span className="so-tag">No costs recorded</span>
                            ) : (
                                topFixed.map((c, i) => (
                                    <span key={i} className="so-tag so-tag-fixed">{c.name}</span>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="so-card-arrow">→</div>
                </Link>
            </div>

            {/* ── Track cards row ── */}
            <div className="so-tracks-row">
                {trackCards.map((track, i) => (
                    <Link
                        key={track.id}
                        to={track.path}
                        className="so-track-card"
                        style={{ "--accent": track.accent, "--delay": `${i * 0.1}s` }}
                    >
                        <div className="so-track-top">
                            <h3 className="so-track-name">{track.name}</h3>
                            <p className="so-track-desc">{track.description}</p>
                        </div>
                        <div className="so-track-img-wrap">
                            <img
                                src={track.img}
                                alt={track.name}
                                className="so-track-img"
                            />
                        </div>
                        <div className="so-track-footer">
                            <span className="so-track-cta">View track →</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default StrategyOverview;