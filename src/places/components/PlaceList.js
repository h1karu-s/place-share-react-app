import React from 'react';

import PlaceItem from './PlaceItem/PlaceItem';
import Card from '../../shared/coponents/UIElements/Card';
import Button from '../../shared/coponents/FormElements/Button';
import './PlaceList.css';

const PlaceList = props => {
  if(props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No please found. Maybe create one ?</h2>
          <Button to="/place/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map(place => (
        <PlaceItem 
          key={place.id} 
          id={place.id} 
          image={place.image} 
          title={place.title} 
          description={place.description} 
          address={place.address} 
          creatorId={place.creator} 
          coordinates={place.location} 
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;