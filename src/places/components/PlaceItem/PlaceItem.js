import React, {useState, useContext} from 'react';

import Card from '../../../shared/coponents/UIElements/Card';
import Button from '../../../shared/coponents/FormElements/Button';
import Modal from '../../../shared/coponents/UIElements/Modal';
import Map from '../../../shared/coponents/UIElements/Map';
import ErrorModal from '../../../shared/coponents/UIElements/ErrorModal';
import LoadingSpinner from '../../../shared/coponents/UIElements/LoadingSpinner';
import {AuthContext} from '../../../shared/context/auth-context';
import {useHttpClient} from '../../../shared/hooks/http-hook';
import './PlaceItem.css';

const PlaceItem = props => {
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const opoenMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(`http://localhost:5000/api/places/${props.id}`, 'DELETE', null, {
        Authorization: `Bearer ${auth.token}`
      });
      props.onDelete(props.id);
    } catch(err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal 
        show={showMap} 
        onCancel={closeMapHandler} 
        header={props.address} 
        contentClass="place-item__modal-content" 
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16}/>
        </div>
      </Modal>
      <Modal 
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button onClick={cancelDeleteHandler} inverse>CANCEL</Button>
            <Button onClick={confirmDeleteHandler} danger>DELETE</Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and delete this place? Pleese note that it can't be undone thereafter.</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={opoenMapHandler}>VIEW ON MAP</Button >
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button >
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>DELETE</Button >
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;