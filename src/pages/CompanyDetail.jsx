import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import LineChart from "../components/StockChart.jsx";
import { stockService } from '../services/axioapis.js';

const CompanyDetail = ({ companies }) => {
    const { id } = useParams(); // Get the id from the URL
    const company = companies[id]; // Find the company using the id
    
    const [chartData, setChartData] = useState(null);

    // Fetch data from the stockService API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await stockService.getHistoricalData(company.name); // Use company name as identifier
    
                // Prepare the chartData object
                const labels = data.map(item => item.timestamp); // Extract timestamps for labels
                const prices = data.map(item => parseFloat(item.price)); // Parse the price values to numbers
    
                const formattedChartData = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Price',
                            data: prices,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: true,
                            tension: 0.4,
                        },
                    ],
                };
    
                setChartData(formattedChartData); // Update the chart data state
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [company]); // Re-run when the company changes
    
    if (!chartData) {
        return <div>Loading chart data...</div>;
    }

    return (
        <div style={{ padding: '40px 20px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{company.name}</h2>
            <img 
                src={company.imageUrl} 
                alt={`${company.name} logo`} 
                style={{ width: '250px', height: 'auto', marginBottom: '20px' }} 
            />
            <p style={{ fontSize: '1.5rem', marginBottom: '40px' }}>
                {`Stock Value: $${company.stockValue}`}
            </p>
            <div style={{ height: '400px', width: '100%' }}>
                <LineChart chartData={chartData} />
            </div>
        </div>
    );
};

CompanyDetail.propTypes = {
    companies: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            stockValue: PropTypes.string.isRequired,
            imageUrl: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default CompanyDetail;
