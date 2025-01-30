import { useEffect, useState } from "react";
import socketService from "../services/sockets.js"; // Assuming this is your WebSocket service
import PropTypes from "prop-types";


const MarketInfoCard = ({ company }) => {
    const [marketPrice, setMarketPrice] = useState(null);
    const [buyVolume, setBuyVolume] = useState(null);
    const [sellVolume, setSellVolume] = useState(null);
    const [buyLiquid, setBuyLiquid] = useState(null);
    const [sellLiquid, setSellLiquid] = useState(null);

    useEffect(() => {
        if (!company) return;

        const companyName = company; // Store the company name for consistency

        // Connect and subscribe
        socketService.connect();
        socketService.subscribeToCompany(companyName);

        // Listen for updates and update state
        socketService.onMarketUpdate((data) => {
            try {
                const parsedData = typeof data === "string" ? JSON.parse(data) : data;
                console.log("Parsed Data:", parsedData); // Verify the parsed data structure
                setMarketPrice(parsedData.price); // Extract the price
            } catch (error) {
                console.error("Error parsing data:", error);
            }
        });

        socketService.onBuyVolumeUpdate((data) => {
            // console.log(`Buy Volume update for ${companyName}:`, data);
            setBuyVolume(data);
        });

        socketService.onSellVolumeUpdate((data) => {
            // console.log(`Sell Volume update for ${companyName}:`, data);
            setSellVolume(data);
        });

        socketService.onBuyLiquidUpdate((data) => {
            // console.log(`Buy Liquid update for ${companyName}:`, data);
            setBuyLiquid(data);
        });

        socketService.onSellLiquidUpdate((data) => {
            // console.log(`Sell Liquid update for ${companyName}:`, data);
            setSellLiquid(data);
        });

        // Cleanup on unmount
        return () => {
            socketService.removeListeners();
            socketService.disconnect();
        };
    }, [company]);

    return (
        <div style={{
            position: "fixed", // Ensure it stays fixed
            top: "80px", // Adjust this value to move it below the navbar
            left: "20px",
            padding: "20px",
            backgroundColor: "#333", // Dark background for better contrast
            color: "#fff", // White text color for readability
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            width: "250px",
            fontSize: "14px",
            textAlign: "left",
            zIndex: 999 // Ensures it stays on top of other content
        }}>
            <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>Live Market Data</h3>
            <p><strong>Market Price:</strong> {marketPrice ?? "N/A"}</p>
            <p><strong>Buy Volume:</strong> {buyVolume ?? "N/A"}</p>
            <p><strong>Sell Volume:</strong> {sellVolume ?? "N/A"}</p>
            <p><strong>Buy Liquidity:</strong> {buyLiquid ?? "N/A"}</p>
            <p><strong>Sell Liquidity:</strong> {sellLiquid ?? "N/A"}</p>
        </div>
    );
};

MarketInfoCard.propTypes = {
    company: PropTypes.string.isRequired, // Ensures 'company' is a required string
};

export default MarketInfoCard;
