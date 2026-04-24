import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import simulations, { recommendedSimulation } from '../components/simulationData';
import '../pagesCss/simulationOverview.css';

const HISTORY_KEY = 'simulationHistory';

const SimulationOverview = () => {
  const navigate = useNavigate();
  const [selectedPriority, setSelectedPriority] = useState('wealthGrowth');
  const [editingTags, setEditingTags] = useState(false);
  const [tags, setTags] = useState(recommendedSimulation.tags);
  const [newTag, setNewTag] = useState('');

  // History state
  const [history, setHistory] = useState([]);
  const [historyPriorityFilter, setHistoryPriorityFilter] = useState('all');
  const [historyTypeFilter, setHistoryTypeFilter] = useState('all');

  const priorities = {
    wealthGrowth: 'Wealth Growth',
    financialFreedom: 'Financial Freedom',
  };

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    setHistory(stored);
  }, []);

  const filteredHistory = history.filter(entry => {
    const priorityMatch = historyPriorityFilter === 'all' || entry.priority === historyPriorityFilter;
    const typeMatch = historyTypeFilter === 'all' || entry.type === historyTypeFilter;
    return priorityMatch && typeMatch;
  });

  const handleSimulationClick = (simulationId) => {
    navigate(`/simulation/${simulationId}`);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const getSimulationTypeLabel = (type) => {
    switch (type) {
      case 'comparison': return 'Comparison';
      case 'calculator': return 'Calculator';
      default: return type;
    }
  };

  return (
    <div className="simulation-overview">
      {/* Header Section */}
      <div className="sim-header-section">
        <h1>Simulation Lab Overview</h1>
        <p className="sim-subtitle">Keep track of your simulations</p>
      </div>

      {/* Recommended Simulation Section */}
      <div className="sim-section">
        <h2>Recommended Simulation</h2>
        <div
          className="recommended-card"
          onClick={() => handleSimulationClick(recommendedSimulation.id)}
        >
          <div className="recommended-content">
            <h3>{recommendedSimulation.title}</h3>
            <p className="recommended-subheading">{recommendedSimulation.subheading}</p>
            <p className="recommended-description">{recommendedSimulation.description}</p>

            <div className="tags-section">
              <div className="tags-container">
                {tags.map(tag => (
                  <div key={tag} className="tag">
                    {tag}
                    {editingTags && (
                      <button
                        className="tag-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTag(tag);
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                className="edit-tags-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingTags(!editingTags);
                }}
              >
                {editingTags ? 'Done' : 'Edit Tags'}
              </button>
            </div>

            {editingTags && (
              <div className="add-tag-section">
                <input
                  type="text"
                  placeholder="Add new tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleAddTag();
                }}>Add</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simulation List Section */}
      <div className="sim-section">
        <h2>Simulation List</h2>
        <p className="section-subtitle">Select a simulation based on your financial priority setting</p>

        <div className="priority-selector">
          <label htmlFor="priority-select">Financial Priority Setting:</label>
          <select
            id="priority-select"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="priority-dropdown"
          >
            {Object.entries(priorities).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="simulations-grid">
          {simulations[selectedPriority]?.map(sim => (
            <div
              key={sim.id}
              className="simulation-card"
              onClick={() => handleSimulationClick(sim.id)}
            >
              <h4>{sim.title}</h4>
              <p className="sim-description">{sim.description}</p>
              <div className="sim-card-footer">
                <span className="sim-type">{getSimulationTypeLabel(sim.type)}</span>
                {sim.miniSimulation && (
                  <span className="sim-mini-badge">Quick Estimate</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulation History Section */}
      <div className="sim-section">
        <h2>Simulation History</h2>
        <p className="section-subtitle">Simulations are saved here once you run them</p>

        <div className="history-filters">
          <div className="filter-group">
            <label htmlFor="history-priority-filter">Priority:</label>
            <select
              id="history-priority-filter"
              value={historyPriorityFilter}
              onChange={(e) => setHistoryPriorityFilter(e.target.value)}
              className="priority-dropdown"
            >
              <option value="all">All Priorities</option>
              {Object.entries(priorities).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="history-type-filter">Type:</label>
            <select
              id="history-type-filter"
              value={historyTypeFilter}
              onChange={(e) => setHistoryTypeFilter(e.target.value)}
              className="priority-dropdown"
            >
              <option value="all">All Types</option>
              <option value="comparison">Comparison</option>
              <option value="calculator">Calculator</option>
            </select>
          </div>
        </div>

        <div className="history-list">
          {filteredHistory.length === 0 ? (
            <div className="history-empty">
              {history.length === 0
                ? 'No simulations run yet. Run a simulation to see your history here.'
                : 'No simulations match the selected filters.'}
            </div>
          ) : (
            filteredHistory.map(entry => (
              <div
                key={entry.historyId}
                className="history-card"
                onClick={() => navigate(`/simulation/${entry.id}`, { state: { historyEntry: entry } })}
              >
                <div className="history-content">
                  <h4>{entry.title}</h4>
                  <p className="history-description">{entry.description}</p>
                </div>
                <div className="history-meta">
                  <span className="history-date">{new Date(entry.date).toLocaleDateString()}</span>
                  <span className="history-type">{getSimulationTypeLabel(entry.type)}</span>
                  <span className="history-priority">{priorities[entry.priority] || entry.priority}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationOverview;
