// import our actions
import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY
  } from '../utils/actions';

  //import reducer function
  import { reducer } from '../utils/reducers';


  // create a sample of what our global state will look like
  const initialState = {
    products: [],
    categories: [{ name: 'Food' }],
    currentCategory: '1',
  };

  //Testing updating products
  test('UPDATE_PRODUCTS', () => {
    let newState = reducer(initialState, {
        // type is one of the predefined actions
      type: UPDATE_PRODUCTS,
      products: [{}, {}]
    });
  
    expect(newState.products.length).toBe(2);
    expect(initialState.products.length).toBe(0);
  });

  //Testing updating categories
  test('UPDATE_CATEGORIES', () => {
    let newState = reducer(initialState, {
      type: UPDATE_CATEGORIES,
      categories: [{}, {}]
    });
  
    expect(newState.categories.length).toBe(2);
    expect(initialState.categories.length).toBe(1);
  });

  //Testing updating current category
  test('UPDATE_CURRENT_CATEGORY', () => {
    let newState = reducer(initialState, {
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: '2'
    });
  
    expect(newState.currentCategory).toBe('2');
    expect(initialState.currentCategory).toBe('1');
  });