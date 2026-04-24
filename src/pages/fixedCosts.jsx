import { useState, useEffect } from "react"
import '../pagesCss/fixedCosts.css'


const FixedCosts = ({ showNav = false }) => {
    // State for fixed costs entries
    const [fixedCosts, setFixedCosts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fixedCosts') || '[]'); }
    catch {
      return [
        { id: 1, name: 'Electric Bill', amount: 120, dueDate: '2026-04-25', status: 'unpaid', category: 'utility' },
        { id: 2, name: 'Car Insurance', amount: 150, dueDate: '2026-04-30', status: 'paid', category: 'insurance' }
      ];
    }
  });

    // State for new entry form
    const [newCost, setNewCost] = useState({
        name: '',
        amount: '',
        dueDate: '',
        status: 'unpaid',
        category: 'utility'
    });

    // Filter state
    const [filterCategory, setFilterCategory] = useState('all');

    // Calculate total
    const totalAmount = fixedCosts.reduce((sum, cost) => sum + cost.amount, 0);

     useEffect(() => {
    localStorage.setItem('fixedCosts', JSON.stringify(fixedCosts));
  }, [fixedCosts]);
    // Filter fixed costs
    const filteredCosts = filterCategory === 'all' 
        ? fixedCosts 
        : fixedCosts.filter(cost => cost.category === filterCategory);

    // Handle adding new fixed cost
    const handleAddCost = () => {
        if (!newCost.name || !newCost.amount || !newCost.dueDate) {
            alert('Please fill in all required fields');
            return;
        }
        
        const cost = {
            id: Date.now(),
            name: newCost.name,
            amount: parseFloat(newCost.amount),
            dueDate: newCost.dueDate,
            status: newCost.status,
            category: newCost.category
        };
        
        setFixedCosts([...fixedCosts, cost]);
        setNewCost({ name: '', amount: '', dueDate: '', status: 'unpaid', category: 'utility' });
    };

    // Toggle status between paid/unpaid
    const toggleStatus = (id) => {
        setFixedCosts(fixedCosts.map(cost => 
            cost.id === id ? { ...cost, status: cost.status === 'paid' ? 'unpaid' : 'paid' } : cost
        ));
    };

    const categoryOptions = [
        { value: 'utility', label: 'Utility' },
        { value: 'carFinance', label: 'Car Finance' },
        { value: 'insurance', label: 'Insurance' }
    ];

    return(
        <div className={`fixedCosts-page ${showNav ? 'nav-open' : ''}`}>
            <div className='page-title'>
                <div className='home'>
                    <h1>Fixed Costs BreakDown</h1>
                </div>
            </div>

            <div className="fixedCosts-content">
                {/* Fixed Costs Table Card */}
                <div className="fixedCosts-table-card">
                    <h3 className="card-title">Fixed Costs</h3>
                    
                    <div className="table-container">
                        <table className="fixedCosts-table">
                            <thead>
                                <tr>
                                    <th>Fixed Cost</th>
                                    <th>Amount</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                    <th>Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCosts.map(cost => (
                                    <tr key={cost.id}>
                                        <td>{cost.name}</td>
                                        <td>R{cost.amount.toFixed(2)}</td>
                                        <td>{cost.dueDate}</td>
                                        <td>
                                            <button 
                                                className={`status-btn ${cost.status}`}
                                                onClick={() => toggleStatus(cost.id)}
                                            >
                                                {cost.status === 'paid' ? 'Paid' : 'Unpaid'}
                                            </button>
                                        </td>
                                        <td>{cost.category}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Add New Fixed Cost Form */}
                    <div className="add-cost-form">
                        <h4>Add New Fixed Cost</h4>
                        <div className="form-row">
                            <input 
                                type="text" 
                                placeholder="Name" 
                                className="inputField"
                                value={newCost.name}
                                onChange={(e) => setNewCost({...newCost, name: e.target.value})}
                            />
                            <input 
                                type="number" 
                                placeholder="Amount" 
                                className="inputField"
                                value={newCost.amount}
                                onChange={(e) => setNewCost({...newCost, amount: e.target.value})}
                            />
                            <input 
                                type="date" 
                                className="inputField"
                                value={newCost.dueDate}
                                onChange={(e) => setNewCost({...newCost, dueDate: e.target.value})}
                            />
                            <select 
                                className="inputField"
                                value={newCost.category}
                                onChange={(e) => setNewCost({...newCost, category: e.target.value})}
                            >
                                {categoryOptions.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                            <button className="addButton" onClick={handleAddCost}>Add</button>
                        </div>
                    </div>
                </div>

                {/* Total Card */}
                <div className="total-card">
                    <div className="total-header">
                        <h3 className="total-title">Total Fixed Costs</h3>
                        <span className="total-amount">R{totalAmount.toFixed(2)}</span>
                    </div>

                    {/* Mini Filter */}
                    <div className="total-filter">
                        <label>Filter by:</label>
                        <select 
                            className="inputField"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="all">All</option>
                            {categoryOptions.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Cost Breakdown with Progress Bars */}
                    <div className="cost-breakdown">
                        {filteredCosts.map(cost => {
                            const percentage = totalAmount > 0 ? (cost.amount / totalAmount) * 100 : 0;
                            return (
                                <div key={cost.id} className="cost-item">
                                    <div className="cost-item-header">
                                        <span className="cost-name">{cost.name}</span>
                                        <span className="cost-amount">R{cost.amount.toFixed(2)}</span>
                                    </div>
                                    <div className="progress-bar-container">
                                        <div 
                                            className="progress-bar" 
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="percentage-label">{percentage.toFixed(1)}% of total fixed costs</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FixedCosts