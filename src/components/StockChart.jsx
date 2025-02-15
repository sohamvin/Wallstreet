import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { stockService } from '../services/axioapis.js'; // Assuming stock service to fetch historical data
import socketService from "../services/sockets.js"; // Assuming socket service for real-time updates
import PropTypes from 'prop-types';
// import './ApexChart.css'; // Import the CSS

const ApexChart = ({ companyName }) => {
  const [state, setState] = useState({
    series: [{
      name: 'XYZ MOTORS',
      data: [],
    }],
    options: {
      chart: {
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: 'zoom'
        }
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
      },
      title: {
        text: 'Stock Price Movement',
        align: 'left'
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return (val / 1000000).toFixed(0);
          },
        },
        title: {
          text: 'Price'
        },
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            return (val / 1000000).toFixed(0)
          }
        }
      }
    },
  });

  useEffect(() => {
    if (!companyName) return;

    // Fetch initial data for the company
    const fetchData = async () => {
      try {
        const data = await stockService.getHistoricalData(companyName);
        const initialData = data.map(item => ({
          x: new Date(item.timestamp), // Assuming timestamp is in a compatible format
          y: parseFloat(item.price)
        }));
        
        setState(prevState => ({
          ...prevState,
          series: [{
            name: 'Stock Price',
            data: initialData
          }]
        }));
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    fetchData();

    // Set up real-time socket listener for price updates
    socketService.connect();
    socketService.subscribeToCompany(companyName);

    socketService.onMarketUpdate((data) => {
      try {
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;
        const newData = {
          x: new Date(parsedData.timestamp), // New timestamp
          y: parseFloat(parsedData.price)   // New price
        };

        setState(prevState => ({
          ...prevState,
          series: [{
            name: 'Stock Price',
            data: [...prevState.series[0].data, newData]
          }]
        }));
      } catch (error) {
        console.error("Error parsing real-time data:", error);
      }
    });

    return () => {
      socketService.removeListeners();
      socketService.disconnect();
    };
  }, [companyName]);

  return (
    <div className="chart-container">
      <div className="chart-title">Stock Price Movement</div>
      <div className="chart-subtitle">Real-time updates for {companyName}</div>
      <div id="chart">
        <ReactApexChart options={state.options} series={state.series} type="area" height={500} />
      </div>
    </div>
  );
}

// Prop validation for 'companyName'
ApexChart.propTypes = {
  companyName: PropTypes.string.isRequired, // Ensure 'companyName' is passed
};

export default ApexChart;
