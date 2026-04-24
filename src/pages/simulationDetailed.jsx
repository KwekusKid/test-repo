import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import simulations from '../components/simulationData';
import '../pagesCss/simulationDetailed.css';

const HISTORY_KEY = 'simulationHistory';

/* ── South African concept definitions ── */
const CONCEPT_DEFINITIONS = {
  'Property Ownership': 'Owning physical property in South Africa — whether a house, flat, or land — typically financed through a home loan (bond) from a bank like Absa, Standard Bank, or Nedbank. The property is registered through the Deeds Office and transfer is handled by a conveyancing attorney. Ownership builds equity over time as your bond is paid down and property values appreciate.',
  'REIT Investing': 'A Real Estate Investment Trust (REIT) is a company listed on the JSE (Johannesburg Stock Exchange) that owns income-generating property — such as shopping malls, office parks, or warehouses. Examples include Growthpoint, Redefine, and Fortress. REITs distribute at least 75% of taxable earnings as dividends, giving investors exposure to property without directly buying it.',
  'Retirement Annuity': 'A Retirement Annuity (RA) is a long-term savings vehicle regulated by SARS and the Pension Funds Act. Contributions of up to 27.5% of taxable income (capped at R350,000 per year) are tax-deductible, reducing your annual SARS bill. Funds are locked until age 55. At retirement, one-third can be taken as a lump sum and the remainder must be used to purchase an annuity income.',
  'Tax-Free Savings Account': 'A Tax-Free Savings Account (TFSA) allows you to invest up to R36,000 per tax year and R500,000 over your lifetime completely free of income tax, capital gains tax, and dividends tax. Any growth and withdrawals are tax-free, making it one of the most powerful long-term savings tools available to South Africans. Excess contributions are penalised at 40% by SARS.',
  'Local Corporate Career': 'Building a career within South African companies — from large corporates like Naspers and Anglo American to listed financial services firms. Local careers benefit from rand-denominated salaries, structured HR environments, corporate benefits like medical aid contributions, and access to South African professional networks and mentorship programmes.',
  'Remote International Work': 'Earning in foreign currency (USD, EUR, GBP) while living in South Africa. Under the Foreign Employment Income Exemption, income above R1.25 million earned working abroad is taxable. Remote workers living in SA earning foreign income must declare it to SARS and may benefit from double-taxation treaties. The weak ZAR exchange rate can significantly amplify local purchasing power.',
  'Income Growth': 'Strategically increasing your earning capacity over time through salary negotiations, promotions, upskilling, or side income. In South Africa, industries like law, finance, engineering, and technology offer strong income growth trajectories. Adjusting for inflation (tracked by Stats SA via CPI) is critical — real income growth means earning more than the prevailing inflation rate.',
  'Extreme Frugality': 'A financial independence strategy that aggressively cuts personal expenses to maximise the savings rate. In the South African context this might mean avoiding lifestyle inflation as income grows, meal prepping, using public transport, and limiting discretionary spending. A high savings rate reduces the FI target since lower annual expenses require a smaller investment portfolio under the 4% rule.',
  'Emergency Fund': 'A liquid cash reserve set aside to cover unexpected expenses — job loss, medical emergencies, or urgent repairs — without going into debt. South African financial planners typically recommend 3 to 6 months of expenses held in an accessible account like a money market fund or 32-day notice account. Given SA\'s economic volatility, a well-funded emergency cushion is especially important.',
  'Financial Safety Net': 'The broader system of financial protections that reduce vulnerability to economic shocks. In South Africa this includes an emergency fund, appropriate short-term insurance (covering car, home, and contents), life and disability cover, and access to credit facilities. A solid safety net prevents one bad financial event from derailing long-term progress.',
  'Liquidity': 'The ease with which an asset can be converted to cash without losing value. In South Africa, a savings account or money market fund offers high liquidity. Property is highly illiquid — selling can take months and involves transfer duties, estate agent fees, and conveyancing costs. Understanding liquidity is crucial when balancing short-term needs against long-term investment goals.',
};

const formatValue = (value, format) => {
  if (value === null || value === undefined) return '—';
  switch (format) {
    case 'currency':
      return `R ${Number(value).toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    case 'years':
      return typeof value === 'number' ? `${value} years` : value;
    case 'text':
      return value;
    default:
      return value;
  }
};

const saveToHistory = (simulation, inputs, results) => {
  const existing = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  const entry = {
    historyId: `${simulation.id}-${Date.now()}`,
    id: simulation.id,
    title: simulation.title,
    description: simulation.description,
    type: simulation.type,
    priority: simulation.priorities?.[0] || 'wealthGrowth',
    date: new Date().toISOString(),
    inputs,
    results,
  };
  const filtered = existing.filter(e => e.id !== simulation.id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...filtered]));
};

/* ── Info Center Sidebar ── */
const InfoCenter = ({ concepts }) => {
  const [openConcept, setOpenConcept] = useState(null);

  const toggle = (concept) => {
    setOpenConcept(prev => prev === concept ? null : concept);
  };

  return (
    <aside className="info-center">
      <div className="info-center-header">
        <span className="info-center-label">Information Center</span>
      </div>
      <div className="info-center-list">
        {concepts.map((concept) => {
          const isOpen = openConcept === concept;
          return (
            <div key={concept} className={`info-concept-item ${isOpen ? 'open' : ''}`}>
              <button className="info-concept-trigger" onClick={() => toggle(concept)}>
                <span>{concept}</span>
                <span className="info-concept-chevron">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="info-concept-body">
                  {CONCEPT_DEFINITIONS[concept]
                    ? <p>{CONCEPT_DEFINITIONS[concept]}</p>
                    : <p className="info-no-def">Definition coming soon.</p>
                  }
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

/* ── Mini Simulation Panel ── */
const MiniSimulation = ({ simulation, prefill }) => {
  const { miniSimulation } = simulation;
  const [inputValues, setInputValues] = useState(
    prefill?.inputs
      ? Object.fromEntries(Object.entries(prefill.inputs).map(([k, v]) => [k, String(v)]))
      : {}
  );
  const prefillResults = prefill?.inputs ? miniSimulation.calculate(prefill.inputs) : null;
  const [results, setResults] = useState(prefillResults || null);
  const [hasRun, setHasRun] = useState(!!prefillResults);
  const [savedToHistory, setSavedToHistory] = useState(false);

  const handleRun = () => {
    const parsed = {};
    for (const input of miniSimulation.inputs) {
      const val = parseFloat(inputValues[input.name]);
      if (isNaN(val) || val <= 0) return;
      parsed[input.name] = val;
    }
    const output = miniSimulation.calculate(parsed);
    const { yearlyBreakdown, ...storableResults } = output;
    setResults(output);
    setHasRun(true);
    setSavedToHistory(true);
    saveToHistory(simulation, parsed, storableResults);
  };

  const allFilled = miniSimulation.inputs.every(
    input => inputValues[input.name] && parseFloat(inputValues[input.name]) > 0
  );

  return (
    <div className="sim-panels-row">
      <div className="sim-panel glow-card">
        <div className="sim-panel-header">
          <span className="sim-panel-label">Inputs</span>
        </div>
        <div className="mini-sim-inputs">
          {miniSimulation.inputs.map(input => (
            <div key={input.name} className="mini-form-group">
              <label htmlFor={`mini-${input.name}`}>{input.label}</label>
              <input
                id={`mini-${input.name}`}
                type="number"
                placeholder={input.placeholder || input.label}
                value={inputValues[input.name] || ''}
                onChange={e => setInputValues(prev => ({ ...prev, [input.name]: e.target.value }))}
                className="mini-form-input"
              />
            </div>
          ))}
        </div>
        <div className="run-sim-row">
          <button className="run-mini-btn" onClick={handleRun} disabled={!allFilled}>
            Run Simulation
          </button>
          {savedToHistory && <span className="saved-badge">✓ Saved</span>}
        </div>
        <p className="mini-sim-disclaimer">⚠ {miniSimulation.assumptions}</p>
      </div>

      <div className={`sim-panel glow-card results-panel ${hasRun ? 'has-results' : 'empty-results'}`}>
        <div className="sim-panel-header">
          <span className="sim-panel-label">Results</span>
        </div>
        {!hasRun ? (
          <div className="results-empty-state">
            <span className="empty-icon">◎</span>
            <p>Run the simulation to see your results</p>
          </div>
        ) : (
          <>
            <div className="results-grid">
              {miniSimulation.outputs
                .filter(o => o.format !== 'table')
                .map(output => (
                  <div key={output.key} className="result-card">
                    <span className="result-label">{output.label}</span>
                    <span className="result-value">{formatValue(results[output.key], output.format)}</span>
                  </div>
                ))}
            </div>
            {miniSimulation.outputs.some(o => o.format === 'table') && results.yearlyBreakdown && (
              <div className="yearly-breakdown">
                <h4>Year-by-Year Growth</h4>
                <div className="breakdown-table">
                  <div className="breakdown-header">
                    <span>Year</span><span>Total Saved</span>
                  </div>
                  {results.yearlyBreakdown.map(row => (
                    <div key={row.year} className="breakdown-row">
                      <span>Year {row.year}</span>
                      <span>{formatValue(row.amount, 'currency')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* ── Pros & Cons Table ── */
const ProsConsTable = ({ prosCons }) => {
  const { left, right } = prosCons;
  const renderItems = (items, type) =>
    items?.map(item => (
      <div key={item.id} className={`pc-item pc-${type}`}>
        <span className="pc-marker">{type === 'pro' ? '+' : '−'}</span>
        <div className="pc-item-text">
          <strong>{item.title}</strong>
          <p>{item.description}</p>
        </div>
      </div>
    ));

  return (
    <div className="pros-cons-table glow-card">
      <div className="pc-header-row">
        <div className="pc-col-header"><span className="pc-side-tag">{left.title}</span></div>
        <div className="pc-divider-head" />
        <div className="pc-col-header"><span className="pc-side-tag">{right.title}</span></div>
      </div>
      <div className="pc-body">
        <div className="pc-col">
          {renderItems(left.pros, 'pro')}
          {renderItems(left.cons, 'con')}
        </div>
        <div className="pc-divider" />
        <div className="pc-col">
          {renderItems(right.pros, 'pro')}
          {renderItems(right.cons, 'con')}
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const SimulationDetailed = () => {
  const { simulationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const historyEntry = location.state?.historyEntry || null;

  const getSimulationById = (id) => {
    for (const priority in simulations) {
      const sim = simulations[priority].find(s => s.id === id);
      if (sim) return sim;
    }
    return null;
  };

  const simulation = getSimulationById(simulationId);

  if (!simulation) {
    return (
      <div className="sim-page-shell">
        <div className="simulation-detailed">
          <div className="not-found">
            <h2>Simulation not found</h2>
            <button onClick={() => navigate('/simulationOverview')}>← Back</button>
          </div>
        </div>
      </div>
    );
  }

  const typeLabel = simulation.type === 'comparison' ? 'Comparison' : 'Calculator';
  const concepts = simulation.concepts || [];

  return (
    <div className="sim-page-shell">

      {/* ── Main content ── */}
      <div className="simulation-detailed">

        <div className="sim-detail-header">
          <button className="back-btn" onClick={() => navigate('/simulationOverview')}>
            ← Back
          </button>
          <div className="sim-title-block">
            <h1>{simulation.title}</h1>
            <p className="sim-detail-subtitle">{simulation.description}</p>
            <span className="sim-type-tag">{typeLabel}</span>
          </div>
        </div>

        {concepts.length > 0 && (
          <div className="sim-concepts-block">
            <span className="concepts-mini-title">Concepts</span>
            <div className="concepts-tags">
              {concepts.map((c, i) => (
                <span key={i} className="concept-tag">{c}</span>
              ))}
            </div>
          </div>
        )}

        {simulation.type === 'comparison' && simulation.prosCons && (
          <div className="sim-section-block">
            <h2 className="section-heading">Pros &amp; Cons</h2>
            <ProsConsTable prosCons={simulation.prosCons} />
          </div>
        )}

        {simulation.miniSimulation && (
          <div className="sim-section-block">
            <h2 className="section-heading">Run Simulation</h2>
            <p className="section-sub">Enter your values to get an estimated result.</p>
            <MiniSimulation simulation={simulation} prefill={historyEntry} />
          </div>
        )}
      </div>

      {/* ── Info Center sidebar ── */}
      {concepts.length > 0 && <InfoCenter concepts={concepts} />}

    </div>
  );
};

export default SimulationDetailed;