
import { useState, useEffect } from "react";
import { Search, Film, Star, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import MovieCard from "@/components/MovieCard";
import RecommendationEngine from "@/components/RecommendationEngine";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";

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

interface Genre {
  id: number;
  name: string;
}

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const TMDB_API_KEY = "8265bd1679663a7ea12ac168da84d2e8"; // Public demo key
  const TMDB_BASE_URL = "https://api.themoviedb.org/3";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  // Sample movie data for demonstration including Bollywood movies
  const sampleMovies: Movie[] = [
    {
      id: 1,
      title: "The Matrix",
      overview: "A computer programmer discovers reality isn't what it seems.",
      poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
      release_date: "1999-03-30",
      vote_average: 8.7,
      genre_ids: [28, 878],
      genres: [{ id: 28, name: "Action" }, { id: 878, name: "Science Fiction" }],
      runtime: 136
    },
    {
      id: 2,
      title: "Inception",
      overview: "A thief enters people's dreams to steal secrets from their subconscious.",
      poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      backdrop_path: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
      release_date: "2010-07-15",
      vote_average: 8.8,
      genre_ids: [28, 878, 53],
      genres: [{ id: 28, name: "Action" }, { id: 878, name: "Science Fiction" }, { id: 53, name: "Thriller" }],
      runtime: 148
    },
    {
      id: 3,
      title: "Interstellar",
      overview: "A team of explorers travel through a wormhole in space.",
      poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      backdrop_path: "/pbrkL804c8yAv3zBZR4QPWZyyAs.jpg",
      release_date: "2014-11-05",
      vote_average: 8.6,
      genre_ids: [18, 878],
      genres: [{ id: 18, name: "Drama" }, { id: 878, name: "Science Fiction" }],
      runtime: 169
    },
    {
      id: 4,
      title: "Blade Runner 2049",
      overview: "A young blade runner discovers a secret that could plunge society into chaos.",
      poster_path: "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
      backdrop_path: "/ilKBGlhTUUmI5OvQiJGX0tYF8f1.jpg",
      release_date: "2017-10-04",
      vote_average: 8.0,
      genre_ids: [878, 18],
      genres: [{ id: 878, name: "Science Fiction" }, { id: 18, name: "Drama" }],
      runtime: 164
    },
    {
      id: 5,
      title: "The Dark Knight",
      overview: "Batman faces the Joker in this acclaimed superhero thriller.",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop_path: "/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
      release_date: "2008-07-18",
      vote_average: 9.0,
      genre_ids: [28, 80, 18],
      genres: [{ id: 28, name: "Action" }, { id: 80, name: "Crime" }, { id: 18, name: "Drama" }],
      runtime: 152
    },
    {
      id: 6,
      title: "Pulp Fiction",
      overview: "The lives of two mob hitmen, a boxer, and others intertwine in four tales of violence.",
      poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      backdrop_path: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
      release_date: "1994-10-14",
      vote_average: 8.9,
      genre_ids: [80, 18],
      genres: [{ id: 80, name: "Crime" }, { id: 18, name: "Drama" }],
      runtime: 154
    },
    {
      id: 7,
      title: "3 Idiots",
      overview: "Two friends search for their long-lost companion while remembering their college days.",
      poster_path: "/66A9MqXOyVFCssoloscw4Lao4Dh.jpg",
      backdrop_path: "/mMtUybQ6hL24FXo0F3Z4j2KG7kZ.jpg",
      release_date: "2009-12-25",
      vote_average: 8.4,
      genre_ids: [35, 18],
      genres: [{ id: 35, name: "Comedy" }, { id: 18, name: "Drama" }],
      runtime: 170
    },
    {
      id: 8,
      title: "Dangal",
      overview: "Former wrestler Mahavir Singh Phogat trains his daughters to become world-class wrestlers.",
      poster_path: "/lInS8LPx0qfxlyTpHqyq6sJQp3v.jpg",
      backdrop_path: "/ovY4akNigq7J8J0q1eFJwrWe01E.jpg",
      release_date: "2016-12-23",
      vote_average: 8.3,
      genre_ids: [18, 10751],
      genres: [{ id: 18, name: "Drama" }, { id: 10751, name: "Family" }],
      runtime: 161
    },
    {
      id: 9,
      title: "Zindagi Na Milegi Dobara",
      overview: "Three friends on a bachelor trip across Spain discover themselves and their relationships.",
      poster_path: "/fC7Gk7ynxgJnwMdLJnXVKhDHH8k.jpg",
      backdrop_path: "/8Z8dptJEypuLoOQro1WugD855YE.jpg",
      release_date: "2011-07-15",
      vote_average: 8.1,
      genre_ids: [18, 35, 12],
      genres: [{ id: 18, name: "Drama" }, { id: 35, name: "Comedy" }, { id: 12, name: "Adventure" }],
      runtime: 155
    },
    {
      id: 10,
      title: "Lagaan",
      overview: "Villagers accept a challenge from British officers to play cricket and avoid paying taxes.",
      poster_path: "/7JjZOrsYv5iDHAy5LCk3k4ixRMO.jpg",
      backdrop_path: "/w5S9ZOGhwOZjQ56P6N8QfzWfA2g.jpg",
      release_date: "2001-06-15",
      vote_average: 8.1,
      genre_ids: [18, 36, 10752],
      genres: [{ id: 18, name: "Drama" }, { id: 36, name: "History" }, { id: 10752, name: "War" }],
      runtime: 224
    },
    {
      id: 11,
      title: "Queen",
      overview: "A young woman goes on her honeymoon alone and discovers herself in the process.",
      poster_path: "/p5ozvmdgsmbWe0H8Xk7Rc8SCwAB.jpg",
      backdrop_path: "/iNh3BivHyg5sQRPP1KOkzguEX0H.jpg",
      release_date: "2013-03-07",
      vote_average: 8.2,
      genre_ids: [35, 18],
      genres: [{ id: 35, name: "Comedy" }, { id: 18, name: "Drama" }],
      runtime: 146
    },
    {
      id: 12,
      title: "Sholay",
      overview: "Two criminals are hired by a retired police officer to capture a ruthless dacoit.",
      poster_path: "/pW6v9dUQOYYwkllKKE7PGhMGfVU.jpg",
      backdrop_path: "/l4vxQU7V4Dw9XN1iGzQfYnfK7Kl.jpg",
      release_date: "1975-08-15",
      vote_average: 8.6,
      genre_ids: [28, 18, 37],
      genres: [{ id: 28, name: "Action" }, { id: 18, name: "Drama" }, { id: 37, name: "Western" }],
      runtime: 204
    }
  ];

  // Sample genre data for demonstration
  const sampleGenres: Genre[] = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" }
  ];

  useEffect(() => {
    // Initialize with sample data
    setMovies(sampleMovies);
    setGenres(sampleGenres);
    setFeaturedMovie(sampleMovies[0]);
    setLoading(false);
    
    // Generate initial recommendations
    generateRecommendations([]);
  }, []);

  const generateRecommendations = (userPreferences: number[]) => {
    // Content-based filtering algorithm
    if (userPreferences.length === 0) {
      // If no preferences, show popular movies
      const popularMovies = [...sampleMovies]
        .sort((a, b) => b.vote_average - a.vote_average)
        .slice(0, 6);
      setRecommendations(popularMovies);
      return;
    }

    // Calculate similarity scores based on genres
    const scoredMovies = sampleMovies.map(movie => {
      const commonGenres = movie.genre_ids.filter(genreId => 
        userPreferences.includes(genreId)
      );
      const score = commonGenres.length / userPreferences.length;
      return { ...movie, score };
    });

    // Sort by score and rating
    const recommended = scoredMovies
      .filter(movie => movie.score > 0)
      .sort((a, b) => (b.score * 0.7 + b.vote_average * 0.3) - (a.score * 0.7 + a.vote_average * 0.3))
      .slice(0, 6);

    setRecommendations(recommended);
  };

  const handleGenreSelect = (genreId: number) => {
    const updatedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
    
    setSelectedGenres(updatedGenres);
    generateRecommendations(updatedGenres);
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedGenres.length === 0 || 
     movie.genre_ids.some(genreId => selectedGenres.includes(genreId)))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      {featuredMovie && (
        <div className="relative h-[70vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${IMAGE_BASE_URL}${featuredMovie.backdrop_path})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          </div>
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  CinemaAI
                </h1>
                <p className="text-xl text-gray-300 mb-6">
                  Discover your next favorite movie with our intelligent recommendation system
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {featuredMovie.genres?.map(genre => (
                    <Badge key={genre.id} variant="secondary" className="bg-purple-600/30 text-purple-200">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg">
                  <Film className="mr-2 h-5 w-5" />
                  Start Exploring
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-black/20 dark:bg-black/40 backdrop-blur-sm rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for movies..."
                className="pl-10 bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 text-white placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Genre Filters */}
          <div className="mb-4">
            <h3 className="text-white text-lg font-semibold mb-3">Select Your Favorite Genres</h3>
            <div className="flex flex-wrap gap-2">
              {genres.map(genre => (
                <Button
                  key={genre.id}
                  variant={selectedGenres.includes(genre.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleGenreSelect(genre.id)}
                  className={`${
                    selectedGenres.includes(genre.id)
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      : "bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 text-white hover:bg-white/20 dark:hover:bg-white/10"
                  }`}
                >
                  {genre.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <Star className="mr-3 h-8 w-8 text-yellow-400" />
              Recommended For You
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {recommendations.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {/* All Movies Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <Film className="mr-3 h-8 w-8 text-purple-400" />
            {searchQuery || selectedGenres.length > 0 ? "Search Results" : "Popular Movies"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
