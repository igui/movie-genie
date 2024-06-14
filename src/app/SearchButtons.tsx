interface SearchButtonProps {
    className?: string;
    disabled?: boolean;
    onClick: () => void;
    onClear: () => void;
}


const SearchButtons = ({ className, onClear, onClick, disabled }: SearchButtonProps) => (
    <div className={className}>
        <button
          className="rounded-md ring-2 py-1.5 px-4 mr-5"
          onClick={onClear}
        >
          ❌
        </button>
        <button
          className="rounded-md grow ring-2 ring-blue-500 py-1.5 px-4 bg-sky-300 text-black hover:bg-gray-400 transition-colors duration-300"
          onClick={onClick}
          disabled={disabled}
        >
          Search 🕵️‍♂️
        </button>
    </div>
)

export default SearchButtons;