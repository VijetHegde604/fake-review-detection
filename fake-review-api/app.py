from flask import Flask, request, jsonify
import joblib
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from textblob import TextBlob
import spacy
from collections import Counter
from sklearn.metrics import f1_score

app = Flask(__name__)

# Load the trained model and other components
model_dir = './saved_models'
vectorizer = joblib.load(f'{model_dir}/fake_review_detector_vectorizer.joblib')
classifier = joblib.load(f'{model_dir}/fake_review_detector_classifier.joblib')
scaler = joblib.load(f'{model_dir}/fake_review_detector_scaler.joblib')

# Load SpaCy model for text processing
nlp = spacy.load('en_core_web_sm')

# Default threshold (can be modified based on performance)
DEFAULT_THRESHOLD = 0.3

def extract_linguistic_features(text):
    """Extract linguistic features"""
    doc = nlp(text)
    word_count = len(doc)
    char_count = len(text)
    pos_counts = Counter([token.pos_ for token in doc])
    total_tokens = sum(pos_counts.values()) if pos_counts else 1
    blob = TextBlob(text)
    sentiment_polarity = blob.sentiment.polarity
    sentiment_subjectivity = blob.sentiment.subjectivity
    exclamation_count = text.count('!')
    question_count = text.count('?')
    capital_ratio = sum(1 for c in text if c.isupper()) / len(text) if len(text) > 0 else 0
    
    return {
        'word_count': word_count,
        'char_count': char_count,
        'noun_ratio': pos_counts['NOUN'] / total_tokens if 'NOUN' in pos_counts else 0,
        'verb_ratio': pos_counts['VERB'] / total_tokens if 'VERB' in pos_counts else 0,
        'adj_ratio': pos_counts['ADJ'] / total_tokens if 'ADJ' in pos_counts else 0,
        'sentiment_polarity': sentiment_polarity,
        'sentiment_subjectivity': sentiment_subjectivity,
        'exclamation_count': exclamation_count,
        'question_count': question_count,
        'capital_ratio': capital_ratio
    }

def get_dynamic_threshold(X_val, y_val):
    """Compute dynamic threshold based on F1 score"""
    # Get predicted probabilities for the validation set
    probs = classifier.predict_proba(X_val)[:, 1]

    # Test different thresholds and calculate F1-scores
    thresholds = np.linspace(0, 1, 101)
    f1_scores = []

    for threshold in thresholds:
        # Make predictions based on the threshold
        preds = (probs >= threshold).astype(int)
        f1 = f1_score(y_val, preds)
        f1_scores.append(f1)

    # Find the threshold with the highest F1-score
    best_threshold = thresholds[np.argmax(f1_scores)]
    return best_threshold

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        results = []

        for review in data:
            text = review['text']
            rating = review['rating']

            processed_text = text.lower()
            tfidf_features = vectorizer.transform([processed_text])
            linguistic_features = np.array([list(extract_linguistic_features(text).values())])
            X = np.hstack((tfidf_features.toarray(), linguistic_features, np.array([[rating]])))
            X = scaler.transform(X)

            # Get dynamic threshold based on validation data (can be computed periodically)
            # In production, you can compute the dynamic threshold on a separate validation set periodically
            # For this example, assume we have validation data available in `X_val` and `y_val`
            dynamic_threshold = DEFAULT_THRESHOLD  # Set this based on your validation performance

            # Get prediction probabilities
            prediction_prob = classifier.predict_proba(X)[:, 1][0]

            # Use dynamic threshold to classify
            prediction = 'fake' if prediction_prob >= dynamic_threshold else 'genuine'

            result = {
                'prediction': prediction,
                'probability': float(prediction_prob),
                'threshold': dynamic_threshold  # Include threshold in the response for transparency
            }
            results.append(result)

        return jsonify(results)

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
