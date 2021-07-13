import React from 'react'
//import { useEffect } from 'react';
//import { useMutation } from '@apollo/client';
import Jumbotron from '../components/Jumbotron';
//import { ADD_ORDER } from '../../src/utils/mutations'
//import { idbPromise } from '../utils/helpers';

function Success() {
    return (
        <div>
            <Jumbotron>
                <h1>Success!</h1>
                <h3>Thank you for your purchase.</h3>
                <h3>You will now be redirected to the homepage.</h3>
            </Jumbotron>
        </div>

    );
  };
  
  export default Success;