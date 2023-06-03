import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar } from 'primereact/calendar';
import { Navigate, useNavigate } from "react-router-dom";


import TextField from '@mui/material/TextField';

const RestaurantForm = () => {
  const [zones, setZones] = useState([]);
  const [cities, setCities] = useState([]);
  const [series, setSeries] = useState([]);
  const [users, setUsers] = useState([]);
  const [nom, setNom] = useState([]);
  const navigate = useNavigate();
  
 
  const [adresse, setAdresse] = useState([]);
  const [lang, setLang] = useState([]);
  const [timeOpen, setTimeOpen] = useState("00;00 AM");
  const [timeClose, setTimeClose] = useState("00;00 AM");
  const [latitude, setLatitude] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [selectedSerieId, setSelectedSerieId] = useState("");
  const [rank, setRank] = useState("1");
  const [jourOpen, setJourOpen] = useState("Lundi");
  const [jourClose, setJourClose] = useState("Lundi");
  const [image, setImages] = useState("");
  


  const handleSubmit = (event) => {
    event.preventDefault();
    const concatenatedString = "De "+ jourOpen.concat(" A "+jourClose );
    axios.post("https://restaurantlocalisationback-production.up.railway.app/api/restos/save", {
        
      adress:adresse,
      

        heureClose:timeClose,
        heureOpen:timeOpen,
        jourOuverture:concatenatedString,
        lang:lang,
        latitude:latitude,
        nom,
        rank:rank,
        serie: {
          id: selectedSerieId
      },
      zone: {
        id: selectedZoneId
    },image:image

    
      

    }).then((response) => {
        //onZoneAdded(response.data);
        setNom("");
        setSelectedCityId("");
        navigate("/restaurantList");
    
    });
};

const handlePhotoChange = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    setImages(e.target.result);
  };
  reader.readAsDataURL(file);
};

  const handleJourOpenChange = (event) => {
    setJourOpen(event.target.value);
  };

  const handleJourCloseChange = (event) => {
    setJourClose(event.target.value);
  };


  const handleTimeChangeOpen = (event) => {
    setTimeOpen(event.target.value);
  };

  const handleRankChange = (event) => {
    setRank(event.target.value);
  };

  const handleTimeChangeClose = (event) => {
    setTimeClose(event.target.value);
  };

  useEffect(() => {
    axios.get("https://restaurantlocalisationback-production.up.railway.app/api/villes/all").then((response) => {
      setCities(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get("https://restaurantlocalisationback-production.up.railway.app/api/series/all").then((response) => {
      setSeries(response.data);
    });
  }, []);

  const handleCityChange = (event) => {
    const cityId = event.target.value;
    setSelectedCityId(cityId);
    axios.get(`https://restaurantlocalisationback-production.up.railway.app/api/zones//ville/zones/${cityId}`).then((response) => {
      setZones(response.data);
    });
  };

  const handleZoneChange = (event) => {
   
    setSelectedZoneId(event.target.value);
    
  };

  const handleSerieChange = (event) => {
    
    setSelectedSerieId(event.target.value);
    
  };

  return (
<div className="container mt-4">
<form onSubmit={handleSubmit}>
  <h2>Ajouter Restaurant</h2>
  <div className="row">
    <div className="col-md-6">
      <div className="form-group">
        <label htmlFor="restaurant-adresse" className="form-label">Photo:</label>
        <input className="form-control" required type="file" accept="image/*" onChange={handlePhotoChange} />
      </div>
      <div className="form-group">
        <label htmlFor="nom">Nom:</label>
        <input type="text" placeholder="nom" required className="form-control" id="nom" value={nom} onChange={(event) => setNom(event.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="adresse">Adresse:</label>
        <input type="text" placeholder="adresse" required className="form-control" id="adresse" value={adresse} onChange={(event) => setAdresse(event.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="Langitude">Languitude:</label>
        <input type="number" placeholder="Langitude" required className="form-control" id="Langitude" value={lang} onChange={(event) => setLang(event.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="Latitude">Latitude:</label>
        <input type="number" placeholder="Latitude" required className="form-control" id="Latitude" value={latitude} onChange={(event) => setLatitude(event.target.value)} />
      </div>
     
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label htmlFor="HeureOpen">HeureOpen:</label>
        <br />
        <input id="HeureOpen" type="time" required className="form-control" value={timeOpen} onChange={handleTimeChangeOpen} />
      </div>
      <div className="form-group">
        <label htmlFor="HeureClose">HeureClose:</label>
        <br />
        <input id="HeureClose" type="time" required className="form-control" value={timeClose} onChange={handleTimeChangeClose} />
      </div>
      <div className="form-group">
        <label htmlFor="rankId">Select a rank:</label>
        <br />
        <select className="form-control" required id="rankId" value={rank} onChange={handleRankChange}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
     
      <div className="form-group">
        <label htmlFor="cityId">Select a city:</label>
        <select className="form-control" required id="cityId" value={selectedCityId} onChange={handleCityChange}>
          <option value="">All cities</option>
          {cities.map((city) => (
            <option key={city.id} value={city.nom}>
              {city.nom}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="zoneId">Select a zone:</label>
        <select className="form-control" required id="zoneId" value={selectedZoneId} onChange={handleZoneChange}>
        <option value="">zones</option>
          {zones.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.nom}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="serieId">Select a serie:</label>
        <select className="form-control" required id="serieId" value={selectedSerieId} onChange={handleSerieChange}>
          <option value="">All series</option>
          {series.map((serie) => (
            <option key={serie.id} value={serie.id}>
              {serie.nom}
            </option>
          ))}
        </select>
      </div>
      
    </div>
  </div><br/>
  <button type="submit" className="btn btn-success">Save</button>

  
</form></div>

  );
};

export default RestaurantForm;
