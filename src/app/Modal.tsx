interface ModalProps {
  onClose: () => void;
  searchResult: MovieSearchResult;
}

const Modal = ({ searchResult, onClose }: ModalProps) => (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-4 rounded-lg w-3/4 h-3/4 text-black flex flex-col">
      <div>
        <h1 className="text-2xl">{searchResult.properties.title}</h1>
        <div>
          <span className="text-sm">
            Certainty:&nbsp;
            {searchResult.metadata.certainty
              ? searchResult.metadata.certainty.toPrecision(3)
              : "N/A"}
          </span>
        </div>
      </div>
      <div className="grow overflow-y-auto">
        <div className="flex">
          <img
            src={`/movie-images/${searchResult.properties.movie_id}.jpg`}
            alt={searchResult.properties.title}
            className="w-40 object-cover"
          />
          <div className="ml-5 text-left">
            <h1>Full plot:</h1>
            <p className="text-sm">
              {searchResult.properties.plot}
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

export default Modal;
