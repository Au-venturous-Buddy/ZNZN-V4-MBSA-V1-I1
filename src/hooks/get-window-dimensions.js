import { useState, useEffect } from 'react';

// Check if window is defined (so if in the browser or in node.js).
const isBrowser = typeof window !== "undefined"

function GetWindowDimensions() {
  if(isBrowser) {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }
  
  else {
    const width = 1200;
    const height = 800;
    return {
      width,
      height
    };
  }
}

export default function UseWindowDimensions() {
  if(isBrowser) {
    const [windowDimensions, setWindowDimensions] = useState(GetWindowDimensions());

    useEffect(() => {
      function handleResize() {
        setWindowDimensions(GetWindowDimensions());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
  }

  else {
    const width = 1200;
    const height = 800;
    return {
      width,
      height
    };
  }
}
