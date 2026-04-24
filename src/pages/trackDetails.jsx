import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { tracks } from "../components/tracks";
import { FaArrowLeft, FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../pagesCss/trackDetails.css";

const YEAR_KEYS = ["year1", "year2", "year3", "year4"];

// ── Inline SVG Timeline ──
const TrackTimeline = ({ track, selectedYear, onSelectYear, completedYears }) => {
    const [hoveredYear, setHoveredYear] = useState(null);

    const svgWidth  = 460;
    const svgHeight = 130;
    const lineY     = 82;
    const dotR      = 10;
    const padding   = 40;
    const step      = (svgWidth - padding * 2) / (YEAR_KEYS.length - 1);

    const dotX = (i) => padding + i * step;

    return (
        <div className="timeline-card">
            <div className="timeline-card-header">
                <h2 className="timeline-title">Track Timeline</h2>
                <p className="timeline-subtitle">See your progress</p>
            </div>

            <svg
                width={svgWidth}
                height={svgHeight}
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="timeline-svg"
                aria-label="Track timeline"
            >
                {/* Background line */}
                <line
                    x1={padding}
                    y1={lineY}
                    x2={svgWidth - padding}
                    y2={lineY}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                    strokeLinecap="round"
                />

                {/* Progress line — solid up to last completed year */}
                {(() => {
                    const lastCompletedIdx = YEAR_KEYS.reduce((acc, key, i) => completedYears[key] ? i : acc, -1);
                    if (lastCompletedIdx < 0) return null;
                    return (
                        <line
                            x1={padding}
                            y1={lineY}
                            x2={dotX(lastCompletedIdx)}
                            y2={lineY}
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    );
                })()}

                {YEAR_KEYS.map((key, i) => {
                    const x          = dotX(i);
                    const isSelected  = key === selectedYear;
                    const isHovered   = key === hoveredYear;
                    const isCompleted = completedYears[key];
                    const yearData    = track.years[key];

                    return (
                        <g key={key}>
                            {(isHovered || isSelected) && (
                                <circle
                                    cx={x}
                                    cy={lineY}
                                    r={dotR + 8}
                                    fill={isCompleted ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)"}
                                    stroke={isCompleted ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)"}
                                    strokeWidth={isSelected ? 2 : 1.5}
                                />
                            )}

                            <circle
                                cx={x}
                                cy={lineY}
                                r={dotR}
                                fill={isCompleted ? "white" : isSelected ? "rgba(255,255,255,0.15)" : "transparent"}
                                stroke={isCompleted ? "white" : isSelected ? "white" : "rgba(255,255,255,0.3)"}
                                strokeWidth={isSelected || isCompleted ? 2.5 : 1.5}
                                style={{ cursor: "pointer", transition: "all 0.25s" }}
                                onMouseEnter={() => setHoveredYear(key)}
                                onMouseLeave={() => setHoveredYear(null)}
                                onClick={() => onSelectYear(key)}
                            />

                            {/* Checkmark inside dot if completed */}
                            {isCompleted && (
                                <text
                                    x={x}
                                    y={lineY + 4}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight="700"
                                    fill="black"
                                    style={{ pointerEvents: "none" }}
                                >
                                    ✓
                                </text>
                            )}

                            <text
                                x={x}
                                y={lineY + dotR + 18}
                                textAnchor="middle"
                                fontSize="12"
                                fontWeight={isSelected ? "700" : "500"}
                                fill={isCompleted ? "white" : isSelected ? "white" : "rgba(255,255,255,0.35)"}
                            >
                                {yearData.label}
                            </text>

                            {isHovered && (
                                <foreignObject
                                    x={x - 80}
                                    y={lineY - dotR - 72}
                                    width="160"
                                    height="60"
                                    style={{ overflow: "visible" }}
                                >
                                    <div
                                        xmlns="http://www.w3.org/1999/xhtml"
                                        className="timeline-tooltip"
                                    >
                                        <span className="tooltip-year">{yearData.label}</span>
                                        <span className="tooltip-summary">{yearData.summary}</span>
                                    </div>
                                </foreignObject>
                            )}
                        </g>
                    );
                })}
            </svg>

            <div className="timeline-selected-summary">
                <span className="summary-year-label">
                    {track.years[selectedYear].label}
                </span>
                <p className="summary-text">
                    {track.years[selectedYear].summary}
                </p>
            </div>
        </div>
    );
};

// ── Main Page ──
const TrackDetails = ({ showNav = false }) => {
    const { trackId } = useParams();
    const track = tracks[trackId];
    const [selectedYear, setSelectedYear] = useState("year1");
    const [expandedMilestones, setExpandedMilestones] = useState({});

    // checkedTasks: { "year1-milestoneId-taskIndex": true }
    const [checkedTasks, setCheckedTasks] = useState({});
    // completedYears: { "year1": true, ... }
    const [completedYears, setCompletedYears] = useState({});

    if (!track) {
        return (
            <div className={`track-details ${showNav ? "nav-open" : ""}`}>
                <h2>Track not found</h2>
                <Link to="/strategyOverview" className="back-link">
                    <FaArrowLeft /> Back to Strategy Overview
                </Link>
            </div>
        );
    }

    const currentYear = track.years[selectedYear];

    const handleYearSelect = (key) => {
        setSelectedYear(key);
        setExpandedMilestones({});
    };

    const toggleMilestone = (milestoneId) => {
        setExpandedMilestones(prev => ({
            ...prev,
            [milestoneId]: !prev[milestoneId]
        }));
    };

    const getTaskKey = (yearKey, milestoneId, taskIndex) =>
        `${yearKey}-${milestoneId}-${taskIndex}`;

    const handleTaskCheck = (yearKey, milestoneId, taskIndex, totalTasksInYear) => {
        const key = getTaskKey(yearKey, milestoneId, taskIndex);
        const newChecked = { ...checkedTasks, [key]: !checkedTasks[key] };
        setCheckedTasks(newChecked);

        // Count total tasks across all milestones for this year
        const yearMilestones = track.years[yearKey].milestones;
        const allTaskKeys = yearMilestones.flatMap(m =>
            m.tasks.map((_, tIdx) => getTaskKey(yearKey, m.id, tIdx))
        );
        const allDone = allTaskKeys.every(k => (k === key ? !checkedTasks[key] : newChecked[k]));

        if (allDone) {
            const newCompleted = { ...completedYears, [yearKey]: true };
            setCompletedYears(newCompleted);

            // Advance to next year if available
            const currentIdx = YEAR_KEYS.indexOf(yearKey);
            const nextKey = YEAR_KEYS[currentIdx + 1];
            if (nextKey) {
                setTimeout(() => {
                    setSelectedYear(nextKey);
                    setExpandedMilestones({});
                }, 600);
            }
        } else {
            // Un-complete the year if a task gets unchecked
            if (completedYears[yearKey]) {
                setCompletedYears(prev => ({ ...prev, [yearKey]: false }));
            }
        }
    };

    const getYearProgress = (yearKey) => {
        const yearMilestones = track.years[yearKey].milestones;
        const allTaskKeys = yearMilestones.flatMap(m =>
            m.tasks.map((_, tIdx) => getTaskKey(yearKey, m.id, tIdx))
        );
        const done = allTaskKeys.filter(k => checkedTasks[k]).length;
        return { done, total: allTaskKeys.length };
    };

    const { done, total } = getYearProgress(selectedYear);

    const renderTask = (task, taskIndex, milestone) => {
        const key = getTaskKey(selectedYear, milestone.id, taskIndex);
        const isChecked = !!checkedTasks[key];
        const taskText = typeof task === "object" ? task.text : task;
        const hasLink = typeof task === "object" && task.link;

        return (
            <li key={taskIndex} className={`task-item ${isChecked ? "task-checked" : ""}`}>
                <button
                    className={`task-checkbox ${isChecked ? "checked" : ""}`}
                    onClick={() => handleTaskCheck(selectedYear, milestone.id, taskIndex)}
                    aria-label={isChecked ? "Mark incomplete" : "Mark complete"}
                >
                    {isChecked && <span className="checkbox-tick">✓</span>}
                </button>
                <span className="task-text">
                    {taskText}
                    {hasLink && (
                        <>
                            {" "}
                            <Link to={task.link} className="task-link">
                                {task.linkText}
                            </Link>
                        </>
                    )}
                </span>
            </li>
        );
    };

    return (
        <div className={`track-details ${showNav ? "nav-open" : ""}`}>
            <Link to="/strategyOverview" className="back-link">
                <FaArrowLeft /> Back to Strategy Overview
            </Link>

            <div className="track-header">
                <h1>{track.name}</h1>
                <p className="track-description">{track.description}</p>
            </div>

            <div className="timeline-goals-row">
                <div className="timeline-section">
                    <TrackTimeline
                        track={track}
                        selectedYear={selectedYear}
                        onSelectYear={handleYearSelect}
                        completedYears={completedYears}
                    />
                </div>
                <div className="goals-section">
                    <div className="track-goals">
                        <h2>Track Goals</h2>
                        <ul className="goals-list">
                            {track.goals.map((goal, index) => (
                                <li key={index}>{goal}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="milestones-section">
                <div className="milestones-header">
                    <div className="milestones-header-top">
                        <div>
                            <h2>Milestones</h2>
                            <p className="milestones-subtitle">Check off tasks to track your progress</p>
                        </div>
                        <div className="year-progress">
                            <span className="year-progress-count">{done}/{total}</span>
                            <span className="year-progress-label">tasks complete</span>
                        </div>
                    </div>
                    <div className="year-progress-bar-wrap">
                        <div
                            className="year-progress-bar-fill"
                            style={{ width: total > 0 ? `${(done / total) * 100}%` : "0%" }}
                        />
                    </div>
                </div>

                <div className="year-selector">
                    <select
                        value={selectedYear}
                        onChange={(e) => handleYearSelect(e.target.value)}
                        className="year-dropdown"
                    >
                        {YEAR_KEYS.map((key) => {
                            const { done: yd, total: yt } = getYearProgress(key);
                            return (
                                <option key={key} value={key}>
                                    {track.years[key].label}{completedYears[key] ? " ✓" : ` (${yd}/${yt})`}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="milestones-list">
                    {currentYear.milestones.map((milestone) => {
                        const milestoneTasks = milestone.tasks.length;
                        const milestoneDone = milestone.tasks.filter((_, tIdx) =>
                            checkedTasks[getTaskKey(selectedYear, milestone.id, tIdx)]
                        ).length;
                        const milestoneComplete = milestoneDone === milestoneTasks;

                        return (
                            <div
                                key={milestone.id}
                                className={`milestone-item ${milestoneComplete ? "milestone-complete" : ""}`}
                            >
                                <button
                                    className="milestone-toggle"
                                    onClick={() => toggleMilestone(milestone.id)}
                                >
                                    <div className="milestone-info">
                                        <span className={`milestone-number ${milestoneComplete ? "milestone-number-done" : ""}`}>
                                            {milestoneComplete ? "✓" : milestone.id}
                                        </span>
                                        <div className="milestone-title-wrap">
                                            <span className="milestone-title">{milestone.title}</span>
                                            <span className="milestone-task-count">{milestoneDone}/{milestoneTasks} tasks</span>
                                        </div>
                                    </div>
                                    {expandedMilestones[milestone.id] ? (
                                        <FaChevronUp className="milestone-arrow" />
                                    ) : (
                                        <FaChevronDown className="milestone-arrow" />
                                    )}
                                </button>

                                {expandedMilestones[milestone.id] && (
                                    <div className="milestone-content">
                                        <ul className="task-list">
                                            {milestone.tasks.map((task, index) =>
                                                renderTask(task, index, milestone)
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {completedYears[selectedYear] && (
                    <div className="year-complete-banner">
                        ✓ Year complete
                        {YEAR_KEYS.indexOf(selectedYear) < YEAR_KEYS.length - 1 && (
                            <span className="year-complete-next"> — advancing to next year</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackDetails;
