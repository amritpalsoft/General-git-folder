import logo from './logo.svg';
import './App.css';
import { Slider } from 'primereact/slider';
import $ from 'jquery';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons

// const geoRev = require('geo-reverse')

// const lookup = require("coordinate_to_country");
function App() {
  $.get("http://ip-api.com/json", function(response) {
console.log(response.country);}, "jsonp");
console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, handleError);
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

// watch visitor's location
function watchLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition, handleError);
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

function handleError(error) {
  let errorStr;
  switch (error.code) {
    case error.PERMISSION_DENIED:
      errorStr = 'User denied the request for Geolocation.';
      break;
    case error.POSITION_UNAVAILABLE:
      errorStr = 'Location information is unavailable.';
      break;
    case error.TIMEOUT:
      errorStr = 'The request to get user location timed out.';
      break;
    case error.UNKNOWN_ERROR:
      errorStr = 'An unknown error occurred.';
      break;
    default:
      errorStr = 'An unknown error occurred.';
  }
  console.error('Error occurred: ' + errorStr);
}

function showPosition(position) {
  console.log(`Latitude: ${position.coords.latitude}, longitude: ${position.coords.longitude}`)
  // console.log(lookup(position.coords.latitude,position.coords.longitude));
// console.log(geoRev.country( 26, 80 ))
}

  return (
    <div className="App">
      <h1 onClick={()=>getLocation()}>{"abc"}</h1>  
      <Slider value={[0,100]} range />
    </div>
  );
}

export default App;
