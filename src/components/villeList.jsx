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
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { red } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';




const VilleList = () => {
  const [villes, setVilles] = useState([]);
  const [ville, setVille] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalId, setEditModalId] = useState(null);

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
      axios.delete(`https://restaurantlocalisationback-production.up.railway.app/api/villes/delete/${deleteVilleId}`).then(() => {
        setVilles((villes) => villes.filter((item) => item.id !== deleteVilleId));

        handleDeleteConfirmationClose();

      });
    }
  };

  useEffect(() => {
    axios.get("https://restaurantlocalisationback-production.up.railway.app/api/villes/all").then((response) => {
      setVilles(response.data);
      console.log(response.data);
    });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this ville?")) {
      axios.delete(`https://restaurantlocalisationback-production.up.railway.app/api/villes/delete/${id}`).then(() => {
        setVilles(villes.filter((item) => item.id !== id));
      });
    }
  };

  const handleFind = (id) => {
    axios.get(`https://restaurantlocalisationback-production.up.railway.app/api/villes/findbyid/${id}`).then((response) => {
      const data = response.data;
      setVille(data);
      setEditModalOpen(true);
    });
  };

  const [nom, setNom] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post("https://restaurantlocalisationback-production.up.railway.app/api/villes/save", { nom }).then(() => {
      navigate("/villeList");
    });
  };



  const handleEdit = (id) => {
    const newName = window.prompt("Enter the new name for this ville:");
    if (newName) {
      axios.put(`https://restaurantlocalisationback-production.up.railway.app/api/villes/update/${id}`, { nom: newName }).then(() => {
        setVilles((villes) =>
          villes.map((ville) => {
            if (ville.id === id) {
              return { ...ville, nom: newName };
            }
            return ville;
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

    const handleSaveEdit = () => {
      // Perform the API call to save the edited ville
      const { id, nom } = ville;
      axios.put(`https://restaurantlocalisationback-production.up.railway.app/api/villes/update/${id}`, { nom:editSerie.nom }).then(() => {
       
        axios.get("https://restaurantlocalisationback-production.up.railway.app/api/villes/all").then((response) => {
          setVilles(response.data);
          console.log(response.data);
        });
        handleCloseEditModal();
      });
    };

    useEffect(() => {
      axios.get(`https://restaurantlocalisationback-production.up.railway.app/api/villes/findbyid/${id}`).then((response) => {
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
          <EditIcon style={{ marginRight: '8px' }} />Edit Ville
          </Typography>
          <Typography id="edit-modal-description" sx={{ mt: 2 }}>
          <form onSubmit={handleSaveEdit}>
          
          <TextField
                            type="text"
                            label="Name"
                            required
                            value={editSerie.nom}
                            onChange={(e) => setEditSerie({ ...editSerie, nom: e.target.value })}
                        />
              <br />
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

    const handleCreateVille = (event) => {
      event.preventDefault();
      axios.post("https://restaurantlocalisationback-production.up.railway.app/api/villes/save", { nom: newVilleNom }).then(() => {
        setVilles((prevVilles) => [...prevVilles, { nom: newVilleNom }]);
        setNewVilleNom("");
        handleCloseCreateModal();

        axios.get("https://restaurantlocalisationback-production.up.railway.app/api/villes/all").then((response) => {
          setVilles(response.data);
          console.log(response.data);
        });
      }, []);

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
        <AddIcon style={{ marginRight: '8px' }} /> Create Ville
        </Typography>
        <Typography id="create-modal-description" sx={{ mt: 2 }}>
          <form onSubmit={handleCreateVille}>
           
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
    <div className='container' style={{marginTop:5, margin: '10px auto'  }}>
      <h3>Ville List</h3>
    <>
    
      <TableContainer   component={Paper}>
        <Button sx={{marginBottom:2,  background: 'green', color: 'white' }} onClick={handleOpenCreateModal} align="left" className="btn btn-primary ">
        <AddIcon style={{ marginRight: '8px' }} />   Create Ville
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
            {villes.map((ville) => (
              <StyledTableRow key={ville.id}>
                <StyledTableCell component="th" scope="row">
                  {ville.id}
                </StyledTableCell>
                <StyledTableCell align="right">{ville.nom}</StyledTableCell>
                <StyledTableCell align="center">
                  <button
                    style={{ marginRight: 20 }}
                    className="btn btn-danger"
                    onClick={() => handleDeleteConfirmationOpen(ville.id)}
                  >
                    <DeleteIcon /> Delete
                  </button>
                  <button className="btn btn-warning ml-2" onClick={() => handleFind(ville.id)}>
                    <EditIcon /> Edit
                  </button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
         

<Dialog open={deleteConfirmationOpen} onClose={handleDeleteConfirmationClose}>
  <DialogTitle>
    <DeleteIcon style={{ marginRight: '8px' }} />
    Delete Ville
  </DialogTitle>
  <DialogContent>
    Are you sure you want to delete this ville?
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
      <EditModal id={ville.id}/>
    </>
    </div>
  );
};

export default VilleList;
