import React, { Component } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import AuthService from "../services/auth.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useState } from 'react';
import { Routes, Route, Link,Redirect  } from "react-router-dom";
import { MDBCardImage, MDBCollapse, MDBContainer, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, MDBIcon, MDBInputGroup, MDBNavbar, MDBNavbarBrand, MDBNavbarItem, MDBNavbarLink, MDBNavbarNav, MDBNavbarToggler } from "mdb-react-ui-kit";

const pages = ['Specialite', 'Zone', 'Ville'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

class ResponsiveAppBar extends Component {
  state = {
    showNavColor: false,
    showSidebar: false,
    showNavSecond: false,
    showModeratorBoard: false,
    showAdminBoard: false,
    showUserBoard: false,
    currentUser: undefined,
  };

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
        showUserBoard: user.roles.includes("ROLE_USER"),
      });
    }
  }

  handleToggleSidebar = () => {
    this.setState((prevState) => ({
      showSidebar: !prevState.showSidebar,
    }));
  };

  toggleNavSecond = () => {
    this.setState((prevState) => ({
      showNavSecond: !prevState.showNavSecond,
    }));
  };

  logOut = () => {
    AuthService.logout();
  };

  render() {
    const {
      showNavSecond,
      currentUser,
      showModeratorBoard,
      showAdminBoard,
      showUserBoard,
    } = this.state;

    return (
      <div>
        <MDBNavbar expand="lg" dark bgColor="primary">
          <MDBContainer fluid className="removeDot">
            <img
              src="https://www.shutterstock.com/image-vector/vintage-grilled-barbecue-logo-retro-600w-1961528425.jpg"
              alt="Logo"
              style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: 5 }} // Adjust the width as per your requirement
            />
            <MDBNavbarBrand href="/Home">Resto Localisation</MDBNavbarBrand>

            <MDBNavbarToggler
              type="button"
              data-target="#navbarColor02"
              aria-controls="navbarColor02"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={this.toggleNavSecond}
            >
              <FontAwesomeIcon icon={faBars} />
            </MDBNavbarToggler>
            <MDBCollapse show={showNavSecond} navbar>
              <MDBNavbarNav className="me-auto mb-2 mb-lg-0">
               
               
                <MDBNavbarItem className="active">
                  <MDBNavbarLink style={{ color: "white" }} aria-current="page" href="/restaurantList">
                    <MDBIcon icon="camera-retro" />
                    Restaurants
                  </MDBNavbarLink>
                </MDBNavbarItem>
               
                <MDBNavbarItem className="active">
                  <MDBNavbarLink style={{ color: "white" }} aria-current="page" href="/villeList">
                    <MDBIcon icon="camera-retro" />
                    Villes
                  </MDBNavbarLink>
                </MDBNavbarItem>
              
                <MDBNavbarItem className="active">
                  <MDBNavbarLink style={{ color: "white" }} aria-current="page" href="/zoneList">
                    <MDBIcon icon="camera-retro" />
                    Zones
                  </MDBNavbarLink>
                </MDBNavbarItem>
          
                <MDBNavbarItem className="active">
                  <MDBNavbarLink style={{ color: "white" }} aria-current="page" href="/specialiteList">
                    <MDBIcon icon="camera-retro" />
                    Specialités
                  </MDBNavbarLink>
                </MDBNavbarItem>
              
                <MDBNavbarItem className="active">
                  <MDBNavbarLink style={{ color: "white" }} aria-current="page" href="/serieList">
                    <MDBIcon icon="camera-retro" />
                    Series
                  </MDBNavbarLink>
                </MDBNavbarItem>
                
                <MDBNavbarItem className="active">
                  <MDBNavbarLink style={{ color: "white" }} aria-current="page" href="/map">
                    <MDBIcon icon="camera-retro" />
                    MapAll
                  </MDBNavbarLink>
                </MDBNavbarItem>
               
                  <MDBNavbarItem className="active">
                    <MDBNavbarLink style={{ color: "white" }} aria-current="page" href="/restos">
                      <MDBIcon icon="camera-retro" />
                      UserRestos
                    </MDBNavbarLink>
                  </MDBNavbarItem>
              
                
                

{currentUser ? (
  <MDBNavbarItem className='ms-auto'>
    <MDBDropdown>
      <MDBDropdownToggle className="nav-link">
      <FontAwesomeIcon icon={faUser}  size="lg" style={{ color: "#ffffff" }}  />
      </MDBDropdownToggle>
      <MDBDropdownMenu>
        <Link to="/profile" className="dropdown-link">
          <MDBDropdownItem link>
            {currentUser.username}
          </MDBDropdownItem>
        </Link>
        <Link to="/" className="dropdown-link">
          <MDBDropdownItem link onClick={this.logOut}>
            Log out
          </MDBDropdownItem>
        </Link>
      </MDBDropdownMenu>
    </MDBDropdown>
  </MDBNavbarItem>
) : (
  <MDBNavbarItem className='ms-auto'>
    <MDBDropdown >
      <MDBDropdownToggle className="nav-link" >
      <FontAwesomeIcon icon={faUser}  size="lg" style={{ color: "#ffffff" }}  />
      </MDBDropdownToggle>
      <MDBDropdownMenu>
        <Link to="/" className="dropdown-link">
          <MDBDropdownItem link>
            Login
          </MDBDropdownItem>
        </Link>
        <Link to="/register" className="dropdown-link">
          <MDBDropdownItem link>
            Register
          </MDBDropdownItem>
        </Link>
      </MDBDropdownMenu>
    </MDBDropdown>
  </MDBNavbarItem>
)}
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
      </div>
    );
  }
}

const Footer = () => {
  return (
    <footer class="text-white bg-dark fixed-bottom pt-20 pb-20" style={{ position: 'static' }}>
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <h5>Contact</h5>
            <p>77 Rue 750 AlQods, Guelmim</p>
            <p><i class="fas fa-phone"></i> +212 611100098</p>
            <p><i class="fas fa-envelope"></i> redabouougri12@gmail.com</p>
          </div>
          <div class="col-md-4">
            <h5>Réseaux sociaux</h5>
            <ul class="list-unstyled">
              <li><a href="https://www.facebook.com/reda.bouougri.7/" style={{ color: 'White' }}><i class="fab fa-facebook fa-lg"></i> Facebook</a></li>
              <li><a href="https://www.linkedin.com/in/bouougri-reda-250846212/" style={{ color: 'White' }}><i class="fab fa-linkedin fa-lg"></i> Linkedin</a></li>
              <li><a href="https://www.instagram.com/bouougri/" style={{ color: 'White' }}><i class="fab fa-instagram fa-lg"></i> Instagram</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h5>Menu</h5>
            <ul class="list-unstyled">
              <li className="nav-item">
                <NavLink className="nav-link" to="/restaurantList" activeClassName="active" style={{ color: 'White' }}>
                  Restaurant
                </NavLink>
              </li>
              <li><NavLink className="nav-link" to="/" activeClassName="active" style={{ color: 'White' }}>
                Specialite
              </NavLink></li>
              <li><NavLink className="nav-link" to="/villeList" activeClassName="active" style={{ color: 'White' }}>
                Ville
              </NavLink></li>
              <li> <NavLink className="nav-link" to="/zoneList" activeClassName="active" style={{ color: 'White' }}>
                Zone
              </NavLink></li>
              <li><NavLink className="nav-link" to="/serieList" activeClassName="active" style={{ color: 'White' }}>
                Serie
              </NavLink></li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 mt-3 text-center">
            <p>&copy; 2023 Localisation Restaurant. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { ResponsiveAppBar, Footer };
