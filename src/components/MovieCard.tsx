
import { useState } from "react";
import { Star, Calendar, Clock, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
  const placeholderImage = "https://images.unsplash.com/photo-1489599904472-85c29eb5e2ca?w=500&h=750&fit=crop";

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-400";
    if (rating >= 7) return "text-yellow-400";
    if (rating >= 6) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <Dialog>
      <Card className="group relative overflow-hidden bg-black/40 border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
        <CardContent className="p-0">
          <div className="relative aspect-[2/3] overflow-hidden">
            <img
              src={imageError ? placeholderImage : `${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
            />
            
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4">
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Info className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </DialogTrigger>
              </div>
            </div>

            {/* Rating Badge */}
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
              <Star className="h-3 w-3 text-yellow-400 mr-1" />
              <span className={`text-xs font-bold ${getRatingColor(movie.vote_average)}`}>
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="p-3">
            <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2 group-hover:text-purple-300 transition-colors">
              {movie.title}
            </h3>
            
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(movie.release_date)}
              </div>
              {movie.runtime && (
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {movie.runtime}m
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movie Details Dialog */}
      <DialogContent className="max-w-4xl bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">{movie.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <img
              src={imageError ? placeholderImage : `${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-lg"
              onError={() => setImageError(true)}
            />
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 mr-2" />
                <span className={`text-lg font-bold ${getRatingColor(movie.vote_average)}`}>
                  {movie.vote_average.toFixed(1)}/10
                </span>
              </div>
              
              <div className="flex items-center text-gray-400">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(movie.release_date)}
              </div>
              
              {movie.runtime && (
                <div className="flex items-center text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  {movie.runtime} minutes
                </div>
              )}
            </div>

            {movie.genres && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map(genre => (
                  <Badge key={genre.id} variant="secondary" className="bg-purple-600/30 text-purple-200">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}

            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Overview</h4>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieCard;
