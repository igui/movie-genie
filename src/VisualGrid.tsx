import { useEffect, useState } from "react";

interface VisualGridProps {
  movies: MovieSearchResult[];
  loading: boolean;
}

const EMOJIS_SEARCH = ["🔍", "🔎", "🕵️", "🕵️‍♂️", "🕵️‍♀️", "🔦"];
const EMOJI_SEARCH_CHANGE = 500;

const VisualGrid = ({ movies, loading }: VisualGridProps) => {
  if (!movies) {
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
      <div>{`${movies.length}`} movies found</div>
      <div className="grid grid-cols-4">
        {movies.map((movie) => (
          <div
            key={movie.properties.movie_id}
            className="h-40 bg-cover bg-center"
            style={{
              backgroundImage: `url(/movie-images/${movie.properties.movie_id}.jpg)`,
            }}
          >
          </div>
        ))}
      </div>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center flex-row items-center bg-sky-500/[.9]">
          <h1>Loading {EMOJIS_SEARCH[emojiSearchIdx]}</h1>
        </div>
      )}
    </div>
  );
};

export default VisualGrid;
