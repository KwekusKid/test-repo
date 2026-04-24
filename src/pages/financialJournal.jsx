import { useState, useEffect } from "react"
import '../pagesCss/financialJournal.css'


const FinancialJournal = ({ showNav = false }) => {

    // State for entry type (income or expense)
    const [entryType, setEntryType] = useState('income');
    const [entryAmount, setEntryAmount] = useState('');
    const [entryDescription, setEntryDescription] = useState('');
    const [entryCategory, setEntryCategory] = useState('');
    const [entries, setEntries] = useState(() => {
        try { return JSON.parse(localStorage.getItem('journalEntries') || '[]'); }
        catch { return []; }
    });  // Store all entries (income + expenses)
    const [budget, setBudget] = useState(1000);
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [budgetInput, setBudgetInput] = useState('1000');
    useEffect(() => {
        localStorage.setItem('journalEntries', JSON.stringify(entries));
    }, [entries]);




    // Filter states
    const [filterType, setFilterType] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // Filter entries based on selected filters
    const filteredEntries = entries.filter(entry => {
        const matchesType = filterType === 'all' || entry.type === filterType;
        const matchesCategory = filterCategory === 'all' || entry.category === filterCategory;
        return matchesType && matchesCategory;
    });
    const totalIncome = entries
        .filter(entry => entry.type === 'income')
        .reduce((total, entry) => total + entry.amount, 0);

    // Calculate total expenses from entries
    const totalExpenses = entries
        .filter(entry => entry.type === 'expense')
        .reduce((total, entry) => total + entry.amount, 0);

    // Balance = total income - total expenses
    const balance = totalIncome - totalExpenses;

    // Calculate spent amount from expenses (for budget tracking)
    const spentAmount = totalExpenses;
    const remainingBudget = budget - spentAmount;

    const categoryOptions = {
        income: ['Salary', 'Investment', 'Gift'],
        expense: ['Travel', 'Food', 'Entertainment', 'Other']
    };

    // Reset category when entry type changes
    const handleEntryTypeChange = (e) => {
        setEntryType(e.target.value);
        setEntryCategory('');  // Clear category when switching types
    };

    const handleEditBudget = () => {
        setBudgetInput(budget.toString());
        setIsEditingBudget(true);
    };

    const handleSaveBudget = () => {
        const newBudget = parseFloat(budgetInput);
        if (!isNaN(newBudget) && newBudget >= 0) {
            setBudget(newBudget);
        }
        setIsEditingBudget(false);
    };

    const handleAddEntry = () => {
        // Validate that required fields are filled
        if (!entryCategory || !entryAmount) {
            alert('Please select a category and enter an amount');
            return;
        }

        // Create a new entry object with all the user input data
        const newEntry = {
            type: entryType,  // 'income' or 'expense'
            amount: parseFloat(entryAmount),  // Convert string to number
            description: entryDescription,  // User's description text
            category: entryCategory,  // Selected category
            date: new Date().toLocaleDateString()  // Current date as string
        };

        // Add entry to the entries array (both income and expenses)
        setEntries(prevEntries => [...prevEntries, newEntry]);

        // Reset form fields after adding
        setEntryAmount('');
        setEntryDescription('');
        setEntryCategory('');
    };


    return (
        <div className={`financial-journal-page ${showNav ? 'nav-open' : ''}`}>
            <div className='page-title'>

                <h1>Financial Journal</h1>

            </div>

            <div className='mainCard-container'>
                <div className='mainCard'>
                    <h4 className='mainCard-title'>Income</h4>
                    <p>total income: R{entries
                        .filter(entry => entry.type === 'income')
                        .reduce((total, income) => total + income.amount, 0).toFixed(2)}
                    </p>
                </div>

                <div className='mainCard'>
                    <h4 className='mainCard-title'>Expenses</h4>
                    <p>total expenses: R{entries
                        .filter(entry => entry.type === 'expense')
                        .reduce((total, expense) => total + expense.amount, 0).toFixed(2)}</p>
                </div>

                <div className='mainCard'>
                    <h4 className='mainCard-title'>Balance</h4>
                    <p>R{balance.toFixed(2)}</p>
                </div>
            </div>

            <div className='content-container'>
                <div className='newEntry'>
                    <h3 className='entryCard-title'>New Entry</h3>
                    <label>Type of entry:
                        <select
                            className='inputField'
                            value={entryType}
                            onChange={handleEntryTypeChange}
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </label>
                    <label>
                        Category:
                        <select
                            className='inputField'
                            value={entryCategory}
                            onChange={(e) => setEntryCategory(e.target.value)}
                            placeholder='Select category'
                        >
                            {categoryOptions[entryType].map((cat) => (
                                <option key={cat} value={cat.toLowerCase()}>{cat}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Description (optional):
                        <input
                            type="text"
                            placeholder='Description'
                            className='inputField'
                            value={entryDescription}
                            onChange={(e) => setEntryDescription(e.target.value)}
                        />
                    </label>
                    <label>
                        Amount:
                        <input
                            type="number"
                            placeholder='Amount'
                            className='inputField'
                            value={entryAmount}
                            onChange={(e) => setEntryAmount(e.target.value)}
                        />
                    </label>

                    <button className='addButton'
                        onClick={handleAddEntry}
                    >Add</button>
                </div>

                <div className='right-section'>
                    <div className='Budget'>
                        <div className='budget-header'>
                            <h4 className='budget-title'>Budget</h4>
                            <button
                                className='pen-icon-btn'
                                onClick={handleEditBudget}
                                title="Edit Budget"
                            >
                                ✏️
                            </button>
                        </div>

                        {isEditingBudget ? (
                            <div className='budget-edit'>
                                <input
                                    type='number'
                                    value={budgetInput}
                                    onChange={(e) => setBudgetInput(e.target.value)}
                                    className='inputField'
                                    min="0"
                                />
                                <button className='addButton' onClick={handleSaveBudget}>
                                    Save
                                </button>
                            </div>
                        ) : (
                            <>
                                <p className='budget-detail'>Monthly Budget: R{budget.toFixed(2)}</p>
                                <p className='budget-detail'>Budget spent: R{spentAmount.toFixed(2)}</p>
                                <p className='budget-detail'>Budget remaining: R{remainingBudget.toFixed(2)}</p>
                            </>
                        )}
                    </div>

                    <div className='entryHistory'>
                        <div className='entryHistory-header'>
                            <h4 className='entryHistory-title'>Entries</h4>
                            <button
                                className='filter-btn'
                                onClick={() => setShowFilters(!showFilters)}
                                title="Toggle Filters"
                            >
                                *
                            </button>
                        </div>

                        {/* Filter Controls */}
                        {showFilters && (
                            <div className='entry-filters'>
                                <label>
                                    Filter by Type:
                                    <select
                                        className='inputField'
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                    >
                                        <option value="all">All</option>
                                        <option value="income">Income</option>
                                        <option value="expense">Expense</option>
                                    </select>
                                </label>
                                <label>
                                    Filter by Category:
                                    <select
                                        className='inputField'
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                    >
                                        <option value="all">All Categories</option>
                                        {categoryOptions.income.map(cat => (
                                            <option key={`income-${cat}`} value={cat.toLowerCase()}>{cat}</option>
                                        ))}
                                        {categoryOptions.expense.map(cat => (
                                            <option key={`expense-${cat}`} value={cat.toLowerCase()}>{cat}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        )}

                        {filteredEntries.length === 0 ? (
                            <p>No entries match your filters.</p>
                        ) : (
                            filteredEntries.map((entry, index) => (
                                <div key={index} className='entry-card'>
                                    <p className='entryDetail'><strong>Type:</strong> {entry.type}</p>
                                    <p className='entryDetail'><strong>Category:</strong> {entry.category}</p>
                                    <p className='entryDetail'><strong>Description:</strong> {entry.description || 'N/A'}</p>
                                    <p className='entryDetail'><strong>Amount:</strong> R{entry.amount.toFixed(2)}</p>
                                    <p className='entryDetail'><strong>Date:</strong> {entry.date}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FinancialJournal