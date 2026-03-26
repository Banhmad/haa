import React from 'react';
import { Line } from 'react-chartjs-2';

const ChartAnalyzer = ({ data }) => {
    // Prepare data for the chart
    const chartData = {
        labels: data.map(item => item.date),
        datasets: [
            {
                label: 'Open',
                data: data.map(item => item.open),
                borderColor: 'rgba(75,192,192,1)',
                fill: false,
            },
            {
                label: 'High',
                data: data.map(item => item.high),
                borderColor: 'rgba(255,99,132,1)',
                fill: false,
            },
            {
                label: 'Low',
                data: data.map(item => item.low),
                borderColor: 'rgba(255,206,86,1)',
                fill: false,
            },
            {
                label: 'Close',
                data: data.map(item => item.close),
                borderColor: 'rgba(54,162,235,1)',
                fill: false,
            }
        ]
    };

    return (
        <div>
            <h2>Chart Analyzer</h2>
            <Line data={chartData} />
            <div>
                <h3>Volume Data</h3>
                <ul>
                    {data.map((item, index) => (
                        <li key={index}>{`Date: ${item.date}, Volume: ${item.volume}`}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ChartAnalyzer;
