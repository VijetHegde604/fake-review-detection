import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

function PredictionPieChart({ predictionResult }) {
    if (!predictionResult || predictionResult.length === 0) {
        return <p>No predictions to display.</p>;
    }

    // Calculate counts for fake and genuine reviews
    const fakeCount = predictionResult.filter((review) => review.prediction === "fake").length;
    const genuineCount = predictionResult.filter((review) => review.prediction === "genuine").length;

    // Prepare data for the pie chart
    const chartData = [
        { name: "Fake Reviews", value: fakeCount },
        { name: "Genuine Reviews", value: genuineCount },
    ];

    // Colors for the chart
    const COLORS = ["#FF0000", "#00FF00"]; // Red for fake, green for genuine

    return (
        <div>
            <h2 className="text-center mb-4">Prediction Results</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default PredictionPieChart;
