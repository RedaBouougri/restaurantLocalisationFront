import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from "axios";
import Button from '@mui/material/Button';
import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Select, MenuItem } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { red } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InputLabel from '@mui/material/InputLabel';
import AddIcon from '@mui/icons-material/Add';


const ZoneList = ({ cityId }) => {
    const [zones, setZones] = useState([]);
    const [zone, setZone] = useState({});
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [cities, setCities] = useState([]);
    const [selectedCityId, setSelectedCityId] = useState("");

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deleteVilleId, setDeleteVilleId] = useState(null);

    const handleDeleteConfirmationOpen = (id) => {
        setDeleteVilleId(id);
        setDeleteConfirmationOpen(true);
    };

    const handleDeleteConfirmationClose = () => {
        setDeleteVilleId(null);
        setDeleteConfirmationOpen(false);
    };

    const handleDeleteConfirmationConfirm = () => {
        if (deleteVilleId) {
            axios.delete(`https://restaurantlocalisationback-production.up.railway.app/api/zones/delete/${deleteVilleId}`).then(() => {
                setZones((villes) => villes.filter((item) => item.id !== deleteVilleId));
                handleDeleteConfirmationClose();
            });
        }
    };


    useEffect(() => {
        axios.get("https://restaurantlocalisationback-production.up.railway.app/api/zones/all").then((response) => {
            setZones(response.data);
            console.log(response.data);
        });
    }, [cityId]);

    useEffect(() => {
        axios.get("/api/villes/all").then((response) => {
            setCities(response.data);
        });
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this zone?")) {
            axios.delete(`https://restaurantlocalisationback-production.up.railway.app/api/zones/delete/${id}`).then(() => {
                setZones(zones.filter((item) => item.id !== id));
            });
        }
    };

    const handleFind = (id) => {
        axios.get(`https://restaurantlocalisationback-production.up.railway.app/api/zones/findbyid/${id}`).then((response) => {
            const data = response.data;
            setZone(data);
            setSelectedCityId(data.ville && data.ville.id); // Set selected city ID
            setEditModalOpen(true);
        });
    };


    const handleEdit = (id) => {
        const newName = window.prompt("Enter the new name for this zone:");
        if (newName) {
            axios.put(`https://restaurantlocalisationback-production.up.railway.app/api/zones/update/${id}`, { nom: newName }).then(() => {
                setZones((zones) =>
                    zones.map((zone) => {
                        if (zone.id === id) {
                            return { ...zone, nom: newName };
                        }
                        return zone;
                    })
                );
            });
        }
    };





    const handleCloseEditModal = () => {
        setEditModalOpen(false);
    };





    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: 'transparent',
            color: theme.palette.common.black,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const EditModal = ({ id }) => {

        const [editSerie, setEditSerie] = useState({ nom: "" });

        const handleSaveEdit = () => {
            // Perform the API call to save the edited zone
            const { nom, ville } = zone;
            axios.put(`https://restaurantlocalisationback-production.up.railway.app/api/zones/update/${id}`, { nom: editSerie.nom, ville: { id: selectedCityId } }).then(() => {

                axios.get("https://restaurantlocalisationback-production.up.railway.app/api/zones/all").then((response) => {
                    setZones(response.data);
                });
                handleCloseEditModal();
            });
        };

        useEffect(() => {
            axios.get(`https://restaurantlocalisationback-production.up.railway.app/api/zones/findbyid/${id}`).then((response) => {
                const data = response.data;
                setEditSerie(data);
            });
        }, [id]);


        return (
            <Modal
                open={editModalOpen}
                onClose={handleCloseEditModal}
                aria-labelledby="edit-modal-title"
                aria-describedby="edit-modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    <Typography id="edit-modal-title" variant="h6" component="h2">
                    <EditIcon style={{ marginRight: '8px' }} />Edit Zone
                    </Typography>
                    <Typography id="edit-modal-description" sx={{ mt: 2 }}>
                        <form onSubmit={handleSaveEdit}>
                            <TextField
                                type="text"
                                label="Name"
                                required
                                value={editSerie.nom}
                                onChange={(e) => setEditSerie({ ...editSerie, nom: e.target.value })}
                            /><br />
                            <InputLabel htmlFor="ville-nom">Ville:</InputLabel>
                            <Select
                                value={selectedCityId}
                                onChange={(e) => setSelectedCityId(e.target.value)}
                            >
                                {cities.map((city) => (
                                    <MenuItem key={city.id} value={city.id}>
                                        {city.nom}
                                    </MenuItem>
                                ))}
                            </Select>

                        </form>
                    </Typography>
                    <Button variant="contained" onClick={handleSaveEdit} sx={{ mt: 2 }}>
                        Save
                    </Button>
                </Box>
            </Modal>
        );
    };

    const [createModalOpen, setCreateModalOpen] = useState(false);

    const handleOpenCreateModal = () => {
        setCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setCreateModalOpen(false);
    };

    const CreateModal = () => {
        const [nom, setNom] = useState("");

        const handleSubmit = (event) => {
            event.preventDefault();
            axios.post("https://restaurantlocalisationback-production.up.railway.app/api/zones/save", { nom, ville: { id: selectedCityId } }).then(() => {
                // Refresh the zones list after creating a new zone
                axios.get("https://restaurantlocalisationback-production.up.railway.app/api/zones/all").then((response) => {
                    setZones(response.data);
                });
                handleCloseCreateModal();
            });
        };

        return (
            <Modal
                open={createModalOpen}
                onClose={handleCloseCreateModal}
                aria-labelledby="create-modal-title"
                aria-describedby="create-modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    <Typography id="create-modal-title" variant="h6" component="h2">
                    <AddIcon style={{ marginRight: '8px' }} /> Create Zone
                    </Typography>
                    <Typography id="create-modal-description" sx={{ mt: 2 }}>
                        <form onSubmit={handleSubmit}>
                            <InputLabel htmlFor="ville-nom">Ville:</InputLabel>
                            <Select
                                value={selectedCityId}
                                onChange={(e) => setSelectedCityId(e.target.value)}
                            >
                                {cities.map((city) => (
                                    <MenuItem key={city.id} value={city.id}>
                                        {city.nom}
                                    </MenuItem>
                                ))}
                            </Select>
                            <br />
                            <TextField
                                type="text"
                                label="Name"
                                required
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                            />
                            <br />
                            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                                Create
                            </Button>
                        </form>
                    </Typography>
                </Box>
            </Modal>

        );
    };

    return (
        <div className='container' style={{ marginTop: 5, margin: '10px auto' }}>
            <h3>Zone List</h3>
            <>
                <TableContainer component={Paper}>
                    <Button sx={{ marginBottom: 2, background: 'green', color: 'white' }} onClick={handleOpenCreateModal} align="left" className="btn btn-primary ">
                    <AddIcon style={{ marginRight: '8px' }} />   Add Zone
                    </Button>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>ID</StyledTableCell>
                                <StyledTableCell align="right">Nom</StyledTableCell>
                                <StyledTableCell align="right">Ville</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {zones.map((zone) => (
                                <StyledTableRow key={zone.id}>
                                    <StyledTableCell component="th" scope="row">
                                        {zone.id}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">{zone.nom}</StyledTableCell>
                                    <StyledTableCell align="right">{zone.ville && zone.ville.nom}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <button
                                            style={{ marginRight: 20 }}
                                            className="btn btn-danger"
                                            onClick={() => handleDeleteConfirmationOpen(zone.id)}
                                        >
                                            <DeleteIcon /> Delete
                                        </button>
                                        <button className="btn btn-warning ml-2" onClick={() => handleFind(zone.id)}>
                                            <EditIcon /> Edit
                                        </button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                        <Dialog open={deleteConfirmationOpen} onClose={handleDeleteConfirmationClose}>
                            <DialogTitle>
                                <DeleteIcon style={{ marginRight: '8px' }} />
                                Delete Zone
                            </DialogTitle>
                            <DialogContent>
                                Are you sure you want to delete this zone?
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleDeleteConfirmationClose}>Cancel</Button>
                                <Button
                                    onClick={handleDeleteConfirmationConfirm}
                                    autoFocus
                                    sx={{ color: red[500] }} // Apply red color to the button
                                >
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Table>
                </TableContainer>
                {createModalOpen && <CreateModal />}
                <EditModal id={zone.id} />
            </>   </div>
    );
};

export default ZoneList;
