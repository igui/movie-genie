import { useState } from "react";

interface SearchFilterProps {
  disabled?: boolean;
  onSearch: (search: string) => void;
}

function SearchFilter({ onSearch, disabled }: SearchFilterProps) {
  const [search, setSearch] = useState<string>("");

  const searchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const searchButtonClicked = () => {
    onSearch(search);
  };

  return (
    <div className="py-2">
      <span className="pr-4">Step 1: Select any theme</span>
      <input
        className="inline-block rounded-md border-0 pr-30 ring-1 ring-inset mr-5 py-2 px-2"
        type="text"
        placeholder="About a warrior in Rome..."
        readOnly={disabled}
        onChange={searchChanged}
      />
      <button
        className="rounded-md ring-2 ring-blue-500"
        onClick={searchButtonClicked}
        disabled={disabled}
      >
        Search
      </button>
    </div>
  );
}

export default SearchFilter;
