// src/components/MovieCard.jsx
import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { fetchMoviePoster } from '../services/tmdbService';

const MovieCard = ({ movie }) => {
  const [posterUrl, setPosterUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadPoster = async () => {
      setLoading(true);
      try {
        const url = await fetchMoviePoster(movie.id);
        setPosterUrl(url);
      } catch (error) {
        console.error("Error loading poster:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPoster();
  }, [movie]);
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl">
      <div className="h-64 bg-gray-700 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="animate-spin text-indigo-500" />
          </div>
        ) : (
          <img 
            src={posterUrl || `/api/placeholder/300/450`} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate">{movie.title}</h3>
        <p className="text-indigo-300">{movie.year}</p>
      </div>
    </div>
  );
};

export default MovieCard;