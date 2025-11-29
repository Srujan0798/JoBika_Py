import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import numpy as np

# Mock Data Generation (since we don't have the CSV)
data = {
    'role': ['Software Engineer', 'Data Scientist', 'Product Manager', 'DevOps Engineer'] * 25,
    'experience_years': np.random.randint(1, 15, 100),
    'location': ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad'] * 25,
    'company_size': ['Startup', 'MNC', 'Mid-size'] * 33 + ['Startup'],
    'python': np.random.randint(0, 2, 100),
    'javascript': np.random.randint(0, 2, 100),
    'react': np.random.randint(0, 2, 100),
    'aws': np.random.randint(0, 2, 100),
    'docker': np.random.randint(0, 2, 100),
    'education_level': ['B.Tech', 'M.Tech', 'BCA'] * 33 + ['B.Tech'],
    'previous_ctc': np.random.randint(500000, 3000000, 100)
}
data['ctc'] = data['previous_ctc'] * 1.3 # Target variable

df = pd.DataFrame(data)

# Features
feature_columns = [
    'role', 'experience_years', 'location', 'company_size',
    'python', 'javascript', 'react', 'aws', 'docker',
    'education_level', 'previous_ctc'
]

X = df[feature_columns]
y = df['ctc']

# Encode categorical variables
le_dict = {}
for col in ['role', 'location', 'company_size', 'education_level']:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    le_dict[col] = le

# Train model
model = GradientBoostingRegressor(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=3,
    random_state=42
)

model.fit(X, y)

# Save model and encoders
joblib.dump(model, 'salary_prediction_model.pkl')
joblib.dump(le_dict, 'label_encoders.pkl')

print("Model trained and saved successfully.")

# Feature importance
importance = pd.DataFrame({
    'feature': feature_columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nFeature Importance:")
print(importance)
