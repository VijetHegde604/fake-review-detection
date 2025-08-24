# **Fake Review Detection Using Machine Learning**

## **Overview**

Fake reviews can mislead customers and harm business credibility. This project leverages advanced machine learning techniques and natural language processing (NLP) to detect fake reviews on e-commerce platforms. By combining linguistic feature extraction and ensemble classifiers, the model achieves robust performance in identifying fake reviews.

-----

## **Features**

  * Preprocessing of review text, including URL removal and linguistic feature extraction.
  * TF-IDF vectorization for text representation.
  * Integration of an ensemble model using:
      * **LightGBM**
      * **CatBoost**
      * **XGBoost**
  * Scalable training using multiprocessing.
  * Model evaluation with metrics like classification report and ROC-AUC.

-----

## **Technologies Used**

  * **Programming Languages**: Python, JavaScript, NodeJS
  * **Libraries**:
      * **Machine Learning**: `scikit-learn`, `lightgbm`, `xgboost`, `catboost`
      * **NLP**: `spacy`, `TextBlob`
      * **Data Processing**: `pandas`, `numpy`
  * **Tools**: `joblib` for model saving/loading, `TfidfVectorizer` for feature extraction

-----

## **Installation**

> **Note:** This project requires both **Docker** and **Docker Compose** installed on your machine.

### **1. Clone the Repository**

```bash
git clone https://github.com/VijetHegde604/fake-review-detection.git
cd fake-review-detection
```

### **2. Set Up the `.env` File for the Server**

Before running the backend, create a `.env` file inside the `server` directory with the required credentials:

```
AMAZON_EMAIL=your_email_here
AMAZON_PASSWORD=your_password_here
```

Replace `your_email_here` and `your_password_here` with your actual Amazon credentials. This is necessary for the scraper to access Amazon reviews.

### **3. Install Frontend Dependencies**

```bash
cd fake-review-frontend
npm install
```

### **4. Run the Project**

```bash
npm run dev
```

This command will start the Docker container and launch the React frontend. You can access the website at `http://localhost:5173`.

-----

## **Usage**

  * Add or scrape reviews via the frontend interface.
  * The backend server uses the trained ensemble model to classify reviews as fake or real.
  * View analytics and performance metrics through the dashboard.

-----

## **Project Structure**

```
fake-review-detector/
├── server/                   # Backend code
│   ├── app.py
│   ├── scraper.js
│   ├── saved_models/
│   └── .env                  # Environment variables
├── fake-review-frontend/     # Frontend React project
├── docker-compose.yml
└── README.md
```

-----

## **My LinkedIn**

  * [Vijet Hegde](https://www.linkedin.com/in/vijet-hegde-5b8324274/)
