import React from 'react'

function Input() {
    const [productLink, setProductLink] = React.useState("")
    const [numReviews, setNumReviews] = React.useState(50)

    const handlePaste = () => {
        window.navigator.clipboard.readText()
            .then((text) => setProductLink(text))
    }

    const handleAnalyze = () => {
        console.log("Analyzing")
    }
    return (
        <div className='flex items-center justify-center p-0 m-0 min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 font-mono'>
            <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
                <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                    Fake Review Detection System
                </h1>
                {/* Input for Product Link */}
                <label
                    htmlFor="product-link"
                    className="block text-gray-700 font-medium mb-2"
                >
                    Product Link:
                </label>
                <div className="flex space-x-2 mb-4">
                    <input
                        type="url"
                        id="product-link"
                        placeholder="Paste product link here..."
                        value={productLink}
                        onChange={(e) => setProductLink(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300 focus:border-indigo-500"
                    />
                    <button
                        onClick={handlePaste}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 focus:outline-none"
                    >
                        Paste
                    </button>
                </div>

                {/* Input for Number of Reviews */}
                <label
                    htmlFor="num-reviews"
                    className="block text-gray-700 font-medium mb-2"
                >
                    Number of Reviews:
                </label>
                <input
                    type="number"
                    id="num-reviews"
                    placeholder="Enter number of reviews"
                    value={numReviews}
                    onChange={(e) => setNumReviews(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300 focus:border-indigo-500 mb-4"
                />
                <div className='flex justify-start items-start pb-2'><small>More Reviews Take More Time</small></div>

                {/* Submit Button */}
                <button
                    onClick={handleAnalyze}
                    className="w-full bg-indigo-600 text-white py-2 rounded-md shadow hover:bg-indigo-700 focus:outline-none"
                >
                    Analyze Reviews
                </button>
            </div>
        </div>
    )
}

export default Input