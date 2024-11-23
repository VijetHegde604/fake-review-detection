import pandas as pd
import numpy as np
import os
import re
import spacy
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import VotingClassifier
from lightgbm import LGBMClassifier
from catboost import CatBoostClassifier
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix
import joblib
from collections import Counter
import warnings
import multiprocessing
from textblob import TextBlob

# Set up multiprocessing to use most CPU cores
NUM_CORES = max(1, multiprocessing.cpu_count() - 1)

warnings.filterwarnings('ignore')

class EnhancedFakeReviewDetector:
    def __init__(self, model_dir='saved_models'):
        """Initialize with model directory path"""
        self.model_dir = model_dir
        self.nlp = spacy.load('en_core_web_sm')
        
        # Initialize components
        self.vectorizer = TfidfVectorizer(
            max_features=4000,
            ngram_range=(1, 3),
            min_df=2,
            max_df=0.85,
            strip_accents='unicode',
            use_idf=True,
            smooth_idf=True,
            sublinear_tf=True
        )
        
        # Create ensemble with updated LightGBM configuration
        base_estimators = [
            ('lgbm', LGBMClassifier(
                n_estimators=300,
                learning_rate=0.03,
                num_leaves=31,
                feature_fraction=0.8,  # Fixed parameter
                bagging_fraction=0.8,  # Fixed parameter
                random_state=42,
                n_jobs=NUM_CORES
            )),
            ('catboost', CatBoostClassifier(
                iterations=300,
                learning_rate=0.03,
                depth=6,
                l2_leaf_reg=3,
                random_strength=0.8,
                random_state=42,
                verbose=False,
                thread_count=NUM_CORES
            )),
            ('xgboost', XGBClassifier(
                n_estimators=300,
                learning_rate=0.03,
                max_depth=6,
                subsample=0.8,
                colsample_bytree=0.8,
                random_state=42,
                n_jobs=NUM_CORES
            ))
        ]
        
        self.classifier = VotingClassifier(
            estimators=base_estimators,
            voting='soft',
            weights=[1, 1, 1],
            n_jobs=NUM_CORES
        )
        
        self.scaler = StandardScaler()

    def extract_linguistic_features(self, text):
        """Extract linguistic features"""
        doc = self.nlp(text)
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

    def preprocess_text(self, text):
        """Text preprocessing"""
        text = text.lower()
        text = re.sub(r'http\S+|www\S+|https\S+', '', text)
        text = re.sub(r'[^\w\s!?.,]', '', text)
        return ' '.join(text.split())

    def train(self, df):
        """Train the model"""
        print(f"Training using {NUM_CORES} CPU cores")
        
        try:
            # Extracting text column and preprocessing
            texts = df['text_'].values
            processed_texts = [self.preprocess_text(text) for text in texts]
            print("Text preprocessing completed.")
            
            # Extracting TF-IDF features
            tfidf_features = self.vectorizer.fit_transform(processed_texts)
            print("TF-IDF feature extraction completed.")
            
            # Extracting linguistic features
            linguistic_features = np.array([list(self.extract_linguistic_features(text).values()) for text in texts])
            print("Linguistic features extracted.")
            
            # Combining all features
            X = np.hstack((tfidf_features.toarray(), linguistic_features, df['rating'].values.reshape(-1, 1)))
            X = self.scaler.fit_transform(X)
            print("Feature scaling completed.")
            
            # Defining target labels
            y = (df['label'] == 'CG').astype(int)
            
            # Splitting data into train and test sets
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
            print("Data split into train and test sets.")
            
            # Training the ensemble model
            print("Training model...")
            self.classifier.fit(X_train, y_train)
            y_pred = self.classifier.predict(X_test)
            
            # Evaluation
            print("\nClassification Report:")
            print(classification_report(y_test, y_pred))
            print(f"ROC-AUC Score: {roc_auc_score(y_test, self.classifier.predict_proba(X_test)[:, 1])}")
            print("Confusion Matrix:")
            print(confusion_matrix(y_test, y_pred))
        
        except Exception as e:
            print(f"Error during training: {e}")

    def save_model(self, model_name='fake_review_detector'):
        """Save all model components"""
        os.makedirs(self.model_dir, exist_ok=True)
        joblib.dump(self.vectorizer, os.path.join(self.model_dir, f'{model_name}_vectorizer.joblib'))
        joblib.dump(self.classifier, os.path.join(self.model_dir, f'{model_name}_classifier.joblib'))
        joblib.dump(self.scaler, os.path.join(self.model_dir, f'{model_name}_scaler.joblib'))
        print(f"Model saved successfully in {self.model_dir}")

# Main execution
if __name__ == "__main__":
    try:
        df = pd.read_csv('./dataset/fake reviews dataset.csv')
        detector = EnhancedFakeReviewDetector(model_dir='saved_models')
        detector.train(df)
        detector.save_model()
    except Exception as e:
        print(f"Error during execution: {e}")
