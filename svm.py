import numpy as np
from sklearn.svm import LinearSVR

RANDOM_STATE = 42

def svr_predict(X_train, X_test, y_train, y_test):
    #TODO: this is crude as heck
    svr = LinearSVR(random_state=RANDOM_STATE)
    svr.fit(X_train, y_train)
    prediction = svr.predict(X_test)   
    return prediction

X_train = np.arange(1, 20)