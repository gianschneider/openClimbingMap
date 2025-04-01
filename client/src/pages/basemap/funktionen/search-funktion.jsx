import React from "react";

function SearchComponent({ searchValue }) {
  console.log("aktueller Suchwert:", searchValue);
  return <div>Aktueller Suchwert: {searchValue}</div>;
}

export default SearchComponent;
