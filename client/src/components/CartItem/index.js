import React from 'react';
import { useStoreContext } from '../../utils/GlobalState';
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';

const CartItem = ({ item }) => {
    const [,dispatch] = useStoreContext()

    const removeFromCart = item => {
        if(item.purchaseQuantity - 1 > 0){
            dispatch({
                type: UPDATE_CART_QUANTITY,
                _id: item._id,
                purchaseQuantity: parseInt(item.purchaseQuantity) - 1
            })
        } else {
            dispatch({
                type: REMOVE_FROM_CART,
                _id: item._id
            })
        }
    };

    // const removeFromCart = (item) => {
    //     console.log(item)
    //     const itemToRemove = cart.find((cartItem) => cartItem._id === id)
    //     console.log(itemToRemove.purchaseQuantity)
    
    //     if(itemToRemove.purchaseQuantity - 1 > 0){
    //       dispatch({
    //         type: UPDATE_CART_QUANTITY,
    //         _id: itemToRemove._id,
    //         purchaseQuantity: parseInt(itemToRemove.purchaseQuantity) -1
    //     })
    //     } else {
    //       dispatch({
    //         type: REMOVE_FROM_CART,
    //         _id: itemToRemove._id
    //       })
    //     }
    //   }


    const onChange = (e) => {
        const value = e.target.value;
        //if the value is changed to zero, remove entire item from cart
        if(value === '0'){
            dispatch({
                type: REMOVE_FROM_CART,
                _id: item._id
            })
        } else {
            dispatch({
                type: UPDATE_CART_QUANTITY,
                _id: item._id,
                purchaseQuantity: parseInt(value)
            })
        }
    }

    return(
        <div className="flex-row">
            <div>
                <img
                src={`/images/${item.image}`}
                alt=""
                />
            </div>

            <div>
                <div>{item.name}, ${item.price}</div>
                <div>
                    <span>Qty:</span>
                    <input
                    type="number"
                    placeholder="1"
                    value={item.purchaseQuantity}
                    onChange={onChange}
                    />
                    <span
                    role="img"
                    aria-label="trash"
                    onClick={() =>removeFromCart(item)}
                    >
                    🗑️
                    </span>
                </div>
            </div>
        </div>
    );
  }
  
  export default CartItem;