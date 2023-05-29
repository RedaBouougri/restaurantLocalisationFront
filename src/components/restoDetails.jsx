import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { EditOutlined, EnvironmentOutlined, GooglePlusCircleFilled, HeatMapOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Avatar, Card, Modal, Row, Col, Select } from 'antd';
import { Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

const { Meta } = Card;
const { Option } = Select;

const RestoDetails: React.FC<{ resto: any }> = ({ resto }) => {
  const [showModal, setShowModal] = useState(false);

  const handleInfoClick = () => {
    setShowModal(!showModal);
  };

  return (
    <Col xs={24} sm={12} md={8} lg={6}>
      <Card
        hoverable
        style={{ width: '100%' }}
        cover={
          <img
            alt="Restaurant"
            src={resto.image}
            style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 ,height:'250px',width: '100%' }}
            
          />
        }
        
        actions={[
          <Tooltip title="Informations">
            <InfoCircleOutlined key="info" onClick={handleInfoClick} />
          </Tooltip>,
          <Tooltip title="Map">
            <Link to={`/restodetails/${resto.id}`}>
              <EnvironmentOutlined key="Map" />
            </Link>
          </Tooltip>,
        ]}
      >
        <Meta
          avatar={<Avatar src="https://www.shutterstock.com/image-vector/restaurant-symbol-concept-600w-263893328.jpg" />}
          title={resto.nom}
          description={resto.adress}
        />
      </Card>

      <Modal
        title={resto.nom + " Informations"}
        visible={showModal}
        onCancel={handleInfoClick}
        footer={null}
      >
        {/* Additional information content */}
        
        <p>Week : {resto.jourOuverture}</p>
        <p>Ouverture : De {resto.heureOpen} A {resto.heureClose}</p>
        <p>Zone/Ville : {resto.zone.nom} {resto.zone.ville.nom}</p>
        <p>Serie : {resto.serie.nom} </p>
        <p>Rank : {resto.rank} </p>
      </Modal>
    </Col>
  );
};

const RestaurantList = () => {
  const [restaus, setRestaus] = useState([]);
  const [selectedVille, setSelectedVille] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedSerie, setSelectedSerie] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [selectedSerieId, setSelectedSerieId] = useState("");
  const [zones, setZones] = useState([]);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    axios.get("/api/restos/all").then((response) => {
      setRestaus(response.data);
      console.log(response.data);
    });
  }, []);

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

  const handleCityChange = (value) => {
    setSelectedCityId(value);
    axios.get(`/api/zones//ville/zones/${value}`).then((response) => {
      setZones(response.data);
      console.log(value);
    });
  };

  const handleZoneChange = (value) => {

    setSelectedZoneId(value);
    axios.get(`/api/restos/filter/${selectedCityId}/${value}`).then((response) => {
      setRestaus(response.data);
      console.log(response.data);
    });
    console.log(value)

  };

  const handleSerieChange = (value) => {

    setSelectedSerieId(value);
    axios.get(`/api/restos/filter2/${selectedCityId}/${selectedZoneId}/${value}`).then((response) => {
      setRestaus(response.data);
      console.log(response.data);
    });
    console.log(value)

  };

  const handleFilterClick = () => {
    axios.get(`/api/restos/filter/${selectedCityId}/${selectedZoneId}`).then((response) => {
      setRestaus(response.data);
      console.log(response.data);
    });
    

  };




  return (
    <div className='container' style={{ margin: '70px auto' }}>
      
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <div style={{ marginBottom: '16px' }}>
            <h3>Filter Your Prefered Restaurants</h3>
            <Select
              style={{ width: 120, marginRight: '10px' }}
              placeholder="Filter by Ville"
              value={selectedCityId}
              onChange={handleCityChange}
            >
              {cities.map((ville) => (
                <Option key={ville.id} value={ville.nom}> {/* Use the ID as the value */}
                  {ville.nom}
                </Option>
              ))}
            </Select>

            <Select
              style={{ width: 120, marginRight: '10px' }}
              placeholder="Filter by Zone"
              value={selectedZoneId}
              onChange={handleZoneChange}
            >
              {zones.map((zone) => (
                <Option key={zone.id} value={zone.nom}>
                  {zone.nom}
                </Option>
              ))}
            </Select>


            <Select
              style={{ width: 120, marginRight: '10px' }}
              placeholder="Filter by Serie"
              value={selectedSerieId}
              onChange={handleSerieChange}
            >
              {series.map((serie) => (
                <Option key={serie.id} value={serie.nom}>
                  {serie.nom}
                </Option>
              ))}
            </Select>
            
          </div>
        </Col>

        {restaus.map((resto: any) => (
          <RestoDetails key={resto.id} resto={resto} />
        ))}
      </Row>
    </div>
  );
};

export default RestaurantList;
