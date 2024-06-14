import { useRef, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import SearchButtons from "./SearchButtons";

interface SearchFilterProps {
  disabled?: boolean;
  onSearch: (search: string, alpha: number) => void;
}

function SearchFilter({ onSearch, disabled }: SearchFilterProps) {
  const MAX_VALUE = 100; // Weaviate accepts alpha values between 0 and 1 and we store them in the state as 0-100
  const [search, setSearch] = useState<string>("");
  const [alpha, setAlpha] = useState<number>(MAX_VALUE / 2);

  const searchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const searchButtonClicked = () => {
    onSearch(search, alpha / MAX_VALUE);
  };

  const clearSearch = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const alphaChanged = (value: number | number[]) => {
    if (typeof value !== "number") {
      console.error("Invalid value for alpha", value);
      return;
    }
    setAlpha(value);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="py-2 flex px-10 items-center flex-wrap">
      <p className="pr-4 pb-2 md:pb-0 w-full md:w-auto">
        <div className="inline-block mr-1 md:w-full">Step 1:</div>
        <div className="inline-block text-sm">Select any theme</div>
      </p>
      <div className="w-full md:w-auto grow mr-0 md:mr-5">
        <div className="w-full flex">
          <input
            ref={inputRef}
            className="grow rounded-md border-0 ring-1 ring-inset text-sm p-2"
            type="text"
            placeholder="About a warrior in Rome..."
            readOnly={disabled}
            onChange={searchChanged}
          />
          <SearchButtons
            className="hidden md:block ml-5"
            onClear={clearSearch}
            onClick={searchButtonClicked}
            disabled={disabled}
          />
        </div>
        <div className="w-full grow flex items-center mt-5">
          <div className="text-sm min-w-30">Keyword 🔤</div>
          <div className="grow">
            <Slider
              min={0}
              max={MAX_VALUE}
              onChange={alphaChanged}
              value={alpha}
            />
          </div>
          <div className="text-sm w-half">Vector 🔢</div>
          <div className="w-20 text-sm">Alpha: {alpha / MAX_VALUE}</div>
        </div>
      </div>

      <SearchButtons
        className="mt-5 md:mt-0 flex grow md:grow-0 block md:hidden"
        onClear={clearSearch}
        onClick={searchButtonClicked}
        disabled={disabled}
      />
    </div>
  );
}

export default SearchFilter;
