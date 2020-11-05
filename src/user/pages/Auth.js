import React, {useState, useContext} from 'react';

import Card from'../../shared/coponents/UIElements/Card';
import Input from '../../shared/coponents/FormElements/Input';
import Button from '../../shared/coponents/FormElements/Button';
import ErrorModal from '../../shared/coponents/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/coponents/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/coponents/FormElements/ImageUpload';
import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH, VALIDATOR_EMAIL} from '../../shared/util/validators'
import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: '',
      isvalid: false
    },
    password: {
      value: '',
      isValid: false
    }
  }, false);

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData({
        ...formState.inputs,
        name: undefined,
        image: undefined
      }, formState.inputs.email.isValid && formState.inputs.password.isValid)
    } else {
      setFormData({
        ...formState.inputs,
        name: {
          value: '',
          isValid: false
        },
        image: {
          value: null,
          isValid: false
        }
      }, false);
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();
    
   console.log(formState.inputs)

    if (isLoginMode) {    
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/login', 
          'POST', 
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          });
        auth.login(responseData.userId, responseData.token);     
      } catch(err) {}  

    } else {
      try {
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/signup',
          'POST',
          formData
        );
        auth.login(responseData.userId, responseData.token);
      } catch(err) {}
    }
    
  }


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{isLoginMode ? 'Login Required' : 'Signup Required'}</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input 
              element="input" 
              id="name" 
              type="text" 
              label="Your Name" 
              validations={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && <ImageUpload id="image" center onInput={inputHandler} />}
          <Input 
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validations={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address"
            onInput={inputHandler}
          />
          <Input 
            element="input"
            id="password"
            type="password"
            label="Password"
            validations={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters"
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
          <Button inverse type="button" onClick={switchModeHandler}>
            SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
          </Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default Auth;