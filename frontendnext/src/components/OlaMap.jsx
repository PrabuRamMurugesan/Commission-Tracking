import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const center = {
  lat: 12.9716, // Bengaluru (Ola's headquarters)
  lng: 77.5946,
};

const olaLocations = [
  { id: 1, lat: 12.9279, lng: 77.6271 }, // Example Ola pickup/drop location
  { id: 2, lat: 12.9724, lng: 77.5806 },
  { id: 3, lat: 12.9165, lng: 77.6101 },
];

const OlaMap = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Ola Ride Map</h2>
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={12}>
          {olaLocations.map((location) => (
            <Marker key={location.id} position={{ lat: location.lat, lng: location.lng }} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default OlaMap;