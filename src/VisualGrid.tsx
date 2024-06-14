import { useEffect, useState } from "react";

interface VisualGridProps {
  movies: MovieSearchResult[];
  loading: boolean;
  onSelect: (movie: MovieSearchResult) => void;
}

const EMOJIS_SEARCH = ["🔍", "🔎", "🕵️", "🕵️‍♂️", "🕵️‍♀️", "🔦"];
const EMOJI_SEARCH_CHANGE = 500;

const VisualGrid = ({ movies, loading, onSelect }: VisualGridProps) => {
  if (movies.length === 0 && !loading) {
    return <div>No movies found</div>;
  }

  const [emojiSearchIdx, setEmojiSearchIdx] = useState(1);
  useEffect(() => {
    const timer = setInterval(() => {
      setEmojiSearchIdx((emojiSearchIdx + 1) % EMOJIS_SEARCH.length);
    }, EMOJI_SEARCH_CHANGE);
    return () => clearInterval(timer);
  });

  return (
    <div className="relative">
      { !loading && (<div>Step 2: Select a movie from the {`${movies.length}`} movies found</div>) }
      { loading && (<div>Searching for movies...</div>)}
      <div className="grid lg:grid-cols-8 md:grid-cols-6 grid-cols-4">
        {movies.map((movie) => (
          <div
            key={movie.properties.movie_id}
            className="h-60 bg-cover bg-center relative"
            style={{
              backgroundImage: `url(/movie-images/${movie.properties.movie_id}.jpg)`,
            }}
            onClick={() => onSelect(movie)}
          >
            <h1 className="bg-black bg-opacity-50 text-white p-2">
              {movie.properties.title}
            </h1>
            {movie.metadata.certainty && (
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2">
                <p>{movie.metadata.certainty.toPrecision(3)}</p>
              </div>
            )}
            <div className="bg-black bg-opacity-20 absolute bottom-0 left-0 w-full h-full hover:bg-opacity-0 duration-300"/>
          </div>
        ))}
      </div>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center flex-row items-center bg-opacity-50 bg-sky-500">
          <h1 className="text-2xl">Loading {EMOJIS_SEARCH[emojiSearchIdx]}</h1>
        </div>
      )}
    </div>
  );
};

export default VisualGrid;
