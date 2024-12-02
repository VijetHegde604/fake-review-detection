import React from 'react';

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-6 bg-gradient-to-r from-blue-500 to-purple-600 overflow-y-scroll no-scrollbar">
      {/* Header Section */}
      <header className="text-center  text-white w-full pt-12">
        <h1 className="text-4xl font-bold">About Fake Review Detector</h1>
        <p className="mt-4 text-lg">
          Tackling fake reviews, empowering online shoppers!
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl bg-white rounded-lg shadow-lg mt-8 p-6">
        {/* Mission Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            The Fake Review Detector is a project aimed at enhancing trust and transparency in online shopping.
            With the increasing prevalence of fake reviews, our tool leverages machine learning to help users
            identify genuine feedback and make informed purchasing decisions.
          </p>
        </section>

        {/* How It Works Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Our solution integrates:
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li><strong>Machine Learning Model:</strong> A state-of-the-art XGBoost model optimized to detect fake reviews with high accuracy.</li>
            <li><strong>Web Scraper</strong> Seamlessly integrates with e-commerce platforms to analyze reviews in real time.</li>
            <li><strong>Backend Server:</strong> Efficiently processes user requests and interacts with the ML model.</li>
          </ul>
        </section>

        {/* Vision Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            We envision a future where online shopping is free from misinformation and users can trust the reviews they read.
            The Fake Review Detector is our contribution to building a more transparent and fair digital marketplace.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-black mt-12">
        <p>&copy; {new Date().getFullYear()} Fake Review Detector. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default About;
