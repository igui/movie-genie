interface ModalProps {
  onClose: () => void;
  searchResult: MovieSearchResult;
}

interface HighlightProps {
  text: string;
  highlight?: string;
}

const Highlight = ({ text, highlight }: HighlightProps) => {
  if (!highlight) {
    return <span>{text}</span>;
  }
  const idx = text.indexOf(highlight);
  if (idx === -1) {
    return <span>{text}</span>;
  }

  const before = text.slice(0, idx);
  const after = text.slice(idx + highlight.length);
  const highlightText = text.slice(idx, idx + highlight.length);

  return (
    <span>
      {before}
      <span className="bg-yellow-200">{highlightText}</span>
      {after}
    </span>
  );
};

const Modal = ({ searchResult, onClose }: ModalProps) => {
  const showHighlight = searchResult.metadata.score && searchResult.plot.includes(searchResult.chunk);
  const score = searchResult.metadata.score
    ? searchResult.metadata.score.toPrecision(3)
    : "N/A";
  const movieImageUrl = `/movie-images/${searchResult.movie_id}.jpg`;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-4 rounded-lg w-3/4 h-3/4 text-black flex flex-col">
        <div>
          <h1 className="text-2xl">{searchResult.title}</h1>
          <div>
            <span className="text-sm">Score: {score}</span>
          </div>
        </div>
        <div className="grow overflow-y-auto">
          <div className="flex">
            <img
              src={movieImageUrl}
              alt={searchResult.title}
              className="w-40 object-cover"
            />
            <div className="ml-5 text-left">
              <h1>Full plot:</h1>
              {showHighlight && (
                <p className="text-sm">
                  <em>Note:</em> Relevant chunk is highlighted in yellow
                </p>
              )}
              <p className="text-sm">
                <Highlight
                  text={searchResult.plot}
                  highlight={showHighlight ? searchResult.chunk : undefined}
                />
              </p>
            </div>
          </div>
        </div>
        <div className="pt-3 grid justify-items-center">
          <button className="rounded-md ring-2 p-2" onClick={onClose}>
            Close ❌
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
