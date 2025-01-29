const API_URL = "http://localhost:3000/api/company/Dropbox"; // Update if backend URL changes
const SOCKET_URL = "http://localhost:3000"; // Update if backend URL changes

let data_points = [] // Use 'let' instead of 'const'
let lastOpen = 0;  // Initialize lastOpen variable

// Initialize
document.addEventListener('DOMContentLoaded', function() {

    const chartProperties = {
        width: 1500,
        height: 600,
        timeScale: {
            timeVisible: true,
            secondsVisible: false,
        }
    };

    function convertToUnixTimestamp(timestamp) {
        const date = new Date(timestamp); // Converts string to Date object
        return Math.floor(date.getTime() / 1000); // Get Unix timestamp in seconds
    }

    const domElement = document.getElementById('tvchart');
    const chart = LightweightCharts.createChart(domElement, chartProperties);
    const candleSeries = chart.addCandlestickSeries();

    // Fetch data from the API
    async function fetchData() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const newData = await response.json();
            console.log(newData[2].timestamp);

            // Ensure data is properly ordered and lastOpen is set to the first price
            lastOpen = newData[0].price;

            data_points = data_points.concat(newData); // Merge the new data with the existing data

            console.log(data_points[0]);

            data_points.forEach((d, index) => {
                const high = Math.max(d.price, lastOpen) + Math.random() * 10; // High is max of open/close + random
                const low = Math.min(d.price, lastOpen) - Math.random() * 10; // Low is min of open/close - random
                // console.log(JSON.parse(d), " ", d);
                candleSeries.update({
                    time: convertToUnixTimestamp(d.timestamp),
                    open: d.price,
                    high: high,
                    low: low,
                    close: lastOpen,
                });

                lastOpen = d.price; // Update lastOpen to current price
            });
        } catch (error) {
            console.error("Error fetching data:", error);

            const dataListElement = document.getElementById('data-list');
            if (dataListElement) {
                dataListElement.innerHTML = `<li>Error: ${error.message}</li>`;
            }
        }
    }

    // Listen to Socket.IO for real-time updates
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
        console.log("Connected to Socket.IO");
        socket.emit("subscribeToCompany", "Dropbox"); // Subscribe to Dropbox channel
    });

    socket.on("newValue", (message) => {
        const parsedMessage = JSON.parse(message);
        console.log("Received real-time update:", parsedMessage.price);
        
        // Convert timestamp of the new message
        const newTimestamp = convertToUnixTimestamp(parsedMessage.timestamp);

        // Ensure the new timestamp is after the last timestamp
        if (data_points.length > 0) {
            const lastDataTimestamp = convertToUnixTimestamp(data_points[data_points.length - 1].timestamp);
            
            // If the new timestamp is earlier than or equal to the last, adjust it
            if (newTimestamp <= lastDataTimestamp) {
                console.warn("Received an update with an older or equal timestamp, adjusting timestamp...");
                parsedMessage.timestamp = new Date(lastDataTimestamp * 1000 + 1000).toISOString(); // Add 1 second
            }
        }

        const high = Math.max(parsedMessage.price, lastOpen) + Math.random() * 10; // High is max of open/close + random
        const low = Math.min(parsedMessage.price, lastOpen) - Math.random() * 10; // Low is min of open/close - random

        const adjustedTimestamp = convertToUnixTimestamp(parsedMessage.timestamp);

        candleSeries.update({
            time: adjustedTimestamp,
            open: parsedMessage.price,
            high: high,
            low: low,
            close: lastOpen,
        });

        lastOpen = parsedMessage.price; // Update lastOpen to current price

        data_points.push(parsedMessage); // Add new data to data_points
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from Socket.IO");
    });

    // Fetch initial data
    fetchData();

      
});