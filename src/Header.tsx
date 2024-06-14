import weaviateLogo from "./assets/weaviate.webp";

const Header = () => (
  <header>
    <h1>Movie 🎥 Search 🔍</h1>
    <h3>
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
