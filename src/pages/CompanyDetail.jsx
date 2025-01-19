// src/pages/CompanyDetail.jsx
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import StockChart from '../components/StockChart'; // Import the StockChart component
import { io } from 'socket.io-client'; // Import Socket.IO client

const CompanyDetail = ({ companies }) => {
    const { id } = useParams(); // Get the ID from the URL
    const company = companies[id]; // Get the company details based on ID
    const [chartData, setChartData] = useState([]); // State to hold formatted data

    // Fetch initial data from the API when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/data');
                const data = await response.json();

                // Format the data into the required structure

                setChartData(data); // Update state with formatted data
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this runs once when component mounts

    // Set up Socket.IO connection and listener for new values
    // useEffect(() => {
    //     const socket = io('http://localhost:3500'); // Connect to Socket.IO server

    //     socket.on('newValue', (message) => {
    //         const parsedItem = JSON.parse(message); // Parse incoming JSON string

    //         // Format the new data point
    //         const newDataPoint = {
    //             time: parsedItem.date.split('T')[1], // Extract time part
    //             price: parseFloat(parsedItem.num), // Convert price to float
    //         };

    //         setChartData(prevData => [...prevData, newDataPoint]); // Update chart data with new point
    //     });

    //     return () => {
    //         socket.disconnect(); // Clean up on unmount
    //     };
    // }, []); // Empty dependency array means this runs once when component mounts

    return (
        <div style={{ paddingTop: '80px', textAlign: 'center' }}>
            <h2>{company.name}</h2>
            <img src={company.imageUrl} alt={`${company.name} logo`} style={{ width: '200px', height: 'auto' }} />
            <p>{`Stock Value: $${company.stockValue}`}</p>
            <StockChart data={chartData} /> {/* Render the StockChart component with fetched data */}
        </div>
    );
};

// PropTypes validation
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
