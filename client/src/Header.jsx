import { NavLink } from "react-router";

function NavButton({ path, children }) {
  return (
    <NavLink
      to={path}
      style={({ isActive }) => ({
        display: "inline-block",
        margin: ".5em 1em",
        color: isActive ? "dodgerblue" : "black",
      })}
    >
      {children}
    </NavLink>
  );
}

function Header() {
  return (
    <>
      <h1>openClimbingMap</h1>
      <h2>
        <NavButton path="basemap">
          <img src="./sportclimbing-pictogramm.png" className="logo" alt="OpenLayers logo" />
          BaseMap
        </NavButton>
      </h2>
    </>
  );
}
export default Header;
