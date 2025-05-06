import { NavLink } from "react-router";

function NavButton({ path, children }) {
  return (
    <NavLink
      to={path}
      style={({ isActive }) => ({
        margin: "0.5em 1em",
        color: isActive ? "dodgerblue" : "black",
      })}
    >
      {children}
    </NavLink>
  );
}

function Header() {
  return (
    <header>
      <h1>openClimbingMap</h1>
      <nav>
        <NavButton path="basemap">
          <img src="./sportclimbing-pictogramm.png" className="logo" alt="BaseMap logo" />
          BaseMap
        </NavButton>
      </nav>
    </header>
  );
}

export default Header;
