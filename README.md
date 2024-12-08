# **Fake Review Detection Using Machine Learning**

## **Overview**
Fake reviews can mislead customers and harm business credibility. This project leverages advanced machine learning techniques and natural language processing (NLP) to detect fake reviews in e-commerce platforms. By combining linguistic feature extraction and ensemble classifiers, the model achieves robust performance in identifying fake reviews.

---

## **Features**
- Preprocessing of review text, including URL removal and linguistic feature extraction.
- TF-IDF vectorization for text representation.
- Integration of an ensemble model using:
  - **LightGBM**
  - **CatBoost**
  - **XGBoost**
- Scalable training using multiprocessing.
- Model evaluation with metrics like classification report and ROC-AUC.

---

## **Technologies Used**
- **Programming Language**: Python
- **Libraries**: 
  - Machine Learning: `scikit-learn`, `lightgbm`, `xgboost`, `catboost`
  - NLP: `spacy`, `TextBlob`
  - Data Processing: `pandas`, `numpy`
- **Tools**: `joblib` for model saving/loading, `TfidfVectorizer` for feature extraction.

---

## **Installation**
> **Note:** This project requires both **Docker** and **Docker Compose** installed on your machine. Please ensure they are set up before proceeding.
1. **Clone the Repository**
   ```bash
   git clone https://github.com/VijetHegde604/fake-review-detection.git
   cd fake-review-detector
   ```
2. **Install the required modules**
   ```bash
   cd fake-review-frontend
   npm install
   ```
3. **Set up the Frontend**
   ```bash
   npm run dev
   ```
> **Note:** This starts the docker container and react frontend, 
> The website will be available at **localhost:5173**
   
