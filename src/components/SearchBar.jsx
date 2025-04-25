// src/components/SearchBar.jsx
import { Search, Loader } from 'lucide-react';

const SearchBar = ({ movie, setMovie, handleSearch, isLoading, modelLoaded }) => {
  return (
    <div className="max-w-xl mx-auto mb-12">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Enter a movie title..."
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
            className="w-full p-4 pl-12 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search className="absolute left-4 top-4 text-gray-500" />
        </div>
        <button
          onClick={handleSearch}
          disabled={!modelLoaded || isLoading}
          className={`px-6 rounded-lg font-medium flex items-center justify-center
            ${!modelLoaded || isLoading 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
        >
          {isLoading ? <Loader className="animate-spin" /> : 'Search'}
        </button>
      </div>
      
      {!modelLoaded && (
        <div className="mt-4 flex items-center justify-center text-indigo-400">
          <Loader className="animate-spin mr-2" size={16} />
          <span>Loading recommendation model...</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;