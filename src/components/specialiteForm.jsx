import TextField from '@mui/material/TextField';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Button from '@mui/material/Button';

const SpecialiteForm = () => {
    const [nom, setNom] = useState("");
    const navigate = useNavigate();
  
    const handleSubmit = (event) => {
      event.preventDefault();
      axios.post("/api/specialities/save", { nom }).then(() => {
        navigate("/");
      });
    };
  
    return (
      
      <div>
      <h2>Create Specialite</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nom:</label>
       

    <TextField id="standard-basic" variant="standard"

    value={nom} onChange={(event) => setNom(event.target.value)} />

        </div>
        <Button type="submit" variant="contained" style={{marginTop:20}}>
          Create
        </Button>
      </form>
    </div>
    
    );
  };
  
  export default SpecialiteForm;