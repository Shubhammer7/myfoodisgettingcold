from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
import os
import requests
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": [
    "http://localhost:3000",
    "https://*.vercel.app"
]}})



MODEL_PATH = os.path.join(os.path.dirname(__file__), 'movie_recommender.pkl')
MOVIES_DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'tmdb_5000_movies.csv')
TMDB_API_KEY = os.getenv("TMDB_API")

model = None
scaler = None
movies_df = None

def load_model():
    global model, scaler, movies_df
    try:
        with open(MODEL_PATH, 'rb') as f:
            model_data = pickle.load(f)
        
        model = model_data['model']
        scaler = model_data['scaler']
        movies_df_raw = pd.read_csv(MOVIES_DATA_PATH)
        movies_df = movies_df_raw.iloc[model_data['df_index']].reset_index(drop=True)
        
        print("Model and data loaded successfully")
        return True
    except Exception as e:
        print(f"Error loading model or data: {e}")
        return False

@app.route('/status', methods=['GET'])
def status():
    if model is not None and movies_df is not None:
        return jsonify({"status": "ready"})
    else:
        return jsonify({"status": "loading"}), 503

@app.route('/recommend', methods=['POST'])
def recommend():
    global model, movies_df
    
    if model is None or movies_df is None:
        if not load_model():
            return jsonify({"error": "Model or data not available"}), 503
    
    data = request.json
    movie_title = data.get('title', '')
    
    try:
        movie_row = movies_df[movies_df['title'].str.lower() == movie_title.lower()]
        if movie_row.empty:
            return jsonify({"error": "Movie not found"}), 404
        
        movie_idx = movie_row.index[0]
        distances, indices = model.kneighbors(n_neighbors=11)
        similar_indices = indices[movie_idx][1:]
        similar_movies = movies_df.iloc[similar_indices]
        
        recommendations = [
            {"id": int(row['id']), "title": row['title'], "year": int(row['release_date'][:4])}
            for _, row in similar_movies.iterrows()
        ]
        
        return jsonify({"recommendations": recommendations})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# New endpoint to handle poster requests
@app.route('/api/proxy/poster/<int:movie_id>', methods=['GET'])
def get_movie_poster(movie_id):
    try:
        # Call TMDB API to get movie details
        response = requests.get(
            f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}"
        )
        
        if not response.ok:
            return jsonify({"error": f"TMDB API error: {response.status_code}"}), response.status_code
        
        data = response.json()
        if data.get('poster_path'):
            poster_url = f"https://image.tmdb.org/t/p/w500{data['poster_path']}"
            return jsonify({"poster_url": poster_url})
        else:
            return jsonify({"poster_url": None})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Backend is running ✅"}), 200

load_model()

if __name__ == '__main__':
    load_model()
    app.run(debug=True, host='0.0.0.0', port=5000)
