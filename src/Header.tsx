import weaviateLogo from "./assets/weaviate.webp";

const Header = () => (
  <header className="pt-5 flex justify-center items-end" >
    <h1 className="text-4xl w-full sm:w-auto">Movie 🎥 Search 🔍</h1>
    <h3 className="text-sm sm:ml-4">
      <span>Powered by </span>
      <img
        className="inline"
        width={32}
        src={weaviateLogo}
        alt={weaviateLogo}
      ></img>
      <span> Weaviate</span>
    </h3>
  </header>
);

export default Header;
