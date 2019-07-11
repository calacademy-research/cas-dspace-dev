import React from 'react'

/*
Simple Header, could be more interesting or even removed.
 */

const headerStyle = {
  padding: "10px 20px",
  color: "#E2C089",
  textAlign: "center",
  fontSize: "16px",
  fontFamily: "Avenir",
}



function Header() {
  return(
    <div style={headerStyle}>
        <h1>File Viewer</h1>
    </div>
      );
}

export { Header };
