import { Line } from "react-chartjs-2";
import PropTypes from 'prop-types';  // Import PropTypes
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineChart({ chartData }) {
  return (
    <div className="chart-container" style={{ height: "350px" }}>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "",
            },
            legend: {
              display: false,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          elements: {
            point: {
              radius: 0,
            },
          },
          scales: {
            x: {
              type: 'category', // Ensure 'category' scale is used
              grid: {
                display: false
              }
            },
            y: {
              grid: {
                display: false
              }
            }
          }
        }}
      />
    </div>
  );
}

// Prop validation for 'chartData'
LineChart.propTypes = {
  chartData: PropTypes.shape({
    labels: PropTypes.array.isRequired,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired,
        borderColor: PropTypes.string.isRequired,
        backgroundColor: PropTypes.string.isRequired,
        fill: PropTypes.bool.isRequired,
        tension: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default LineChart;
