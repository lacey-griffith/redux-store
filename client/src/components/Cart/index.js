import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { loadStripe } from '@stripe/stripe-js'


import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';
import { QUERY_CHECKOUT } from '../../utils/queries'

import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css'

//import indexdb to make cart persistent
import { idbPromise } from '../../utils/helpers'

//import redux
import { useSelector, useDispatch } from 'react-redux';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx')

const Cart = () => {
    //establish state variable
    const state = useSelector(state => state)
    const dispatch = useDispatch()
    
    //establish lazy query for using submit checkout query
    //the data variable will contain the session id but only after the 
    //query is called in submitCheckout function
    const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT)


    useEffect(() => {
        async function getCart(){
            const cart = await idbPromise('cart', 'get')
            dispatch({
                type: ADD_MULTIPLE_TO_CART,
                products: [...cart]
            })
        }
        if(!state.cart.length){
            getCart();
        }
        //passing state.cart.length into dependency array 
        //if this wasnt, useEffect would continue running 
        //because it's here, it will only run again if state.cart.length changes
    }, [state.cart.length, dispatch])

    function toggleCart(){
        dispatch({ type: TOGGLE_CART })
    }

    function calcTotal(){
        let sum = 0
        state.cart.forEach(item => {
            sum += item.price * item.purchaseQuantity
        })
        return sum.toFixed(2)
    }

    //on click of checkout button 
    //loop over items saved in state.cart and add their product ids to the new productIds array
    //QUERY_CHECKOUT will use this array to generate a stripe session
    function submitCheckout() {
        const productIds = []

        state.cart.forEach((item => {
            for(let i = 0; i < item.purchaseQuantity; i++){
                productIds.push(item._id)
            }
        }))

        getCheckout({
            variables: { products: productIds}
        })
    }
    //watch for changes to the data being returned from the QUERY_CHECKOUT call
    useEffect(() => {
        if(data){
            stripePromise.then((res) => {
                res.redirectToCheckout({ sessionId: data.checkout.session })
            })
        }
    }, [data])

    //if the cart is close (cartOpen: false) then display the shopping cart icon
    if(!state.cartOpen){
        return (
        <div className='cart-closed' onClick={toggleCart}>
            <span role='img' aria-label='cart'>🛒</span>
        </div>
        )
    }

    return (
        <div className="cart">
        <div className="close" onClick={toggleCart}>[close]</div>
        <h2>Shopping Cart</h2>

        {state.cart.length ? (
            <div>
            {state.cart.map(item => (
                <CartItem key={item._id} item={item} />
            ))}
            <div className="flex-row space-between">
                <strong>Total: ${calcTotal()}</strong>
                {
                Auth.loggedIn() ?
                    <button onClick={submitCheckout}>
                    Checkout
                    </button>
                    :
                    <span>(log in to check out)</span>
                }
            </div>
            </div>
        ) : (
            <h6>
            Your cart is empty! 
            </h6>
        )}
        </div>
  );
};

export default Cart;