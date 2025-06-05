# Iris Flower Classification Web Application

This is a web application that uses machine learning to classify Iris flowers based on their measurements. The application implements two different classification models: Logistic Regression and K-Nearest Neighbors (KNN).

## Features

- Real-time flower classification using two different ML models
- Input form for flower measurements
- Confidence scores for predictions
- Responsive web interface
- Model comparison (Logistic Regression vs KNN)

## Technical Details

The application uses:
- Flask for the web framework
- scikit-learn for machine learning models
- pandas for data handling
- The classic Iris dataset for training

## Installation

1. Clone this repository
2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install the required packages:
```bash
pip install -r requirements.txt
```

## Usage

1. Start the application:
```bash
python app.py
```

2. Open your web browser and navigate to:
```
http://localhost:5000
```

3. Enter the flower measurements:
   - Sepal Length
   - Sepal Width
   - Petal Length
   - Petal Width

4. Click "Predict" to get the classification results

## Models

The application uses two different models:

1. **Logistic Regression**
   - Fast and interpretable
   - Good baseline model
   - Works well for this dataset

2. **K-Nearest Neighbors (KNN)**
   - Hyperparameter-tuned version
   - Uses GridSearchCV for optimal parameters
   - Considers multiple distance metrics

## Dataset

The application uses the famous Iris dataset, which includes:
- 150 samples
- 4 features (measurements)
- 3 classes of Iris flowers:
  - Setosa
  - Versicolor
  - Virginica

## Requirements

- Python 3.8+
- Flask
- pandas
- scikit-learn
- numpy

## License

This project is open source and available under the MIT License. 