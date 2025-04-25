// src/App.jsx
import { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import BackgroundAnimation from './components/BackgroundAnimation';
import MovieCard from './components/MovieCard';
import SearchBar from './components/SearchBar';
import { findSimilarMovies } from './services/modelService';


const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-deployed-api-url.com' // Replace with your actual deployed API URL
  : 'http://localhost:5000';

function App() {
  const [movie, setMovie] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  
  // Check if model service is available
  useEffect(() => {
    const checkModelService = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/status`);
        if (response.ok) {
          setModelLoaded(true);
        }
      } catch (error) {
        console.error("Model service not available:", error);
        setTimeout(checkModelService, 3000); 
      }
    };
    
    checkModelService();
  }, []);
  
  const handleSearch = async () => {
    if (!movie.trim() || !modelLoaded) return;
    
    setIsLoading(true);
    setSearchActive(true);
    
    try {
      const results = await findSimilarMovies(movie);
      setRecommendations(results);
    } catch (error) {
      console.error("Error finding similar movies:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <BackgroundAnimation />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600">
            Movie Recommender
          </h1>
          <p className="text-gray-300 text-lg">
            Find movies similar to your favorites
          </p>
        </div>
        
        <SearchBar 
          movie={movie}
          setMovie={setMovie}
          handleSearch={handleSearch}
          isLoading={isLoading}
          modelLoaded={modelLoaded}
        />
        
        {/* Results section */}
        <div className={`transition-all duration-700 ${searchActive ? 'opacity-100' : 'opacity-0'}`}>
          {recommendations.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Recommended Movies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {recommendations.map((movie, index) => (
                  <MovieCard key={index} movie={movie} />
                ))}
              </div>
            </>
          )}
          
          {searchActive && recommendations.length === 0 && !isLoading && (
            <div className="text-center py-10">
              <Film size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No recommendations found. Try another movie title.</p>
            </div>
          )}
        </div>
      </div>
      
      <footer className="absolute bottom-0 w-full py-4 text-center text-gray-500 text-sm">
        <p>Built in San Franciso, CA with &#x2665;&#xfe0f;</p>
      </footer>
    </div>
  );
}

export default App;