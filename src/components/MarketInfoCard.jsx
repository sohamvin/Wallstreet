import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const MarketInfoCard = ({ company }) => {
    const [marketPrice, setMarketPrice] = useState(null);
    const [buyVolume, setBuyVolume] = useState(null);
    const [sellVolume, setSellVolume] = useState(null);
    const [buyLiquid, setBuyLiquid] = useState(null);
    const [sellLiquid, setSellLiquid] = useState(null);

    useEffect(() => {
        if (!company) return;

        // Dummy data for demonstration
        const dummyData = {
            marketPrice: 123.45,
            buyVolume: 1000,
            sellVolume: 800,
            buyLiquid: 500,
            sellLiquid: 300
        };

        // Simulate data fetching
        setTimeout(() => {
            setMarketPrice(dummyData.marketPrice);
            setBuyVolume(dummyData.buyVolume);
            setSellVolume(dummyData.sellVolume);
            setBuyLiquid(dummyData.buyLiquid);
            setSellLiquid(dummyData.sellLiquid);
        }, 1000); // Simulate a delay
    }, [company]);

    return (
        <div className="market-info-card">
            <h3>{company} Market Info</h3>
            <p>Market Price: ${marketPrice}</p>
            <p>Buy Volume: {buyVolume}</p>
            <p>Sell Volume: {sellVolume}</p>
            <p>Buy Liquid: {buyLiquid}</p>
            <p>Sell Liquid: {sellLiquid}</p>
        </div>
    );
};

MarketInfoCard.propTypes = {
    company: PropTypes.string.isRequired,
};

export default MarketInfoCard;