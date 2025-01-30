import PropTypes from 'prop-types';
// import './Card.css'; // Optional for styling

const Card = ({ companyName, stockValue, imageUrl, onClick }) => {
    return (
        <div className="card" onClick={onClick}>
            <img src={imageUrl} alt={`${companyName} logo`} className="card-image" />
            <div className="card-content">
                <p className="card-stock-value">{`Stock Value: $${stockValue}`}</p>
            </div>
        </div>
    );
};

// PropTypes validation
Card.propTypes = {
    companyName: PropTypes.string.isRequired,
    stockValue: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default Card;
