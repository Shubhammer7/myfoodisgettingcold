// src/services/tmdbService.js
const API_BASE_URL = "https://myfoodisgettingcold.onrender.com";

export const fetchMoviePoster = async (movieId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/poster/${movieId}`
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
