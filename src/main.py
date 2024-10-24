import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics import classification_report, accuracy_score
from sklearn.pipeline import Pipeline
from xgboost import XGBClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Load your dataset with error handling
try:
    data = pd.read_csv('./dataset/fake reviews dataset.csv')
except Exception as e:
    print(f"Error loading dataset: {e}")
    raise

# Preprocess the text data and labels
X = data['text_']  # Review text column
y = data['label']  # 'OR' or 'CG'

# Encode labels (convert 'CG' and 'OR' to 0 and 1)
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Create a pipeline with TF-IDF and XGBoost Classifier
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1, 2), max_features=5000)),  # Include bigrams and limit features
    ('svd', TruncatedSVD(n_components=50)),  # Reduce dimensionality
    ('clf', XGBClassifier(use_label_encoder=False, eval_metric='logloss'))  # XGBoost classifier
])

# Split the data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Check if model exists
model_path = 'best_fake_review_model.pkl'

if os.path.exists(model_path):
    # Load the model if it exists
    best_model = joblib.load(model_path)
    print("Model loaded from disk.")
else:
    # Hyperparameter tuning using GridSearchCV
    param_grid = {
        'clf__n_estimators': [100, 200, 300],
        'clf__max_depth': [3, 5, 7],
        'clf__learning_rate': [0.01, 0.1, 0.2],
        'clf__subsample': [0.6, 0.8, 1.0]
    }

    grid_search = GridSearchCV(
        pipeline, 
        param_grid, 
        cv=3, 
        n_jobs=-1, 
        verbose=2
    )

    # Fit the model
    grid_search.fit(X_train, y_train)

    # Get the best estimator
    best_model = grid_search.best_estimator_

    # Save the model to disk
    joblib.dump(best_model, model_path)
    print(f"Model saved to {model_path}")

# Predict on the test set
y_pred = best_model.predict(X_test)

# Print evaluation metrics
print("Classification Report:\n", classification_report(y_test, y_pred))
print("Accuracy:", accuracy_score(y_test, y_pred))

# Function to predict the percentage of fake reviews
def predict_percentage(reviews):
    reviews_transformed = best_model['tfidf'].transform(reviews)  # Transform reviews to TF-IDF format
    reviews_reduced = best_model['svd'].transform(reviews_transformed)  # Apply SVD
    predictions = best_model['clf'].predict(reviews_reduced)
    fake_count = (predictions == 1).sum()  # Assuming 'OR' encoded as 1 indicates fake reviews
    percentage = (fake_count / len(predictions)) * 100
    return percentage

# Example usage:
reviews = ["This product is amazing!", "Terrible, do not buy."]
print("Percentage of fake reviews:", predict_percentage(reviews))
