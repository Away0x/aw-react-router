import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { routes } from './routes';

const App = () => {
  return (
    <>
      {
        routes
      }
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
