import React from 'react'
import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Jumbotron from '../components/Jumbotron';
import { ADD_ORDER } from '../../src/utils/mutations'
import { idbPromise } from '../utils/helpers';

function Success() {
    const [addOrder] = useMutation(ADD_ORDER)

    useEffect(() => {
        async function saveOrder() {
            //get all items from indexdb cart
            const cart = await idbPromise('cart','get')
            //map over them to get array of ids
            const products = cart.map(item => item._id)

            if(products.length){
                //save order data
                const { data } = await addOrder({ variables: { products } })
                const productData = data.addOrder.products

                //once data is saved, delete items from cart
                productData.forEach((item )=> {
                    idbPromise('cart', 'delete', item)
                })

            }
        }
        saveOrder();
    }, [addOrder])

    //redirect to homepage after 3 seconds
    setTimeout(function(){window.location.assign('/')}, 3000)

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