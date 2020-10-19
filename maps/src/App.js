import React from 'react';
import './App.css';
import Map from './components/Map/Map.js';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

function App() {
  return (
    <div className="App">
    <Map />
    </div>
  );
}

export default App;
