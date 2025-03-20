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
          <img src="./sportclimbing-pictogramm2.png" className="logo" alt="OpenLayers logo" />
          BaseMap
        </NavButton>

        <NavButton path="openlayers">Open Layers</NavButton>
        <NavButton path="maplibre">MapLibre (Reactive)</NavButton>
        <NavButton path="spatialanalysis">Spatial Analysis</NavButton>
        <NavButton path="geotiff">Cloud-optimized GeoTIFF</NavButton>
      </h2>
    </>
  );
}
export default Header;
