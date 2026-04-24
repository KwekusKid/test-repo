import { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaEdit, FaTrash } from 'react-icons/fa';
import '../pagesCss/debtPage.css';

const DebtPage = ({ showNav = false }) => {
   const [debts, setDebts] = useState(() => {
  try {
    const saved = localStorage.getItem('debts');
    if (saved) return JSON.parse(saved);
  } catch {}
       return[ {
            id: 1,
            name: "Credit Card",
            obligation: 200,
            interestRate: 18.5,
            progress: 50,
            category: "Credit",
            type: "Credit Card",
            priority: "High",
            paymentFrequency: "Monthly",
            totalDebt: 25000,
            balance: 12500,
            totalPaid: 12500
        },
        {
            id: 2,
            name: "Student Loan",
            obligation: 150,
            interestRate: 4.5,
            progress: 25,
            category: "Loan",
            type: "Student Loan",
            priority: "Medium",
            paymentFrequency: "Monthly",
            totalDebt: 20000,
            balance: 15000,
            totalPaid: 5000
        }
    ];
});

    
    const [selectedDebt, setSelectedDebt] = useState(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isNewDebt, setIsNewDebt] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [timePeriod, setTimePeriod] = useState('monthly');

    // Two independent filters
    const [filterType, setFilterType] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');

    const [openDropdown, setOpenDropdown] = useState(null);

    useEffect(() => {
    localStorage.setItem('debts', JSON.stringify(debts));
  }, [debts]);

    const [formData, setFormData] = useState({
        name: '',
        obligation: '',
        interestRate: '',
        priority: 'Medium',
        type: 'Loan',
        paymentFrequency: 'Monthly',
        totalDebt: '',
        balance: '',
        totalPaid: ''
    });

    const openLightbox = (debt = null) => {
        if (debt) {
            setSelectedDebt(debt);
            setIsNewDebt(false);
            setIsEditing(false);
            setFormData({
                name: debt.name,
                obligation: debt.obligation,
                interestRate: debt.interestRate,
                priority: debt.priority,
                type: debt.type,
                paymentFrequency: debt.paymentFrequency,
                totalDebt: debt.totalDebt || '',
                balance: debt.balance || '',
                totalPaid: debt.totalPaid || ''
            });
        } else {
            setSelectedDebt(null);
            setIsNewDebt(true);
            setIsEditing(true);
            setFormData({
                name: '',
                obligation: '',
                interestRate: '',
                priority: 'Medium',
                type: 'Loan',
                paymentFrequency: 'Monthly',
                totalDebt: '',
                balance: '',
                totalPaid: ''
            });
        }
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        setSelectedDebt(null);
        setIsNewDebt(false);
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const saveDebt = () => {
        const obligation = parseFloat(formData.obligation) || 0;
        const totalDebt = parseFloat(formData.totalDebt) || 0;
        const balance = parseFloat(formData.balance) || 0;
        const totalPaid = parseFloat(formData.totalPaid) || 0;
        const progress = totalDebt > 0 ? ((totalDebt - balance) / totalDebt) * 100 : 0;

        const categoryMap = {
            'Credit Card': 'Credit',
            'Loan': 'Loan',
            'Other': 'Other'
        };

        const newDebt = {
            id: isNewDebt ? Date.now() : selectedDebt.id,
            name: formData.name || 'Unnamed Debt',
            obligation,
            interestRate: parseFloat(formData.interestRate) || 0,
            progress,
            category: categoryMap[formData.type] || 'Other',
            type: formData.type,
            priority: formData.priority,
            paymentFrequency: formData.paymentFrequency,
            totalDebt,
            balance,
            totalPaid
        };

        if (isNewDebt) {
            setDebts(prev => [...prev, newDebt]);
        } else {
            setDebts(prev => prev.map(d => d.id === selectedDebt.id ? newDebt : d));
        }
        closeLightbox();
    };

    const deleteDebt = () => {
        if (!selectedDebt) return;
        setDebts(prev => prev.filter(d => d.id !== selectedDebt.id));
        closeLightbox();
    };

    const toggleTimePeriod = () => {
        setTimePeriod(prev => prev === 'monthly' ? 'annual' : 'monthly');
    };

    // Apply both filters together
    const filteredDebts = debts
        .filter(d => filterType === 'all' || d.type === filterType)
        .filter(d => filterPriority === 'all' || d.priority === filterPriority);

    const totalAmount = filteredDebts.reduce((sum, debt) => {
        return sum + (timePeriod === 'annual' ? debt.obligation * 12 : debt.obligation);
    }, 0);

    const getDebtDistribution = () => {
        const total = filteredDebts.reduce((sum, debt) => {
            return sum + (timePeriod === 'annual' ? debt.obligation * 12 : debt.obligation);
        }, 0);
        let currentAngle = 0;
        return filteredDebts.map(debt => {
            const amount = timePeriod === 'annual' ? debt.obligation * 12 : debt.obligation;
            const percentage = total > 0 ? (amount / total) * 100 : 0;
            const angle = (percentage / 100) * 360;
            const color = getColorForDebt(debt.type);
            const segment = { type: debt.type, amount, percentage, color, startAngle: currentAngle, endAngle: currentAngle + angle };
            currentAngle += angle;
            return segment;
        });
    };

    const getColorForDebt = (type) => {
        const colors = {
            'Credit Card': '#e74c3c', 'Student Loan': '#3498db', 'Car Loan': '#2ecc71',
            'Mortgage': '#9b59b6', 'Personal Loan': '#f39c12', 'Medical Debt': '#1abc9c',
            'Loan': '#3498db', 'Other': '#95a5a6'
        };
        return colors[type] || '#95a5a6';
    };

    const uniqueDebtTypes = [...new Set(debts.map(d => d.type))];
    const priorityOptions = ['High', 'Medium', 'Low'];

    const infoCenterItems = [
        { title: "Credit Card", content: "A 20% credit card interest rate can double your debt if unpaid over time." },
        { title: "Student Loans", content: "Student loans typically have lower interest rates but can accumulate significantly over 10+ years." },
        { title: "Car Loans", content: "Car loans usually range from 4-8% interest. Depreciation means you may owe more than the car is worth." }
    ];

    const toggleDropdown = (index) => setOpenDropdown(openDropdown === index ? null : index);

    const progressPercent = formData.totalDebt && formData.balance
        ? (((parseFloat(formData.totalDebt) - parseFloat(formData.balance)) / parseFloat(formData.totalDebt)) * 100).toFixed(1)
        : 0;

    const filtersActive = filterType !== 'all' || filterPriority !== 'all';

    return (
        <div className="debt-page">

            {/* ── Page Title ── */}
            <div className="debt-page-title">
                <h1>Debt Breakdown</h1>
                <p>Detailed breakdown of your debts</p>
            </div>

            {/* ── Filter Bar ── */}
            <div className="debt-filter-bar">
                <div className="filter-group">
                    <span className="filter-group-label">Type</span>
                    <div className="pill-group">
                        <button
                            className={`pill R{filterType === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterType('all')}
                        >
                            All
                        </button>
                        {uniqueDebtTypes.map(type => (
                            <button
                                key={type}
                                className={`pill R{filterType === type ? 'active' : ''}`}
                                onClick={() => setFilterType(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <span className="filter-group-label">Priority</span>
                    <div className="pill-group">
                        <button
                            className={`pill R{filterPriority === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterPriority('all')}
                        >
                            All
                        </button>
                        {priorityOptions.map(p => (
                            <button
                                key={p}
                                className={`pill priority-pill R{p.toLowerCase()} R{filterPriority === p ? 'active' : ''}`}
                                onClick={() => setFilterPriority(p)}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {filtersActive && (
                    <button
                        className="clear-filters"
                        onClick={() => { setFilterType('all'); setFilterPriority('all'); }}
                    >
                        Clear filters ×
                    </button>
                )}
            </div>

            <div className="debt-main-content">
                <div className="debt-gallery">
                    {filteredDebts.length === 0 && (
                        <div className="no-results">
                            <p>No debts match the selected filters.</p>
                        </div>
                    )}

                    {filteredDebts.map((debt) => (
                        <div key={debt.id} className="debt-card" onClick={() => openLightbox(debt)}>
                            <div className="debt-card-header">
                                <h4 className="debt-name">{debt.name}</h4>
                                <span className={`priority-tag R{debt.priority.toLowerCase()}`}>{debt.priority}</span>
                            </div>
                            <div className="debt-obligation">
                                <span className="obligation-label">Monthly Payment</span>
                                <span className="obligation-amount">R{debt.obligation}</span>
                            </div>
                            <div className="debt-interest">
                                <span>Interest Rate: {debt.interestRate}%</span>
                            </div>
                            <div className="debt-tags">
                                <span className="tag category-tag">{debt.category}</span>
                                <span className="tag type-tag">{debt.type}</span>
                            </div>
                        </div>
                    ))}

                    <div className="add-debt-card" onClick={() => openLightbox(null)}>
                        <span>+ Add New Debt</span>
                    </div>
                </div>

                <div className="debt-sidebar">
                    <div className="total-card" onClick={toggleTimePeriod}>
                        <h4>Total {timePeriod === 'monthly' ? 'Monthly' : 'Annual'} Debt Payment</h4>
                        <div className="total-amount">R{totalAmount.toLocaleString()}</div>
                        <span className="toggle-hint">Click to switch to {timePeriod === 'monthly' ? 'annual' : 'monthly'}</span>
                    </div>

                    <div className="pie-chart-container">
                        <h4>Debt Distribution</h4>
                        <div className="pie-chart">
                            {getDebtDistribution().map((segment, index) => (
                                <div
                                    key={index}
                                    className="pie-segment"
                                    style={{ '--start': segment.startAngle, '--end': segment.endAngle, '--color': segment.color }}
                                    title={`R{segment.type}: R${segment.amount.toLocaleString()} (${segment.percentage.toFixed(1)}%)`}
                                />
                            ))}
                        </div>
                        <div className="pie-legend">
                            {getDebtDistribution().map((segment, index) => (
                                <div key={index} className="legend-item">
                                    <span className="legend-color" style={{ background: segment.color }} />
                                    <span className="legend-label">{segment.type}</span>
                                    <span className="legend-value">R{segment.amount.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="info-center">
                <h3>Information Center</h3>
                {infoCenterItems.map((item, index) => (
                    <div key={index} className="dropdown-item">
                        <button className="dropdown-header" onClick={() => toggleDropdown(index)}>
                            <span>{item.title}</span>
                            {openDropdown === index ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        {openDropdown === index && (
                            <div className="dropdown-content"><p>{item.content}</p></div>
                        )}
                    </div>
                ))}
            </div>

            {/* ── Lightbox ── */}
            {isLightboxOpen && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <div className="lightbox-header">
                            <h2>{isNewDebt ? 'Add New Debt' : selectedDebt?.name}</h2>
                            <button className="close-btn" onClick={closeLightbox}>×</button>
                        </div>

                        <div className="lightbox-body">
                            <div className="lightbox-left">

                                {/* VIEW MODE */}
                                {!isEditing && selectedDebt && (
                                    <>
                                        <div className="view-row">
                                            <span className="view-label">Monthly Payment</span>
                                            <span className="view-value">R{selectedDebt.obligation}</span>
                                        </div>
                                        <div className="view-row">
                                            <span className="view-label">Interest Rate</span>
                                            <span className="view-value">{selectedDebt.interestRate}%</span>
                                        </div>
                                        <div className="view-row">
                                            <span className="view-label">Priority</span>
                                            <span className={`priority-tag ${selectedDebt.priority.toLowerCase()}`}>{selectedDebt.priority}</span>
                                        </div>
                                        <div className="view-row">
                                            <span className="view-label">Type</span>
                                            <span className="view-value">{selectedDebt.type}</span>
                                        </div>
                                        <div className="view-row">
                                            <span className="view-label">Payment Frequency</span>
                                            <span className="view-value">{selectedDebt.paymentFrequency}</span>
                                        </div>
                                        <div className="lightbox-progress">
                                            <span className="label">Progress</span>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${selectedDebt.progress}%` }} />
                                            </div>
                                            <span className="progress-text">{selectedDebt.progress.toFixed(1)}% Paid</span>
                                        </div>
                                        <div className="lightbox-stats">
                                            <div className="stat-card">
                                                <span className="stat-label">Total Debt</span>
                                                <span className="stat-value">R{selectedDebt.totalDebt?.toLocaleString()}</span>
                                            </div>
                                            <div className="stat-card">
                                                <span className="stat-label">Balance</span>
                                                <span className="stat-value">R{selectedDebt.balance?.toLocaleString()}</span>
                                            </div>
                                            <div className="stat-card">
                                                <span className="stat-label">Total Paid</span>
                                                <span className="stat-value">R{selectedDebt.totalPaid?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* EDIT MODE */}
                                {isEditing && (
                                    <>
                                        <div className="form-group">
                                            <label className="label">Title</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" placeholder="Enter debt name" />
                                        </div>
                                        <div className="form-group">
                                            <label className="label">Interest Rate (%)</label>
                                            <input type="number" name="interestRate" value={formData.interestRate} onChange={handleInputChange} className="form-input" placeholder="Enter interest rate" step="0.1" />
                                        </div>
                                        <div className="form-group">
                                            <label className="label">Monthly Payment (R)</label>
                                            <input type="number" name="obligation" value={formData.obligation} onChange={handleInputChange} className="form-input" placeholder="Enter monthly payment" />
                                        </div>
                                        <div className="form-group">
                                            <label className="label">Priority</label>
                                            <select name="priority" value={formData.priority} onChange={handleInputChange} className="form-select">
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="label">Type</label>
                                                <select name="type" value={formData.type} onChange={handleInputChange} className="form-select">
                                                    <option value="Loan">Loan</option>
                                                    <option value="Credit Card">Credit Card</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="label">Payment Frequency</label>
                                                <select name="paymentFrequency" value={formData.paymentFrequency} onChange={handleInputChange} className="form-select">
                                                    <option value="Once off">Once off</option>
                                                    <option value="Weekly">Weekly</option>
                                                    <option value="Monthly">Monthly</option>
                                                    <option value="Annual">Annual</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="lightbox-progress">
                                            <span className="label">Progress</span>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                                            </div>
                                            <span className="progress-text">{progressPercent}% Paid</span>
                                        </div>
                                        <div className="lightbox-stats">
                                            <div className="stat-card">
                                                <span className="stat-label">Total Debt</span>
                                                <input type="number" name="totalDebt" value={formData.totalDebt} onChange={handleInputChange} className="stat-input" placeholder="R0" />
                                            </div>
                                            <div className="stat-card">
                                                <span className="stat-label">Balance</span>
                                                <input type="number" name="balance" value={formData.balance} onChange={handleInputChange} className="stat-input" placeholder="R0" />
                                            </div>
                                            <div className="stat-card">
                                                <span className="stat-label">Total Paid</span>
                                                <input type="number" name="totalPaid" value={formData.totalPaid} onChange={handleInputChange} className="stat-input" placeholder="R0" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="lightbox-right">
                                <div className="lightbox-tags">
                                    <span className={`priority-tag R{(isEditing ? formData.priority : selectedDebt?.priority || '').toLowerCase()}`}>
                                        {isEditing ? formData.priority : selectedDebt?.priority} Priority
                                    </span>
                                    <span className="tag type-tag">
                                        {isEditing ? formData.type : selectedDebt?.type}
                                    </span>
                                    <span className="tag">
                                        {isEditing ? formData.paymentFrequency : selectedDebt?.paymentFrequency}
                                    </span>
                                </div>
                                <div className="lightbox-chart" />
                            </div>
                        </div>

                        {/* ── Footer ── */}
                        <div className="lightbox-footer">
                            {/* VIEW MODE — Edit button only */}
                            {!isNewDebt && !isEditing && (
                                <button className="edit-lightbox-btn" onClick={() => setIsEditing(true)}>
                                    <FaEdit /> Edit Debt
                                </button>
                            )}

                            {/* EDIT MODE — Delete on left, Cancel + Save on right */}
                            {isEditing && (
                                <>
                                    {!isNewDebt && (
                                        <button className="delete-btn" onClick={deleteDebt}>
                                            <FaTrash /> Delete Debt
                                        </button>
                                    )}
                                    <div className="footer-right">
                                        {!isNewDebt && (
                                            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                                                Cancel
                                            </button>
                                        )}
                                        <button className="save-btn" onClick={saveDebt}>
                                            {isNewDebt ? 'Add Debt' : 'Save Changes'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DebtPage;
