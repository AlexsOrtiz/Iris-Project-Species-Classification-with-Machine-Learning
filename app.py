# app.py

from flask import Flask, request, render_template
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

app = Flask(__name__)

# ------------------------------------------------------------------------------
# 1. DATA LOADING & MODEL TRAINING ON STARTUP
# ------------------------------------------------------------------------------
url = "https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/" \
      "0e7a9b0a5d22642a06d3d5b9bcbad9890c8ee534/iris.csv"
try:
    df = pd.read_csv(url)
except Exception:
    from sklearn.datasets import load_iris
    data = load_iris(as_frame=True)
    df = data.frame.copy()
    df["species"] = pd.Categorical.from_codes(data.target, data.target_names)

# Encode target
le = LabelEncoder()
df["species_encoded"] = le.fit_transform(df["species"])

# Features and target
X = df[["sepal_length", "sepal_width", "petal_length", "petal_width"]].values
y = df["species_encoded"].values

# Train/test split (unused for inference but useful if you want to evaluate)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

# Preprocessing & model pipelines
scaler = StandardScaler().fit(X_train)

# Logistic Regression pipeline
pipe_logistic = Pipeline([
    ("scaler", scaler),
    ("logreg", LogisticRegression(solver="lbfgs", multi_class="auto", max_iter=200, random_state=42))
])
pipe_logistic.fit(X_train, y_train)

# KNN baseline pipeline
pipe_knn = Pipeline([
    ("scaler", scaler),
    ("knn", KNeighborsClassifier(n_neighbors=5, weights="uniform", metric="euclidean"))
])
pipe_knn.fit(X_train, y_train)

# Hyperparameter tuning for KNN (optional, but we’ll train a tuned version)
param_grid_knn = {
    "knn__n_neighbors": [1, 3, 5, 7, 9, 11],
    "knn__weights": ["uniform", "distance"],
    "knn__metric": ["euclidean", "manhattan"]
}
grid_knn = GridSearchCV(
    estimator=pipe_knn,
    param_grid=param_grid_knn,
    scoring="accuracy",
    cv=5,
    n_jobs=-1,
    verbose=0
)
grid_knn.fit(X_train, y_train)
best_knn = grid_knn.best_estimator_

# Optionally evaluate on the hold-out set (for logging)
y_pred_log = pipe_logistic.predict(X_test)
y_pred_knn = best_knn.predict(X_test)

print("Logistic Regression test accuracy:", accuracy_score(y_test, y_pred_log))
print("KNN (tuned) test accuracy:", accuracy_score(y_test, y_pred_knn))

# ------------------------------------------------------------------------------
# 2. FLASK ROUTES
# ------------------------------------------------------------------------------

@app.route("/", methods=["GET", "POST"])
def index():
    result = None
    if request.method == "POST":
        try:
            sl = float(request.form["sepal_length"])
            sw = float(request.form["sepal_width"])
            pl = float(request.form["petal_length"])
            pw = float(request.form["petal_width"])
        except ValueError:
            result = {"error": "Please enter valid numerical values for all fields."}
            return render_template("form.html", result=result)

        # Build numpy array shaped (1,4)
        sample = [[sl, sw, pl, pw]]
        # Predict with Logistic Regression
        pred_log = pipe_logistic.predict(sample)[0]
        proba_log = pipe_logistic.predict_proba(sample)[0][pred_log]
        label_log = le.inverse_transform([pred_log])[0]

        # Predict with Tuned KNN
        pred_knn = best_knn.predict(sample)[0]
        proba_knn = best_knn.predict_proba(sample)[0][pred_knn]
        label_knn = le.inverse_transform([pred_knn])[0]

        result = {
            "logistic": {
                "label": label_log,
                "confidence": f"{proba_log*100:.2f}%"
            },
            "knn": {
                "label": label_knn,
                "confidence": f"{proba_knn*100:.2f}%"
            }
        }

    return render_template("form.html", result=result)


if __name__ == "__main__":
    app.run(debug=True)
