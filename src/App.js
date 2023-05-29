import logo from './logo.svg';
import './App.css';
import {Footer, ResponsiveAppBar } from './components/layout';
import CustomizedTables from './components/specialiteList';
import SpecialiteList from './components/specialiteList';
import CityList from './components/specialiteList';
import VilleForm from './components/villeForm';

import { BrowserRouter as Router, Routes, Route,useLocation } from "react-router-dom";
import SpecialiteForm from './components/specialiteForm';
import VilleList from './components/villeList';
import ZoneForm from './components/zoneForm';
import ZoneList from './components/zoneList';
import SerieList from './components/serieList';
import SerieForm from './components/serieForm';
import Map, { MapContainer } from './components/mapAll';
import RestaurantList from './components/restaurantList';
import RestaurantForm from './components/restaurantForm';
import EditResto from './components/modal/EditResto';
import { GoogleMap } from '@react-google-maps/api';
import MapId from './components/mapdetails'
import Login from './components/login';
import SignIn from './components/register';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import RestoDetails from './components/restoDetails';
import UserRoute from './components/ProtectedRoute/UserRoute';
import NotFoundPage from './components/ProtectedRoute/NoFoundPage';
import AdminRoute from './components/ProtectedRoute/AdminRoute';

function App() {
  function AppHeader() {
  

    const location = useLocation();
    const isLoginPage = location.pathname === '/';
    const isRegisterPage = location.pathname === '/register';
    if (isLoginPage||isRegisterPage) {
      return null; // Don't render the header on the login page
    }
  
    return <ResponsiveAppBar />;
  }
  return (
     <Router>
    <div className="App">
      <AppHeader/>
      
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<SignIn />} />
      <Route path="/NotFoundPage" element={<NotFoundPage />} />


      <Route  element={<ProtectedRoute />} >
         
          <Route  element={<UserRoute/>} >

          <Route path="/restos" element={<RestoDetails />} />
          <Route path="/restodetails/:id" element={<MapId/>} />
          <Route path="/map" element={<Map />} />
          </Route>

          <Route  element={<AdminRoute/>} >

          <Route path="/specialiteList" element={<SpecialiteList />} />
          <Route path="/addSpecialite" element={<SpecialiteForm />} />
          <Route path="/addVille" element={<VilleForm />} />
          <Route path="/map" element={<Map />} />

          <Route path="/villeList" element={<VilleList />} />
          <Route path="/zoneList" element={<ZoneList />} />
          <Route path="/zoneForm" element={<ZoneForm />} />
          <Route path="/serieList" element={<SerieList />} />
          <Route path="/serieForm" element={<SerieForm />} />
          <Route path="/restaurantList" element={<RestaurantList />} />
          <Route path="/restaurantForm" element={<RestaurantForm />} />
          <Route path="/editresto/:id" element={<EditResto />} />
          
          </Route>
          </Route>

          
         
        </Routes>
        
    </div>
    
    </Router>
  );
}

export default App;
