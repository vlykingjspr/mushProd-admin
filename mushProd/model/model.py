from pyexpat import model
import joblib

# Assuming 'model' is your trained model
joblib.dump(model, 'Model_ver1.joblib')
