import React from "react";

export default function Mint(props) {
  return (
    <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <h2>Mint:</h2>
      <button
        onClick={() => {
          props.readContracts.YourContract.mintnft();
        }}
      >
        Mint
      </button>
    </div>
  );
}
