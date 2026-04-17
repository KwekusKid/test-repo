import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
            <div className='page-title'>
                <div className='home'>
                    <h1>Welcome to the Dashboard</h1>
                </div>



                <div className='card-container'>
                        
                        <Link to="/financialJournal">
                            <div className='card'>
                                <h4 className='card title'>Financial Journal</h4>   
                            </div>
                        </Link>
                    



                            <Link to="/strategyOverview">
                                <div className='card'>
                                    <h4>Strategy Overview</h4>
                                </div>
                            </Link>


                            <div className='card'>
                                <h4>Fixed Cost</h4>
                            </div>


                            <div className='card'>
                                <h4>Debt Progression</h4>
                            </div>
                        </div>
                </div>
            </>


            )
}

            export default Home