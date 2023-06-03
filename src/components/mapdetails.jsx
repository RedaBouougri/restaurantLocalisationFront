import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import { useParams } from 'react-router-dom';
import { Card } from 'antd';

const customizeMap = {
  width: '100%',
  height: '90%'
};




const GoogleMapComponent = ({ google }) => {
  const [coords, setCoords] = useState([]);
  const [initialCenter, setInitialCenter] = useState({ lat: 31.6665735, lng: -7.9754785 });
  const [restoInfo, setRestoInfo] = useState(null);
 

  const { id } = useParams();

  useEffect(() => {
    axios.get(`https://restaurantlocalisationback-production.up.railway.app/api/restos/findbyid/${id}`)
      .then(response => {
        const data = response.data;
  
        // Check if data has latitude and longitude properties
        if (data.latitude && data.lang) {
          const coordinates = {
            lat: data.latitude,
            lng: data.lang
          };
          
          setCoords([coordinates]);
          setInitialCenter(coordinates);
  
          console.log(coordinates);
        } else {
          // Handle the case when data does not have the expected properties
          console.error('Invalid data structure:', data);
        }

        setRestoInfo(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [id]);

 
  
  const drawMarker = () => {
    return coords.map((coord, i) => {
      const { lat, lng } = coord;
  
      return (
        <Marker
          key={i}
          id={i}
          position={{
            lat: lat,
            lng: lng
          }}
          onClick={() => console.log("Event Handler Called")}
        />
      );
    });
  };

  return (
    <div>
      <h1>Restaurant Location</h1>
    <div >
      
      <div style={{ marginLeft:10,marginRight:10 }}>
        <Map
          google={google}
          style={customizeMap}
          zoom={6}
          initialCenter={initialCenter}
        >
          {drawMarker()}
        </Map>
      </div>
     
    </div>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCsA6hQ1C8D6IIeB_r2WDEEgPelvpUWIf8&amp;region=MA'
})(GoogleMapComponent);
