import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';

import Input from '../../shared/coponents/FormElements/Input';
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from '../../shared/util/validators';
import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hook';
import Button from '../../shared/coponents/FormElements/Button';
import {AuthContext} from '../../shared/context/auth-context';
import ErrorModal from '../../shared/coponents/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/coponents/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/coponents/FormElements/ImageUpload';
import './PlaceForm.css';



const NewPlace = () => {
  const auth = useContext(AuthContext);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [formState, inputHandler] = useForm({
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    },
    address: {
      value: '',
      isValid: false
    },
    image: {
      value: null,
      isValid: false
    }
  },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async event => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('image', formState.inputs.image.value);
      await sendRequest('http://localhost:5000/api/places', 'POST', formData, {
        Authorization: `Bearer ${auth.token}`
      });
      history.push('/');
    } catch(err) {}
  };
  

  return ( 
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay /> }
        <Input 
          id="title"
          element="input" 
          type="text" 
          label="Title" 
          validations={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input 
          id="description"
          element="textarea" 
          type="text" 
          label="Description" 
          validations={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input 
          id="address"
          element="input" 
          type="text" 
          label="Address" 
          validations={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <ImageUpload id="image" onInput={inputHandler} errorText="Please provide an image." />
        <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
      </form>
    </React.Fragment>
  )
};

export default NewPlace;