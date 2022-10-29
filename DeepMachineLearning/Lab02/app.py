from flask import Flask, render_template, request
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
import pickle

app = Flask(__name__)


@app.route('/', methods=['POST', 'GET'])
def titanic_form():
    if request.method == 'GET':
        return render_template('titanic_form.html')
    else:
        with open("titanic_pipeline.pickle", "rb") as infile:
            titanic_pipeline = pickle.load(infile)

        sex = request.form['sex']

        pclass = request.form['pclass']
        if isinstance(pclass, int):
            pclass = int(pclass)
        else:
            pclass = np.nan

        age = request.form['age']
        if age.isnumeric():
            age = float(age)
        else:
            age = np.nan

        df = pd.DataFrame(
            {'Sex': [sex], 'Pclass': [pclass], 'Age': [age]}
        )

        prediction = titanic_pipeline.predict(
            df
        )

        return render_template('result.html', result=100 * round(prediction[0], 3))


if __name__ == '__main__':
    app.run(debug=True)