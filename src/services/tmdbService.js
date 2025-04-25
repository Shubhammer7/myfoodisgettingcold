// src/services/tmdbService.js
const API_KEY = '1f92844c436b3f6ea0f106be7f6fa358'; 

export const fetchMoviePoster = async (movieId) => {
  try {
    const response = await fetch(
      `http://10.0.0.6/api/poster/${movieId}` // Your Raspberry Pi's IP
    );

    if (!response.ok) {
      throw new Error(`Error fetching poster from server: ${response.status}`);
    }

    const data = await response.json();
    return data.poster_url || null;
  } catch (error) {
    console.error("Error fetching movie poster from server:", error);
    return null;
  }
};

