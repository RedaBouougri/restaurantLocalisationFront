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
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';

const SerieList = () => {
  const [series, setSeries] = useState([]);
  const [serie, setSerie] = useState([]);
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
      axios.delete(`https://restaurantlocalisationback-production.up.railway.app/api/series/delete/${deleteVilleId}`).then(() => {
        setSeries((villes) => villes.filter((item) => item.id !== deleteVilleId));
        handleDeleteConfirmationClose();
      });
    }
  };

  useEffect(() => {
    axios.get("https://restaurantlocalisationback-production.up.railway.app/api/series/all").then((response) => {
      setSeries(response.data);
    });
  }, []);

  const handleFind = (id) => {
    axios.get(`https://restaurantlocalisationback-production.up.railway.app/api/series/findbyid/${id}`).then((response) => {
      const data = response.data;
      setSerie(data);
      setEditModalId(id); // Set the ID in the state
      setEditModalOpen(true);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this serie?")) {
      axios.delete(`https://restaurantlocalisationback-production.up.railway.app/api/series/delete/${id}`).then(() => {
        setSeries((prevSeries) => prevSeries.filter((item) => item.id !== id));
      });
    }
  };

  const handleEdit = (id) => {
    const newName = window.prompt("Enter the new name for this serie:");
    if (newName) {
      axios.put(`https://restaurantlocalisationback-production.up.railway.app/api/series/update/${id}`, { nom: newName }).then(() => {
        setSeries((prevSeries) =>
          prevSeries.map((serie) => {
            if (serie.id === id) {
              return { ...serie, nom: newName };
            }
            return serie;
          })
        );
      });
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleSaveEdit = () => {
    axios.put(`https://restaurantlocalisationback-production.up.railway.app/api/series/update/${serie.id}`, { nom: serie.nom }).then(() => {
      setSeries((prevSeries) =>
        prevSeries.map((item) => {
          if (item.id === serie.id) {
            return { ...item, nom: serie.nom };
          }
          return item;
        })
      );
      axios.get("https://restaurantlocalisationback-production.up.railway.app/api/series/all").then((response) => {
        setSeries(response.data);
      });
      handleCloseEditModal();
    });
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

  const EditModal = ({ id }) => { // Receive the ID as a prop
    const [editSerie, setEditSerie] = useState({ nom: "" });

    const handleEditSerie = (event) => {
      event.preventDefault();
      axios.put(`https://restaurantlocalisationback-production.up.railway.app/api/series/update/${id}`, { nom: editSerie.nom }).then(() => {
        setSeries((prevSeries) =>
          prevSeries.map((item) => {
            if (item.id === id) {
              return { ...item, nom: editSerie.nom };
            }
            return item;
          })
        );
        handleCloseEditModal();
      });
    };

    useEffect(() => {
      axios.get(`https://restaurantlocalisationback-production.up.railway.app/api/series/findbyid/${id}`).then((response) => {
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
          <EditIcon style={{ marginRight: '8px' }} /> Edit Serie
          </Typography>
          <Typography id="edit-modal-description" sx={{ mt: 2 }}>
            <form onSubmit={handleEditSerie}>
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

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const CreateModal = () => {
    const [newVilleNom, setNewVilleNom] = useState("");

    const handleCreateSerie = (event) => {
      event.preventDefault();
      axios.post("https://restaurantlocalisationback-production.up.railway.app/api/series/save", { nom: newVilleNom }).then(() => {
        setSeries((prevVilles) => [...prevVilles, { nom: newVilleNom }]);
        setNewVilleNom("");
        axios.get("https://restaurantlocalisationback-production.up.railway.app/api/series/all").then((response) => {
          setSeries(response.data);
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
          <AddIcon style={{ marginRight: '8px' }} />  Create Serie
          </Typography>
          <Typography id="create-modal-description" sx={{ mt: 2 }}>
            <form onSubmit={handleCreateSerie}>
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
      <h3>Serie List</h3>
    <>
      <TableContainer component={Paper}>
        <Button sx={{ marginBottom:2,  background: 'green', color: 'white' }} onClick={handleOpenCreateModal} align="left" className="btn btn-primary ">
        <AddIcon style={{ marginRight: '8px' }} /> Create Serie
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
            {series.map((serie) => (
              <StyledTableRow key={serie.id}>
                <StyledTableCell component="th" scope="row">
                  {serie.id}
                </StyledTableCell>
                <StyledTableCell align="right">{serie.nom}</StyledTableCell>
                <StyledTableCell align="center">
                  <button
                    style={{ marginRight: 20 }}
                    className="btn btn-danger"
                    onClick={() => handleDeleteConfirmationOpen(serie.id)}
                  >
                    <DeleteIcon /> Delete
                  </button>
                  <button className="btn btn-warning ml-2" onClick={() => handleFind(serie.id)}>
                    <EditIcon /> Edit
                  </button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
          <Dialog open={deleteConfirmationOpen} onClose={handleDeleteConfirmationClose}>
            <DialogTitle> <DeleteIcon style={{ marginRight: '8px' }} />Delete Serie</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this serie?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteConfirmationClose}>Cancel</Button>
              <Button
                onClick={handleDeleteConfirmationConfirm}
                autoFocus
                sx={{ color: red[500] }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Table>
      </TableContainer>
      <CreateModal />
      <EditModal id={serie.id} /> {/* Pass the ID as a prop */}
    </></div>
  );
};

export default SerieList;

