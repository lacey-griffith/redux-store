import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY, ADD_TO_CART, UPDATE_PRODUCTS } from "../utils/actions";
import { QUERY_PRODUCTS } from '../utils/queries';

import Cart from '../components/Cart';
import spinner from '../assets/spinner.gif';

//import indexdb helper function
import { idbPromise } from '../utils/helpers'

//import redux
import { useSelector, useDispatch } from 'react-redux'

function Detail() {

  const state = useSelector(state => state)
  const dispatch = useDispatch()
  
  const { id } = useParams()

  const [currentProduct, setCurrentProduct] = useState({})

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const { products, cart } = state;

  useEffect(() => {
    //checking if data in global products array
    //determine which product_id to look at
    if (products.length) {
      //setting the currentProduct by matching the id from useParams
      setCurrentProduct(products.find(product => product._id === id));
    } else if (data) {
      //if nothing in global state products array, use data from useQuery AND save it globally
      //so the next time this is ran through, there will be products in the array
      //and we can set the current prodcut to this one
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });

      //save data into indexdb
      data.products.forEach((product) => {
        idbPromise('products', 'put', product)
      })
    } else if(!loading){
      //if we are offline
      idbPromise('products', 'get').then((indexedProducts) => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: indexedProducts
        })
      })
    }
  }, [products, data, loading, dispatch, id]);

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id)

    if(itemInCart){
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      })
      //if updating quantity of existing item in the cart use existing item data and increment
      idbPromise('cart','put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1 })
      } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...currentProduct, purchaseQuantity: 1 }
      })
      //if product isnt in the car, add it to the current shopping cart in indexdb offline state
      idbPromise('cart', 'put', {...currentProduct, purchaseQuantity: 1})
    }
  };

  const removeFromCart = () => {
    const itemToRemove = cart.find((cartItem) => cartItem._id === id)

    if(itemToRemove.purchaseQuantity - 1 > 0){
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: itemToRemove._id,
        purchaseQuantity: parseInt(itemToRemove.purchaseQuantity) -1
    })
    //updating current item in the cart
    idbPromise('cart', 'put', {...itemToRemove, purchaseQuantity: parseInt(itemToRemove.purchaseQuantity) - 1 })
    } else {
      dispatch({
        type: REMOVE_FROM_CART,
        _id: currentProduct._id
      })
      //delete the item from indexdb
      idbPromise('cart', 'delete', { ...currentProduct })
    }
  }

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addToCart}>Add to Cart</button>
            <button 
            disabled={!cart.find(p => p._id === currentProduct._id)}
            onClick={removeFromCart}>
              Remove from Cart</button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart/>
    </>
  );
}

export default Detail;
