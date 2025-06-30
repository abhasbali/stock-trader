# 📈 AI-Powered Stock Trader

![Stock](https://img.shields.io/badge/Stock-Trading-blueviolet?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![AlphaVantage](https://img.shields.io/badge/API-AlphaVantage-blue?style=for-the-badge)
![Chart.js](https://img.shields.io/badge/Chart.js-F5788D?style=for-the-badge)

## 🚀 Overview

This AI-powered stock trading simulator predicts stock prices using a trained LSTM model, fetches live stock market data using the Alpha Vantage API, and allows users to simulate buying and selling with virtual currency. It includes confidence scores, trend analysis, and interactive visualizations.

## 🌟 Features

- 📊 Predict stock prices using a trained LSTM model
- 🔄 Real-time stock data from Alpha Vantage
- 🔐 Virtual trading system to simulate buy/sell
- 🔍 Confidence score and trend analysis
- 📈 Beautiful charts and graphs
- 🧠 Model fallback prediction and smart error handling

## 🧰 Tech Stack

### Frontend
- ⚛️ React.js
- 💨 Tailwind CSS
- ⏭️ Next.js
- 📈 Chart.js

### Backend
- 🐍 Flask (Python)
- 🤖 TensorFlow
- 🧠 scikit-learn & joblib
- 🌐 Alpha Vantage API

### Others
- 🌍 CORS + REST API
- 🔒 dotenv for environment variables
- 🚀 Node.js for managing other utilities

## 🔧 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/stock-trader
cd stock-trader
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Add Your API Keys
Create a `.env` file in the root directory and add:
```env
ALPHA_VANTAGE_API_KEY=your_api_key_here
```

### 4️⃣ Start the Development Server
```bash
npm run dev
```

## 🚀 Deployment

You can deploy the frontend on **Vercel** and backend on **Render**, **Railway**, or **Heroku**. Ensure your `.env` values are set correctly for production.

## 🛡 Future Improvements
- User accounts & login
- Portfolio performance tracking
- Sentiment analysis from stock news
- Graph comparison across multiple stocks
- Deployed on cloud for real-time access

---

Made with ❤️ by Team Stock-Trader
