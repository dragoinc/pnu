from flask import Flask, render_template, request
import pandas as pd
import numpy as np
import pickle
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import cross_val_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


app = Flask(__name__)


@app.route('/', methods=['POST', 'GET'])
def form():
    if request.method == 'GET':
        return render_template('form.html')
    else:
        with open("house_pipeline.pickle", "rb") as infile:
            house_pipeline = pickle.load(infile)

        LotArea = request.form['LotArea']
        if LotArea.isnumeric():
            LotArea = int(LotArea)
        else:
            LotArea = np.nan

        YearBuilt = request.form['YearBuilt']
        if YearBuilt.isnumeric():
            YearBuilt = int(YearBuilt)
        else:
            YearBuilt = np.nan

        FirstFlrSF = request.form['1stFlrSF']
        if FirstFlrSF.isnumeric():
            FirstFlrSF = int(FirstFlrSF)
        else:
            FirstFlrSF = np.nan

        street = request.form['street']


        df = pd.DataFrame(
            #{'LotArea': [LotArea], 'YearBuilt': [YearBuilt], '1stFlrSF': [FirstFlrSF], 'Street': [street]}
            {'Street': [street], 'LotArea': [LotArea], '1stFlrSF': [FirstFlrSF], 'YearBuilt': [YearBuilt]}
        )

        prediction = house_pipeline.predict(
            df
        )

        return render_template('result.html', result=round(prediction[0], 3))

if __name__ == '__main__':
    app.run(debug=True)