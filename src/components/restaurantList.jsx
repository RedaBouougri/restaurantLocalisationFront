import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { red } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MapIcon from '@mui/icons-material/Map';
import AddIcon from '@mui/icons-material/Add';
import TablePagination from '@mui/material/TablePagination';
import Input from '@mui/material/Input';

const RestaurantList = () => {
  const [restaus, setRestaus] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteVilleId, setDeleteVilleId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaus, setFilteredRestaus] = useState([]);

  const handleSearchQueryChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filteredRestaus = restaus.filter((resto) => {
      return (
        String(resto.nom).toLowerCase().includes(query.toLowerCase())  ||
        String(resto.zone.nom).toLowerCase().includes(query.toLowerCase()) ||String(resto.serie.nom).toLowerCase().includes(query.toLowerCase())
      );
    });

    setFilteredRestaus(filteredRestaus);
    setPage(0);
  };

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
      axios
        .delete(`https://restaurantlocalisationback-production.up.railway.app/api/restos/delete`, {
          data: { id: deleteVilleId },
        })
        .then(() => {
          setRestaus((villes) => villes.filter((item) => item.id !== deleteVilleId));
          handleDeleteConfirmationClose();
        });
    }
  };

  useEffect(() => {
    axios.get('https://restaurantlocalisationback-production.up.railway.app/api/restos/all').then((response) => {
      setRestaus(response.data);
    });
  }, []);

  useEffect(() => {
    setFilteredRestaus(restaus);
  }, [restaus]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredRestaus.length - page * rowsPerPage);

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
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <div className="container" style={{ marginTop: 5, margin: '10px auto' }}>
      <h3>Restaurant List</h3>
      
      <TableContainer component={Paper}>
        <Button
          sx={{ marginBottom: 2, background: 'green', color: 'white' }}
          href="/restaurantForm"
          align="left"
          className="btn btn-primary "
        >
          <AddIcon style={{ marginRight: '8px' }} /> Create Restaurant
        </Button>
        <div>
        <Input
          type="text"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          placeholder="Search "
          fullWidth
        />
      </div>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Id</StyledTableCell>
              <StyledTableCell align="right">Image</StyledTableCell>
              <StyledTableCell align="right">Nom</StyledTableCell>
              <StyledTableCell align="right">Languitude</StyledTableCell>
              <StyledTableCell align="right">Latitude</StyledTableCell>
              <StyledTableCell align="right">Zone</StyledTableCell>
              <StyledTableCell align="right">Serie</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredRestaus.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredRestaus
            ).map((resto) => (
              <StyledTableRow key={resto.id}>
                <StyledTableCell component="th" scope="row">
                  {resto.id}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {resto.image && (
                    <img
                      src={resto.image}
                      alt="Restaurant"
                      style={{ height: '70px', width: '70px', borderRadius: '50%' }}
                    />
                  )}
                </StyledTableCell>
                <StyledTableCell align="right">{resto.nom}</StyledTableCell>
                <StyledTableCell align="right">{resto.lang}</StyledTableCell>
                <StyledTableCell align="right">{resto.latitude}</StyledTableCell>
                <StyledTableCell align="right">{resto.zone && resto.zone.nom}</StyledTableCell>
                <StyledTableCell align="right">{resto.serie && resto.serie.nom}</StyledTableCell>
                <StyledTableCell align="center">
                  <button
                    style={{ marginRight: 20 }}
                    className="btn btn-danger"
                    onClick={() => handleDeleteConfirmationOpen(resto.id)}
                  >
                    <DeleteIcon /> Delete
                  </button>
                  <Link style={{ marginRight: 20 }} className="btn btn-warning ml-2" to={`/editresto/${resto.id}`}>
                    <EditIcon /> Edit
                  </Link>
                  <Link className="btn btn-info ml-2" to={`/restodetails/${resto.id}`}>
                    <MapIcon /> Map
                  </Link>
                </StyledTableCell>
              </StyledTableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <StyledTableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRestaus.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Dialog open={deleteConfirmationOpen} onClose={handleDeleteConfirmationClose}>
        <DialogTitle>
          <DeleteIcon style={{ marginRight: '8px' }} /> Delete Restaurant
        </DialogTitle>
        <DialogContent>Are you sure you want to delete this restaurant?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirmationConfirm} autoFocus sx={{ color: red[500] }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RestaurantList;
