import React from "react";

export default function SearchBox({ value, onChange, placeholder }) {
  return (
    <input
      id="searchBox"
      className="form-control"
      type="search"
      name="query"
      placeholder={placeholder}
      aria-label="Search"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
}
