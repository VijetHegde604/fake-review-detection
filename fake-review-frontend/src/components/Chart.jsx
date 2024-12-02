import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

function PredictionChart({ predictionResult }) {
    if (!predictionResult || predictionResult.length === 0) {
        return <p>No predictions to display.</p>;
    }

    // Count fake and genuine reviews based on 'prediction' key
    const fakeReviews = predictionResult.filter(review => review.prediction === "fake");
    const genuineReviews = predictionResult.filter(review => review.prediction === "genuine");

    // Prepare data for the chart
    const data = [
        {
            name: "Fake Reviews",
            value: fakeReviews.length,
            percentage: ((fakeReviews.length / predictionResult.length) * 100).toFixed(2),
        },
        {
            name: "Genuine Reviews",
            value: genuineReviews.length,
            percentage: ((genuineReviews.length / predictionResult.length) * 100).toFixed(2),
        },
    ];

    return (
        <div>
            <h2 className="text-center mb-4">Prediction Results</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey="value"
                        fill="#8884d8"
                        radius={[10, 10, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
                <p>
                    Fake Reviews: {fakeReviews.length} ({data[0].percentage}%)
                </p>
                <p>
                    Genuine Reviews: {genuineReviews.length} ({data[1].percentage}%)
                </p>
            </div>
        </div>
    );
}

export default PredictionChart;
