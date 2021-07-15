import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';

import { QUERY_PRODUCTS } from '../../utils/queries';
import { UPDATE_PRODUCTS } from '../../utils/actions'
import { idbPromise } from '../../utils/helpers'

import ProductItem from '../ProductItem';
import spinner from '../../assets/spinner.gif';

import { useSelector, useDispatch } from 'react-redux'

function ProductList() {

  const state = useSelector(state => state)
  const dispatch = useDispatch()
  console.log(state)
  //deconstuct currentCategory from the state object
  const { currentCategory } = state;
  const { loading, data } = useQuery(QUERY_PRODUCTS)

  useEffect(() => {
    //if there is data to be stored
    if(data){
      //store in the global state object
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      })

      //also store in indexdb using the helper function
      data.products.forEach((product) => {
        idbPromise('products', 'put', product)
        //entering the promise function as 'storeName', 'method' and 'object'
      })
    } else if (!loading){
      // if offline, loading will not be happening so get data from 'products' store in indexdb
      idbPromise('products', 'get').then((products) => {
        //use retrieved data to set global state for offline browsing
        dispatch({
          type: UPDATE_PRODUCTS,
          products: products
        })
      })
    }
  }, [data, loading, dispatch])

  function filterProducts() {
    if(!currentCategory){
      return state.products
    }
    return state.products.filter(product => product.category._id === currentCategory)
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {state.products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
