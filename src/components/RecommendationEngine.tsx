
import { useState, useEffect } from "react";
import { Brain, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
}

interface RecommendationEngineProps {
  movies: Movie[];
  userPreferences: number[];
  onRecommendationsUpdate: (recommendations: Movie[]) => void;
}

const RecommendationEngine = ({ 
  movies, 
  userPreferences, 
  onRecommendationsUpdate 
}: RecommendationEngineProps) => {
  const [algorithm, setAlgorithm] = useState<'content' | 'collaborative' | 'hybrid'>('content');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Content-based filtering
  const generateContentBasedRecommendations = (preferences: number[]): Movie[] => {
    if (preferences.length === 0) {
      return movies.sort((a, b) => b.vote_average - a.vote_average).slice(0, 6);
    }

    const scoredMovies = movies.map(movie => {
      // Calculate genre similarity
      const commonGenres = movie.genre_ids.filter(genreId => 
        preferences.includes(genreId)
      );
      const genreScore = commonGenres.length / Math.max(preferences.length, 1);
      
      // Boost score for higher rated movies
      const ratingBoost = (movie.vote_average - 5) / 5; // Normalize rating 0-1
      
      const totalScore = (genreScore * 0.7) + (ratingBoost * 0.3);
      
      return { ...movie, score: totalScore };
    });

    return scoredMovies
      .filter(movie => movie.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  };

  // Collaborative filtering simulation
  const generateCollaborativeRecommendations = (preferences: number[]): Movie[] => {
    // Simulate user similarity based on genre preferences
    const userProfiles = [
      { userId: 1, likedGenres: [28, 878, 53], ratings: { 1: 9, 2: 8, 3: 7 } }, // Action/Sci-Fi fan
      { userId: 2, likedGenres: [18, 80, 9648], ratings: { 5: 9, 6: 8, 1: 6 } }, // Drama/Crime fan
      { userId: 3, likedGenres: [878, 14, 12], ratings: { 2: 9, 3: 8, 4: 7 } }, // Sci-Fi/Fantasy fan
    ];

    if (preferences.length === 0) {
      return movies.sort((a, b) => b.vote_average - a.vote_average).slice(0, 6);
    }

    // Find similar users
    const similarUsers = userProfiles.filter(user => 
      user.likedGenres.some(genre => preferences.includes(genre))
    );

    // Get movies highly rated by similar users
    const recommendedMovieIds = new Set<number>();
    similarUsers.forEach(user => {
      Object.entries(user.ratings).forEach(([movieId, rating]) => {
        if (rating >= 7) {
          recommendedMovieIds.add(parseInt(movieId));
        }
      });
    });

    const recommended = movies.filter(movie => 
      recommendedMovieIds.has(movie.id)
    );

    return recommended.slice(0, 6);
  };

  // Hybrid approach
  const generateHybridRecommendations = (preferences: number[]): Movie[] => {
    const contentRecs = generateContentBasedRecommendations(preferences);
    const collaborativeRecs = generateCollaborativeRecommendations(preferences);
    
    // Combine and deduplicate
    const combined = [...contentRecs];
    collaborativeRecs.forEach(movie => {
      if (!combined.find(m => m.id === movie.id)) {
        combined.push(movie);
      }
    });

    return combined.slice(0, 6);
  };

  const generateRecommendations = async () => {
    setIsAnalyzing(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let recommendations: Movie[] = [];
    
    switch (algorithm) {
      case 'content':
        recommendations = generateContentBasedRecommendations(userPreferences);
        break;
      case 'collaborative':
        recommendations = generateCollaborativeRecommendations(userPreferences);
        break;
      case 'hybrid':
        recommendations = generateHybridRecommendations(userPreferences);
        break;
    }
    
    onRecommendationsUpdate(recommendations);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    generateRecommendations();
  }, [userPreferences, algorithm]);

  const algorithmDescriptions = {
    content: "Recommends movies similar to your genre preferences",
    collaborative: "Suggests movies liked by users with similar tastes",
    hybrid: "Combines both approaches for better accuracy"
  };

  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Brain className="mr-2 h-5 w-5 text-purple-400" />
          Recommendation Engine
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-white text-sm font-medium mb-3">Algorithm Type</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={algorithm === 'content' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAlgorithm('content')}
              className={algorithm === 'content' 
                ? "bg-purple-600 hover:bg-purple-700" 
                : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }
            >
              <Sparkles className="mr-1 h-3 w-3" />
              Content-Based
            </Button>
            
            <Button
              variant={algorithm === 'collaborative' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAlgorithm('collaborative')}
              className={algorithm === 'collaborative' 
                ? "bg-purple-600 hover:bg-purple-700" 
                : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }
            >
              <TrendingUp className="mr-1 h-3 w-3" />
              Collaborative
            </Button>
            
            <Button
              variant={algorithm === 'hybrid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAlgorithm('hybrid')}
              className={algorithm === 'hybrid' 
                ? "bg-purple-600 hover:bg-purple-700" 
                : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }
            >
              <Brain className="mr-1 h-3 w-3" />
              Hybrid
            </Button>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-gray-300 text-sm">
            {algorithmDescriptions[algorithm]}
          </p>
        </div>

        {isAnalyzing && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-400 border-t-transparent mr-2"></div>
            <span className="text-white text-sm">Analyzing preferences...</span>
          </div>
        )}

        {userPreferences.length > 0 && (
          <div>
            <h4 className="text-white text-sm font-medium mb-2">Your Preferences</h4>
            <div className="flex flex-wrap gap-1">
              {userPreferences.map(genreId => {
                const genreNames: { [key: number]: string } = {
                  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
                  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
                  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
                  9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
                  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
                };
                return (
                  <Badge key={genreId} variant="secondary" className="bg-purple-600/30 text-purple-200 text-xs">
                    {genreNames[genreId] || 'Unknown'}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationEngine;
