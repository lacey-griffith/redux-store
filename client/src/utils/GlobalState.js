import React, { createContext, useContext } from 'react';
import { useProductReducer } from './reducers';

//createContext will b eused to instatiate a new Context object AKA we're using it to create
//the container to hold global state data and functionality so it can be accessed through the app.

//useContext is a react hook that allows the use state created from the createContext function

const StoreContext = createContext();
const { Provider } = StoreContext;


const StoreProvider = ({ value = [], ...props}) => {
    const [state, dispatch] = useProductReducer({
        products: [],
        categories: [],
        currentCategory: ''
    })
    console.log(state)
    return <Provider value={[state, dispatch]} {...props} />
    //state ^ is the most up to date version of global state object
    //dispatch is the method executed to update the state. 
}

const useStoreContext = () => {
    return useContext(StoreContext)
}

export { StoreProvider, useStoreContext }