import React, { useEffect } from 'react';

import { useStoreContext } from '../../utils/GlobalState';
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';

import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css'

//import indexdb to make cart persistent
import { idbPromise } from '../../utils/helpers'

const Cart = () => {
    //establish state variable
    const [ state, dispatch ] = useStoreContext();
    
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
                    <button>
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