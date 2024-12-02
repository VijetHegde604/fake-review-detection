import React, { useState, useRef, useEffect } from "react";
import useFetch from "../hooks/fetchData";
import axios from "axios";
import PredictionChart from "./Chart.jsx";

function Input() {
    const [formData, setFormData] = useState({ url: "", maxReviews: 50 });
    const [isError, setIsError] = useState(false);
    const [predictionStatus, setPredictionStatus] = useState(null);
    const [reviewLimit, setReviewLimit] = useState(50);
    const inputRef = useRef(null);
    const [predictionResult, setPredictionResult] = useState(null);

    const { data, loading, error, fetchData } = useFetch();

    useEffect(() => {
        if (data) {
            processReviews(data);
        }
    }, [data]);

    const processReviews = (data) => {
        const reviews = data.reviews;
        const filteredData = reviews.map((review) => ({
            text: review.text || "No text provided",
            rating: review.rating || null,
        }));
        axios
            .post(
                "http://homeserverpi:5000/predict", filteredData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                setPredictionStatus({
                    message: "Predictions received!",
                    success: true,
                });
                console.log("Prediction Results:", response.data);
                setPredictionResult(response.data);
            })
            .catch((err) => {
                setPredictionStatus({
                    message: "Failed to process predictions.",
                    success: false,
                });
                console.error(err.response ? err.response.data : err.message);
            });
    };

    const handlePaste = () => {
        navigator.clipboard.readText().then((text) => {
            setFormData((prev) => ({ ...prev, url: text }));
            setIsError(false);
        });
    };

    const handleAnalyze = () => {
        if (!formData.url || !isValidUrl(formData.url)) {
            handleInputError();
            return;
        }
        if (formData.maxReviews < 1) {
            setPredictionStatus({
                message: `Please enter a valid review count (1-${reviewLimit}).`,
                success: false,
            });
            return;
        }
        setPredictionStatus(null);
        fetchData(formData.url, formData.maxReviews);
    };

    const handleReset = () => {
        setFormData({ url: "", maxReviews: 50 });
        setIsError(false);
        setPredictionStatus(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "url") setIsError(false);
    };

    const isValidUrl = (url) => {
        const urlPattern = new RegExp(
            "^(https?:\\/\\/)?" + // protocol
            "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" + // domain name
            "localhost|" + // localhost
            "\\d{1,3}(\\.\\d{1,3}){3})" + // OR IPv4
            "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-zA-Z\\d_]*)?$", // fragment locator
            "i"
        );
        return urlPattern.test(url);
    };

    const handleInputError = () => {
        setIsError(true);
        if (inputRef.current) {
            inputRef.current.classList.add("animate-shake");
            setTimeout(() => {
                inputRef.current.classList.remove("animate-shake");
            }, 500);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-teal-500 to-cyan-600 flex items-center justify-center py-8 px-4 mt-8">
            <div className="bg-white shadow-2xl rounded-lg p-10 w-full max-w-2xl">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
                    Fake Review Detection
                </h1>

                <div className="mb-8">
                    <label htmlFor="product-link" className="block text-gray-700 text-lg font-medium mb-2">
                        Product Link
                    </label>
                    <div className="flex items-center space-x-4">
                        <input
                            type="url"
                            id="product-link"
                            name="url"
                            placeholder="Paste product link here..."
                            value={formData.url}
                            onChange={handleChange}
                            ref={inputRef}
                            className={`w-full p-4 border ${isError ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
                        />
                        <button
                            onClick={handlePaste}
                            className="bg-teal-600 text-white px-5 py-3 rounded-md shadow-lg hover:bg-teal-700 focus:outline-none"
                        >
                            Paste
                        </button>
                    </div>
                    {isError && (
                        <p className="text-red-500 text-sm text-center mt-2">Please enter a valid product link!</p>
                    )}
                </div>

                <div className="mb-8">
                    <label htmlFor="num-reviews" className="block text-gray-700 text-lg font-medium mb-2">
                        Number of Reviews
                    </label>
                    <input
                        type="number"
                        id="num-reviews"
                        name="maxReviews"
                        min="1"
                        max={reviewLimit}
                        value={formData.maxReviews}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>

                <div className="mb-8">
                    <small className="text-gray-500">More reviews will take more time to process</small>
                </div>

                {loading && (
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="ml-4 text-gray-600">Fetching reviews...</p>
                    </div>
                )}

                {error && <p className="text-red-500 text-center mb-6">{error}</p>}

                {predictionStatus && (
                    <div
                        className={`text-center p-4 rounded mb-6 ${predictionStatus.success
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {predictionStatus.message}
                    </div>
                )}

                <div className="flex space-x-4">
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className={`flex-1 py-4 rounded-lg shadow-md text-white ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-teal-600 hover:bg-teal-700"
                            }`}
                    >
                        {loading ? "Analyzing..." : "Analyze Reviews"}
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex-1 py-4 bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-lg shadow-md"
                    >
                        Reset
                    </button>
                </div>

                {/* Render the PredictionChart only if predictionResult is available */}
                {predictionResult && <PredictionChart predictionResult={predictionResult} />}
            </div>
        </div>
    );
}

export default Input;
