import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';
// import './ApexChart.css'; // Import the CSS

const ApexChart = ({ companyName }) => {
  const [state, setState] = useState({
    series: [{
      name: 'Stock Price',
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

    // Dummy data for demonstration
    const dummyData = [
      { timestamp: '2023-10-01T00:00:00Z', price: 100 },
      { timestamp: '2023-10-02T00:00:00Z', price: 105 },
      { timestamp: '2023-10-03T00:00:00Z', price: 102 },
      { timestamp: '2023-10-04T00:00:00Z', price: 110 },
      { timestamp: '2023-10-05T00:00:00Z', price: 115 },
    ];

    const initialData = dummyData.map(item => ({
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