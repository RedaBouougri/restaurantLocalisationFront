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
import { Margin } from '@mui/icons-material';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';


const SpecilaiteList = () => {
  const [specialities, setSpecialities] = useState([]);
  const [specialitie, setSpecialitie] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteVilleId, setDeleteVilleId] = useState(null);
  const [editModalId, setEditModalId] = useState(null); // State for storing the ID to be passed to EditModal

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
      axios.delete(`/api/specialities/delete/${deleteVilleId}`).then(() => {
        setSpecialities((villes) => villes.filter((item) => item.id !== deleteVilleId));
        handleDeleteConfirmationClose();
      });
    }
  };

  useEffect(() => {
    axios.get("/api/specialities/all").then((response) => {
      setSpecialities(response.data);
      console.log(response.data);
    });
  }, []);



  const handleFind = (id) => {
    axios.get(`/api/specialities/findbyid/${id}`).then((response) => {
      const data = response.data;
      setSpecialitie(data);
     
      setEditModalId(id); // Set the ID in the state
      setEditModalOpen(true);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this speciality?")) {
      axios.delete(`/api/specialities/delete/${id}`).then(() => {
        setSpecialities((specialities) => specialities.filter((item) => item.id !== id));
      });
    }
  };

  const handleEdit = (id) => {
    const newName = window.prompt("Enter the new name for this speciality:");
    if (newName) {
      axios.put(`/api/specialities/update/${id}`, { nom: newName }).then(() => {
        setSpecialities((specialities) =>
          specialities.map((specialite) => {
            if (specialite.id === id) {
              return { ...specialite, nom: newName };
            }
            return specialite;
          })
        );
      });
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const EditModal = ({ id }) => {
    const [editSerie, setEditSerie] = useState({ nom: "" });

    const handleSaveEdit = (event) => {
      event.preventDefault();
    // Perform the API call to save the edited specialite
    axios.put(`/api/specialities/update/${id}`, { nom: editSerie.nom }).then(() => {
      setSpecialities((specialities) =>
        specialities.map((item) => {
          if (item.id === id) {
            return { ...item, nom: editSerie.nom };
          }
          return item;
        })
      );
      axios.get("/api/specialities/all").then((response) => {
        setSpecialities(response.data);
        console.log(response.data);
      });
      handleCloseEditModal();
    });
  };

  useEffect(() => {
    axios.get(`/api/specialities/findbyid/${id}`).then((response) => {
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
          <EditIcon style={{ marginRight: '8px' }} /> Edit Specialite
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
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Save
              </Button>
            </form>
          </Typography>
          
        </Box>
      </Modal>
    );
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

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const CreateModal = () => {
    const [newVilleNom, setNewVilleNom] = useState("");

    const handleCreateSpecialite = (event) => {
      event.preventDefault();
      axios.post("/api/specialities/save", { nom: newVilleNom }).then(() => {
        setSpecialities((prevVilles) => [...prevVilles, { nom: newVilleNom }]);
        setNewVilleNom("");
        axios.get("/api/specialities/all").then((response) => {
          setSpecialities(response.data);
          console.log(response.data);
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
          <AddIcon style={{ marginRight: '8px' }} /> Create Specialite
          </Typography>
          <Typography id="create-modal-description" sx={{ mt: 2 }}>
            <form onSubmit={handleCreateSpecialite}>
            
            <TextField
                            type="text"
                            label="Name"
                            required
                            value={newVilleNom}
                            onChange={(e) => setNewVilleNom(e.target.value)}
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
    <div className='container' style={{marginTop:5, margin: '10px auto' }}>
      <h3>Specialite List</h3>
    <>
      <TableContainer component={Paper}>
        <Button sx={{ marginBottom:2,  background: 'green', color: 'white' }} onClick={handleOpenCreateModal} align="left" className="btn btn-primary ">
        <AddIcon style={{ marginRight: '8px' }} />  Create Specialite
        </Button>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Id</StyledTableCell>
              <StyledTableCell align="right">Nom</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {specialities.map((specialite) => (
              <StyledTableRow key={specialite.id}>
                <StyledTableCell component="th" scope="row">
                  {specialite.id}
                </StyledTableCell>
                <StyledTableCell align="right">{specialite.nom}</StyledTableCell>
                <StyledTableCell align="center">
                  <button
                    style={{ marginRight: 20 }}
                    className="btn btn-danger"
                    onClick={() => handleDeleteConfirmationOpen(specialite.id)}
                  >
                    <DeleteIcon /> Delete
                  </button>
                  <button className="btn btn-warning ml-2" onClick={() => handleFind(specialite.id)}>
                    <EditIcon /> Edit
                  </button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
          <Dialog open={deleteConfirmationOpen} onClose={handleDeleteConfirmationClose}>
            <DialogTitle> <DeleteIcon style={{ marginRight: '8px' }} />Delete Specialite</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this specilaite?
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
      <CreateModal />
      <EditModal  id={specialitie.id}/>
    </></div>
  );
};

export default SpecilaiteList;
