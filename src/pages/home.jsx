import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { tracks } from '../components/tracks';
import '../pagesCss/home.css';

// ── Tiny pie chart (SVG) ──────────────────────────────────────────────────────
const PieChart = ({ slices }) => {
  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const r = 46;
  const total = slices.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2a2a3a" strokeWidth="22" />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="10" fill="#555">No data</text>
      </svg>
    );
  }

  let cursor = -Math.PI / 2;
  const paths = slices.map((slice) => {
    const angle = (slice.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cursor);
    const y1 = cy + r * Math.sin(cursor);
    cursor += angle;
    const x2 = cx + r * Math.cos(cursor);
    const y2 = cy + r * Math.sin(cursor);
    const large = angle > Math.PI ? 1 : 0;
    return { d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`, color: slice.color, label: slice.label };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} stroke="#0d0d14" strokeWidth="2" />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.52} fill="#0d0d14" />
    </svg>
  );
};

// ── Progress bar row ──────────────────────────────────────────────────────────
const BarRow = ({ label, amount, total, color }) => {
  const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
  return (
    <div className="ms-bar-row">
      <div className="ms-bar-meta">
        <span className="ms-bar-label">{label}</span>
        <span className="ms-bar-pct">{pct}%</span>
      </div>
      <div className="ms-bar-track">
        <div className="ms-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="ms-bar-amount">R{amount.toLocaleString()}</span>
    </div>
  );
};

// ── Collect all milestones from tracks.js (max 3) ────────────────────────────
const getAllMilestones = () => {
  const results = [];
  Object.entries(tracks).forEach(([trackId, track]) => {
    Object.entries(track.years).forEach(([yearKey, yearData]) => {
      yearData.milestones.forEach((m) => {
        if (results.length < 3) {
          results.push({
            title: m.title,
            track: track.name,
            year: yearData.label,
            trackId,
            yearKey,
          });
        }
      });
    });
  });
  return results;
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
const Home = () => {
  const username = localStorage.getItem('username') || 'there';

  // ── Pull journal entries from localStorage (written by FinancialJournal) ──
  const [journalEntries, setJournalEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem('journalEntries') || '[]'); }
    catch { return []; }
  });

  // ── Pull fixed costs from localStorage (written by FixedCosts) ────────────
  const [fixedCosts, setFixedCosts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fixedCosts') || '[]');
    } catch {
      return [];
    }
  });

  // ── Pull debts from localStorage (written by DebtPage) ───────────────────
  const [debts, setDebts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('debts') || '[]'); }
    catch { return []; }
  });

  // Sync from localStorage whenever the tab is focused
  useEffect(() => {
    const sync = () => {
      try { setJournalEntries(JSON.parse(localStorage.getItem('journalEntries') || '[]')); } catch {}
      try { setFixedCosts(JSON.parse(localStorage.getItem('fixedCosts') || '[]')); } catch {}
      try { setDebts(JSON.parse(localStorage.getItem('debts') || '[]')); } catch {}
    };
    window.addEventListener('focus', sync);
    const interval = setInterval(sync, 1500);
    return () => { window.removeEventListener('focus', sync); clearInterval(interval); };
  }, []);

  // ── Income calculations ───────────────────────────────────────────────────
  const incomeEntries = journalEntries.filter(e => e.type === 'income');
  const totalIncome = incomeEntries.reduce((s, e) => s + e.amount, 0);
  const salaryIncome = incomeEntries.filter(e => e.category === 'salary').reduce((s, e) => s + e.amount, 0);
  const investmentIncome = incomeEntries.filter(e => e.category === 'investment').reduce((s, e) => s + e.amount, 0);
  const giftIncome = incomeEntries.filter(e => e.category === 'gift').reduce((s, e) => s + e.amount, 0);

  // ── Fixed cost calculations ───────────────────────────────────────────────
  const totalFixed = fixedCosts.reduce((s, c) => s + Number(c.amount), 0);
  const utilityTotal = fixedCosts.filter(c => c.category === 'utility').reduce((s, c) => s + Number(c.amount), 0);
  const insuranceTotal = fixedCosts.filter(c => c.category === 'insurance').reduce((s, c) => s + Number(c.amount), 0);
  const carTotal = fixedCosts.filter(c => c.category === 'carFinance').reduce((s, c) => s + Number(c.amount), 0);

  // ── Debt calculations ─────────────────────────────────────────────────────
  const totalDebt = debts.reduce((s, d) => s + Number(d.totalAmount || 0), 0);
  const DEBT_COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa'];

  // ── Milestones ────────────────────────────────────────────────────────────
  const milestones = getAllMilestones();

  // ── Animate milestones on mount ───────────────────────────────────────────
  const milestonesRef = useRef(null);
  useEffect(() => {
    const items = milestonesRef.current?.querySelectorAll('.ms-milestone-item');
    items?.forEach((el, i) => {
      el.style.animationDelay = `${0.1 + i * 0.12}s`;
      el.classList.add('ms-rise');
    });
  }, []);

  return (
    <div className="ms-page">
      {/* ── Page title (outside the grid square) ── */}
      <div className="ms-page-title">
        <h1 className="ms-greeting">Hello, {username}</h1>
        <p className="ms-subtitle">Moneyshot Dashboard</p>
      </div>

      {/* ── Main dashboard grid ── */}
      <div className="ms-grid">

        {/* ── LEFT COLUMN: milestones + debt ── */}
        <div className="ms-left-col">

          {/* Milestones */}
          <div className="ms-panel ms-milestones" ref={milestonesRef}>
            <h2 className="ms-panel-title">Milestones</h2>
            <Link to="/strategyOverview" className="ms-panel-link">Open Strategy Tracks →</Link>
            {milestones.length === 0 ? (
              <p className="ms-empty">No milestones yet.</p>
            ) : (
              milestones.map((m, i) => (
                <div key={i} className="ms-milestone-item">
                  <span className="ms-milestone-title">{m.title}</span>
                  <div className="ms-tags">
                    <span className="ms-tag ms-tag-track">{m.track}</span>
                    <span className="ms-tag ms-tag-year">{m.year}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Debt breakdown — full width of left col */}
          <div className="ms-panel ms-debts">
            <h2 className="ms-panel-title">Debts</h2>
            <div className="ms-debts-inner">
              <div className="ms-debts-list">
                {debts.length === 0 ? (
                  <p className="ms-empty">No debts recorded.</p>
                ) : (
                  debts.map((debt, i) => {
                    const paid = Number(debt.paidAmount || 0);
                    const total = Number(debt.totalAmount || 0);
                    const pct = total > 0 ? Math.round((paid / total) * 100) : 0;
                    return (
                      <div key={i} className="ms-debt-row">
                        <div className="ms-debt-meta">
                          <span className="ms-debt-name">{debt.name}</span>
                          <span className="ms-debt-pct">{pct}%</span>
                        </div>
                        <div className="ms-bar-track">
                          <div className="ms-bar-fill" style={{ width: `${pct}%`, background: DEBT_COLORS[i % DEBT_COLORS.length] }} />
                        </div>
                        <span className="ms-debt-amounts">R{paid.toLocaleString()} / R{total.toLocaleString()}</span>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="ms-debts-chart">
                <PieChart
                  slices={debts.map((d, i) => ({
                    label: d.name,
                    value: Number(d.totalAmount || 0),
                    color: DEBT_COLORS[i % DEBT_COLORS.length],
                  }))}
                />
                <div className="ms-pie-legend">
                  {debts.map((d, i) => (
                    <div key={i} className="ms-legend-item">
                      <span className="ms-legend-dot" style={{ background: DEBT_COLORS[i % DEBT_COLORS.length] }} />
                      <span className="ms-legend-label">{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/debtPage" className="ms-panel-link">View Debts →</Link>
          </div>
        </div>

        {/* ── MIDDLE COLUMN: total income ── */}
        <div className="ms-panel ms-income">
          <div className="ms-stat-header">
            <span className="ms-big-number">R{totalIncome.toLocaleString()}</span>
            <span className="ms-stat-label">Total income this month</span>
          </div>
          <div className="ms-bars">
            <BarRow label="Salary" amount={salaryIncome} total={totalIncome} color="#6366f1" />
            <BarRow label="Investments" amount={investmentIncome} total={totalIncome} color="#22d3ee" />
            <BarRow label="Gifts" amount={giftIncome} total={totalIncome} color="#f59e0b" />
          </div>
          <Link to="/financialJournal" className="ms-panel-link">View Journal →</Link>
        </div>

        {/* ── RIGHT COLUMN: total fixed costs ── */}
        <div className="ms-panel ms-fixed">
          <div className="ms-stat-header">
            <span className="ms-big-number">R{totalFixed.toLocaleString()}</span>
            <span className="ms-stat-label">Total fixed costs this month</span>
          </div>
          <div className="ms-bars">
            <BarRow label="Utilities" amount={utilityTotal} total={totalFixed} color="#10b981" />
            <BarRow label="Insurance" amount={insuranceTotal} total={totalFixed} color="#f43f5e" />
            <BarRow label="Car Finance" amount={carTotal} total={totalFixed} color="#a78bfa" />
          </div>
          <Link to="/fixedCosts" className="ms-panel-link">View Fixed Costs →</Link>
        </div>

      </div>
    </div>
  );
};

export default Home;
