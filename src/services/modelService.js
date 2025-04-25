// src/services/tmdbService.js

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'http://10.0.0.6' // Your Raspberry Pi's IP address
  : 'http://localhost:5000';


// const API_KEY = '1f92844c436b3f6ea0f106be7f6fa358'; // You might still need this for direct TMDB calls in development

export const findSimilarMovies = async (movieTitle) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: movieTitle }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.recommendations;
  } catch (error) {
    console.error("Error finding similar movies:", error);
    throw error;
  }
};




