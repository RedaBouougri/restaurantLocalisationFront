import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const ZoneForm = ({ onZoneAdded }) => {
    const [nom, setNom] = useState("");
    const [villeId, setVilleId] = useState("");
    const [cities, setCities] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        axios.get("/api/villes/all").then((response) => {
            setCities(response.data);
        });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post("/api/zones/save", {
            nom,
            ville: {
                id: villeId
            }
        }).then((response) => {
            //onZoneAdded(response.data);
            setNom("");
            setVilleId("");
            navigate("/zoneList");
        
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={nom}
                    onChange={(event) => setNom(event.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="cityId">City:</label>
                <select
                    className="form-control"
                    id="cityId"
                    value={villeId}
                    onChange={(event) => setVilleId(event.target.value)}
                >
                    <option value="">Select a city </option>
                    {cities && cities.map((ville) => (
                        <option key={ville.id} value={ville.id}>
                            {ville.nom}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit" className="btn btn-primary">
                Add Zone
            </button>
        </form>
    );
};

export default ZoneForm;