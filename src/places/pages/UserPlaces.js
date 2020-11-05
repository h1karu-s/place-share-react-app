import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import PlaceItem from '../components/PlaceItem/PlaceItem';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/coponents/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/coponents/UIElements/LoadingSpinner';
import {useHttpClient} from '../../shared/hooks/http-hook';



const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const {userId} = useParams();
  
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`);
        setLoadedPlaces(responseData.places);
      } catch(err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeleteHandler = (deletedPlaceId) => {
    setLoadedPlaces(prevPlaces => {
      return prevPlaces.filter(place => place.id !== deletedPlaceId);
    });
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} /> 
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces.length > 0 && <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />}
    </React.Fragment>
  );
};

export default UserPlaces;