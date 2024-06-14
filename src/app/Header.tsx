import weaviateLogo from "./weaviate.webp";
import Image from "next/image";

const Header = () => (
  <header className="pt-5 flex justify-center items-end">
    <h1 className="text-4xl w-full sm:w-auto">Movie 🎥 Search 🔍</h1>
    <h3 className="text-sm sm:ml-4">
      <span>Powered by </span>
      <Image
        className="inline"
        width={32}
        src={weaviateLogo}
        alt="logo"
      />
      <span> Weaviate</span>
    </h3>
  </header>
);

export default Header;
