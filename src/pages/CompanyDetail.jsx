import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import ApexChart from "../components/StockChart.jsx";
import MarketInfoCard from '../components/MarketInfoCard.jsx';

const CompanyDetail = ({ companies }) => {
    const { id } = useParams(); // Get the id from the URL
    // const company = companies[id]; // Find the company using the id

    const company = companies.find(company => company.name === id); // Find the company using the name


    if (!company) {
        return <div>Company not found</div>;
    }

    
    return (
        <div style={{ padding: '40px 20px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Real-time Market Data */}
            <MarketInfoCard company={company.name} />

            {/* Company Information */}
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{company.name}</h2>
            <img 
                src={company.imageUrl} 
                alt={`${company.name} logo`} 
                style={{ width: '20%', height: 'auto', marginBottom: '20px' }} 
            />
            <p style={{ fontSize: '1.5rem', marginBottom: '40px' }}>
                {`Stock Value: $${company.stockValue}`}
            </p>

            {/* Chart Component */}
            <div >
                <ApexChart companyName={company.name} />
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
