# Import the necessary libraries
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

# Load the model
model_path = './saved_model/best_fake_review_model.pkl'
best_model = joblib.load(model_path)

# Create the Flask app
app = Flask(__name__)
CORS(app)

# Define the predict_percentage function
def predict_percentage(reviews):
    reviews_transformed = best_model['tfidf'].transform(reviews)  # Transform reviews to TF-IDF format
    reviews_reduced = best_model['svd'].transform(reviews_transformed)  # Apply SVD
    predictions = best_model['clf'].predict(reviews_reduced)
    fake_count = (predictions == 1).sum()  # Assuming 'OR' encoded as 1 indicates fake reviews
    percentage = (fake_count / len(predictions)) * 100
    return percentage

# Define the /check endpoint
@app.route('/check', methods=['POST'])
def check_reviews():
    data = request.json  # Get the JSON data from the request
    reviews = data.get('reviews', [])  # Extract reviews from the data
    percentage = predict_percentage(reviews)  # Use the model's prediction function
    return jsonify({'fake_percentage': percentage})

if __name__ == '__main__':
    app.run(port=5000)
