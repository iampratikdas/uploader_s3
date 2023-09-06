import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import { Worker } from '@react-pdf-viewer/core';
import reportWebVitals from './reportWebVitals';
GlobalWorkerOptions.workerSrc = `pdfjs-dist/build/pdf.worker.js`;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
  {/* <React.StrictMode> */}
    <App />
  {/* </React.StrictMode> */}
</Worker>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
