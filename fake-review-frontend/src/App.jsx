import { useState } from 'react'


function App() {
  return (
    <>
      <div className="container mx-auto px-4 py-16 bg-slate-400 h-screen">
        <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8 text-center mb-6">
          <div className="flex justify-center mb-6">
            <svg className="w-20 h-20 text-red-400 mt-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 12l-10-5 10-5 10 5-10 5z" />
              <path d="M12 2v12l10-5z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-800 mt-0">ReviewGuard</h1>
          <p className="text-gray-600 mb-8 text-lg">Detect Fake Reviews with Advanced AI</p>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter Review URL to Analyze"
              className="w-full px-4 py-3 border-2 border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
            />

          </div>

          <button className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-lg">
            Detect Fake Reviews
          </button>

          <div className="mt-8 text-sm text-gray-500">
            Powered by Advanced Machine Learning Algorithms
          </div>
        </div>
        <div className="flex justify-center items-center">
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
            className="w-8 h-8 rounded-full mx-2"
          />
          <a
            href="https://github.com/Vijethegde604"
            target="_blank"
            className="text-blue-600 font-semibold hover:underline"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </>
  )
}

export default App
