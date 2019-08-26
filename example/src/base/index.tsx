import React, { useState, useEffect } from 'react';
import { routes } from './routes';

const App = () => {
  const [pending, setPending] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPending(false);
    }, 1000);
  }, []);

  return (
    <>
      {
        pending
          ? 'LOADING ... ...'
          : routes
      }
    </>
  );
};

export default App;
