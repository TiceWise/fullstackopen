import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

///////////////// NOT RECOMMENDED THIS WAY...
// better: stateful component, see app.js
// let counter = 100

// const refresh = () => {
//   ReactDOM.render(
//     <React.StrictMode>
//       <App counter={counter}/>
//     </React.StrictMode>,
//     document.getElementById('root')
//   );  
// }

