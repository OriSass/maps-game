import React, { useState, useCallback, useEffect } from "react";
import {
  Marker,
  GoogleMap,
  LoadScript,
  InfoWindow,
  Circle 
} from "@react-google-maps/api";
import rawCities from "../.././cities.json";

const cities = rawCities.map((city) => {
  const newCity = {
    id: city.SETL_CODE,
    population: city.MGLSDE_L_1,
    name: city.MGLSDE_L_4,
    lat: city.Y,
    lng: city.X,
  };
  return newCity;
}).filter(city => city.name !== "");
function Map(props) {
  const defaultCenter = { lat: 31.4, lng: 34.7 };
  const [guessMarker, setGuessMarker] = useState();
  const [realLocationMarker, setRealLocationMarker] = useState();
  const [currentCity, setCurrentCity] = useState();
  const [distance, setDistance] = useState();

  useEffect(() => {
    nextCity();
  }, []);
  const nextCity = () => {
    const randomCity = getRandomCity();
    setCurrentCity(randomCity);
    setRealLocationMarker({ lng: randomCity.lng, lat: randomCity.lat });
    console.log(randomCity);
  }
  function getRandomCity() {
    const randomIndex = Math.floor(Math.random() * cities.length);
    return cities[randomIndex];
  }

  const onInfoLoad = (infoWindow) => {
    console.log("infoWindow: ", infoWindow);
  };
  const position = { lat: 31, lng: 32.214 };

  const divStyle = {
    background: `white`,
    border: `1px solid #ccc`,
    padding: 15,
  };

  const mapStyle = {
    height: "100vh",
    width: "100vw",
  };
  const MapTypeStyle = [
    {
      featureType: "all",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ];
  const specs = {
    scrollwheel: true,
    zoomControl: false,
    draggable: true,
    mapTypeId: "satellite",
    styles: MapTypeStyle,
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    draggableCursor: "default",
  };

  function calcCrow(lat1, lon1, lat2, lon2) 
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      console.log(`CROW DISTANCE: ${d}`);
      return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }
  return (
    <div>
      <LoadScript googleMapsApiKey="AIzaSyBRSFObeQxioZXW3IZd9BT3PBh9jOeg5Q4">
        <GoogleMap
          mapContainerStyle={mapStyle}
          zoom={7.2}
          center={defaultCenter}
          options={specs}
          onClick={(e) => {
            const guessLocation = { lng: e.latLng.lng(), lat: e.latLng.lat() };
            const newDistance = calcCrow(guessLocation.lat, guessLocation.lng, realLocationMarker.lat, realLocationMarker.lng);
            console.log(newDistance);
            if(newDistance < 100){
              setGuessMarker(guessLocation);
              setDistance(newDistance * 1000);
            }}}
        >
          {guessMarker && distance &&
          <>
             <Marker key={"realLocation"} position={realLocationMarker} label={currentCity.name}/>
             <Circle visible={guessMarker} onLoad={() => {console.log(`circle is up \nradius: ${distance}`)}} center={realLocationMarker} radius={distance} />
             <Marker key={"clientGuess"} position={guessMarker} label="guess" />
          </>}
          {currentCity && <InfoWindow onLoad={onInfoLoad} position={position} options={{disableAutoPan: true}}>
            <div style={divStyle}>
              <h1>Find {currentCity.name}</h1>
              <h3>score: {distance ? (`${100 - Math.floor(distance / 1000)}`) : ''}</h3>
              <button onClick={() => {
                nextCity();
                setDistance(0);
              }}>New City</button>
              <footer>*if you clicked too far, nothing will happen</footer>
            </div>
          </InfoWindow>}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default Map;
