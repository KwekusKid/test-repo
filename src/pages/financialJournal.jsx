import { useState } from "react"


const FinancialJournal = () => {
    const [entryType, setEntryType] = useState('income');

    const categoryOptions = {
        income: ['Salary', 'Investment', 'Gift'],
        expense: ['Travel', 'Food', 'Entertainment', 'Other']
    };

    return (
        <>
            <div className='page-title'>
                <div className='home'>
                    <h1>Financial Journal</h1>
                </div>
            </div>

            <div className='card-container'>
                <div className='card'>
                    <h4 className='card title'>Income</h4>
                </div>

                <div className='card'>
                    <h4 className='card title'>Expenses</h4>
                </div>

                <div className='card'>
                    <h4 className='card title'>Balance</h4>
                </div>
            </div>

            <div className='newEntry'>
                <h4 className='card title'>New Entry</h4>
                <label>Type of entry:
                    <select
                        className='inputField'
                        value={entryType}
                        onChange={(e) => setEntryType(e.target.value)}
                    > {/* OnChange calls the set function from useState*/}
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </label>
                <label>
                    Category:
                    <select className='inputField' placeholder='Select category'>
                        {categoryOptions[entryType].map((cat) => (
                            <option key={cat} value={cat.toLowerCase()}>{cat}
                            </option>
                        ))}
                    </select> 
                </label>    


                <input type="text" placeholder='Description' className='inputField'/>
                <input type="number" placeholder='Amount' className='inputField' />
                <button className='addButton'>Add</button>
            </div>
        </>
    )
}

export default FinancialJournal