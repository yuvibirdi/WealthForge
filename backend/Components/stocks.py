import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier

def predict_stock_direction(ticker_symbol, prediction_days=5, start_date='2000-01-01'):
    try:
        ticker = yf.Ticker(ticker_symbol)
        data = ticker.history(start=start_date)
        
        if len(data) < 500:
            raise ValueError(f"Insufficient data for {ticker_symbol}")
        
        data['PriceChange'] = data['Close'].pct_change(prediction_days)
        data['Target'] = (data['PriceChange'] > 0).astype(int)
        
        features = ['Open', 'High', 'Low', 'Close', 'Volume']
        for feature in features:
            for lag in range(1, prediction_days + 1):
                data[f'{feature}_Lag_{lag}'] = data[feature].shift(lag)
        
        data.dropna(inplace=True)
        
        feature_columns = [
            col for col in data.columns 
            if any(f in col for f in ['Open', 'High', 'Low', 'Close', 'Volume']) 
            and 'Lag' in col
        ]
        
        X = data[feature_columns]
        y = data['Target']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        clf = RandomForestClassifier(n_estimators=100, random_state=42)
        clf.fit(X_train_scaled, y_train)
        
        train_accuracy = clf.score(X_train_scaled, y_train)
        test_accuracy = clf.score(X_test_scaled, y_test)
        
        latest_features = X.iloc[-1].values.reshape(1, -1)
        latest_features_scaled = scaler.transform(latest_features)
        prediction = clf.predict(latest_features_scaled)
        prediction_proba = clf.predict_proba(latest_features_scaled)
        
        return {
            'prediction': 'Up' if prediction[0] == 1 else 'Down',
            'probability': prediction_proba[0][prediction[0]],
            'train_accuracy': train_accuracy,
            'test_accuracy': test_accuracy
        }
    
    except Exception as e:
        print(f"Error predicting stock direction: {e}")
        return None

# Example usage
if __name__ == "__main__":
    ticker = "SLF"
    days = 5
    result = predict_stock_direction(ticker, days)
    if result:
        print(f"Prediction for {ticker} in {days} days:")
        print(f"Direction: {result['prediction']}")
        print(f"Probability: {result['probability']:.2%}")
        print(f"Train Accuracy: {result['train_accuracy']:.2%}")
        print(f"Test Accuracy: {result['test_accuracy']:.2%}")