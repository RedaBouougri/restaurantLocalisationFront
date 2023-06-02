import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar } from 'primereact/calendar';
import { Navigate, useNavigate,useParams } from "react-router-dom";
import { Link } from "react-router-dom";



import TextField from '@mui/material/TextField';

const EditResto = () => {




  const [zones, setZones] = useState([]);
  const [cities, setCities] = useState([]);
  const [series, setSeries] = useState([]);
  const [users, setUsers] = useState([]);
  const [nom, setNom] = useState("");
  const navigate = useNavigate();
 
  const [citie, setCitie] = useState([]);
  
  const [zone, setZone] = useState([]);
  const [serie, setSerie] = useState([]);
  const [image, setImage] = useState([]);
 
  const [adresse, setAdresse] = useState("");
  const [lang, setLang] = useState(null);
  const [timeOpen, setTimeOpen] = useState("00;00 AM");
  const [timeClose, setTimeClose] = useState("00;00 AM");
  const [latitude, setLatitude] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [selectedSerieId, setSelectedSerieId] = useState("");
  const [rank, setRank] = useState("1");
  const [jourOpen, setJourOpen] = useState("Lundi");
  const [jourClose, setJourClose] = useState("Lundi");
  const [resto, setResto] = useState([]);

  
  const {id}=useParams()

useEffect(()=>{
    loadResto()
},[]
);

    const loadResto=async ()=>{
       
       const result= await axios.get(`/api/restos/findbyid/${id}`)
       setResto(result.data)
       console.log(result.data)
       setAdresse(result.data.adress)
       setTimeClose(result.data.heureClose)
       setTimeOpen(result.data.heureOpen)
       setLang(result.data.lang)
       setLatitude(result.data.latitude)
       setNom(result.data.nom)
       setRank(result.data.rank)
       setCitie(result.data.zone.ville)
       setZone(result.data.zone)
       
     
       setSerie(result.data.serie)
       setImage(result.data.image)
       console.log(zone.nom)
       

    };

    

  const handleSubmit = (event) => {
    event.preventDefault();
    const concatenatedString = "De "+ jourOpen.concat(" A "+jourClose );
    axios.put("/api/restos/update", {
        
      id:id,
      adress:adresse,
      

        heureClose:timeClose,
        heureOpen:timeOpen,
        jourOuverture:concatenatedString,
        lang:lang,
        latitude:latitude,
        nom,
        rank:rank,
        
      image:image
      

    }).then((response) => {
        //onZoneAdded(response.data);
        setNom("");
        setSelectedCityId("");
        navigate("/restaurantList");
    
    });
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
    axios.get("/api/villes/all").then((response) => {
      setCities(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get("/api/series/all").then((response) => {
      setSeries(response.data);
    });
  }, []);

  const handleCityChange = async (event) => {
    const selectedOption = event.target.value; // Get the selected value from the event
  
    const result = await axios.get(`/api/villes/findbynom/${selectedOption}`);
    setCitie(result.data);
  
    axios.get(`/api/zones/ville/zones/${selectedOption}`).then((response) => {
      setZones(response.data);
    });
  };

  const handleZoneChange = (event) => {
   
    setZone(event.target.value);
    
  };

  const handleSerieChange = (selectedOption) => {
    
    setSerie(selectedOption);
    
  };

  return (

<form onSubmit={handleSubmit}>
    <div>
      <h2>Modifier Restaurant</h2>
      <div className="form">
        <label htmlFor="nom">Nom:</label>

        <input type="text" placeholder="nom" className="form-control" id="nom" value={nom} onChange={(event) => setNom(event.target.value)} />
      </div>
      <br/>
      <div className="form">
        <label htmlFor="adresse">  Adresse:</label>

        <input type="text" placeholder="adresse" className="form-control" id="adresse" value={adresse} onChange={(event) => setAdresse(event.target.value)} />
      </div>
      <br />
      <div className="form">
        <label htmlFor="Langitude">  Languitude:</label>

        <input type="number" placeholder="Langitude" className="form-control" id="Langitude" value={lang} onChange={(event) => setLang(event.target.value)} />
      </div>
      <br />
      <div className="form">
        <label htmlFor="Latitude">  Latitude:</label>

        <input type="number" placeholder="Latitude" className="form-control" id="Latitude" value={latitude} onChange={(event) => setLatitude(event.target.value)} />
      </div>
      <br />
      <div className="form">
        <label htmlFor="HeureOpen">  HeureOpen:</label>
        <br />
        <input
          id="HeureOpen"
          type="time"
          className="form-control"
          value={timeOpen}
          onChange={handleTimeChangeOpen}
        />
      </div>
      <br />
      <div className="form">
        <label htmlFor="HeureClose">  HeureClose:</label>
        <br />
        <input
          id="HeureClose"
          type="time"
          className="form-control"
          value={timeClose}
          onChange={handleTimeChangeClose}
        />
      </div>
      <br />
      <div className="form-group">
        <label htmlFor="rankId">Select a rank:</label>
        <br />
        <select
          className="form-control" id="rankId" value={rank} onChange={handleRankChange}
        >
          <option value="1">   1 </option>
          <option value="2">   2</option>
          <option value="3">  3</option>
          <option value="4">  4</option>
          <option value="5">  5</option>

        </select>

      </div>
      <br />
     
      <br />

     

     
      <br/>
      <button type="submit" class="btn btn-success">Save</button>

      
    </div>
    </form>
    
  );
};

export default EditResto;
