import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const StockChart = ({ data }) => {
    const [chartData, setChartData] = useState([]);

    // Format initial data when component mounts
    useEffect(() => {
        const formattedData = data.map(item => {
            const parsedItem = JSON.parse(item); // Parse JSON string
            return {
                time: new Date(parsedItem.date).getTime(), // Convert date to timestamp
                price: parseFloat(parsedItem.num), // Convert price to float
            };
        });

        setChartData(formattedData); // Set formatted data to state
    }, [data]); // Run when data prop changes

    // Set up Socket.IO connection and listener for new values
    useEffect(() => {
        const socket = io('http://localhost:3500'); // Connect to Socket.IO server

        socket.on('newValue', (message) => {
            const parsedItem = typeof message === 'string' ? JSON.parse(message) : message;

            // Format the new data point
            const newDataPoint = {
                time: new Date(parsedItem.date).getTime(), // Convert date to timestamp
                price: parseFloat(parsedItem.num), // Convert price to float
            };

            setChartData(prevData => [...prevData, newDataPoint]); // Update chart data with new point
        });

        return () => {
            socket.disconnect(); // Clean up on unmount
        };
    }, []); // Empty dependency array means this runs once when component mounts

    // Calculate max and min prices dynamically based on chartData
    const prices = chartData.map(item => item.price);
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

    const pad = Math.max((maxPrice - minPrice) / 4, 10);
    const yAxisUpperBound = maxPrice + pad;
    const yAxisLowerBound = minPrice - pad;

    // Define custom X-axis ticks based on your requirement (0 to 7 hours)
    const xAxisTicks = chartData.map(item => ({
        time: item.time,
        displayTime: new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    return (
        <LineChart width={800} height={400} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
                dataKey="time" 
                domain={[Math.min(...chartData.map(d => d.time)), Math.max(...chartData.map(d => d.time))]} 
                ticks={xAxisTicks.map(tick => tick.time)} 
                tickFormatter={(time) => {
                    const date = new Date(time);
                    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }}
            /> {/* Custom X-axis */}
            <YAxis domain={[yAxisLowerBound, yAxisUpperBound]} /> {/* Set dynamic Y-axis bounds */}
            <Tooltip 
                formatter={(value, name, props) => {
                    if (props && props.payload && props.payload.time) {
                        const fullDateTime = new Date(props.payload.time).toLocaleString();
                        return [`Price: $${value}`, `Time: ${fullDateTime}`]; // Show price and time in tooltip
                    }
                    return [`Price: $${value}`, 'Time: N/A']; // Fallback if time is not available
                }} 
            />
            <Legend />
            <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                dot={false} // Do not show individual points
            />
        </LineChart>
    );
};

StockChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.string).isRequired, // Expecting an array of strings
};

export default StockChart;
