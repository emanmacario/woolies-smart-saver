import { useReducer, useEffect } from 'react';
import axios from 'axios';

const ACTIONS = {
  MAKE_REQUEST: 'make-request',
  GET_DATA: 'get-data',
  ERROR: 'error',
  UPDATE_HAS_NEXT_PAGE: 'update-has-next-page'
}

// React live searching with axios: https://www.digitalocean.com/community/tutorials/react-live-search-with-axios

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST:
      return { loading: true, products: [] }
    case ACTIONS.GET_DATA:
      return { ...state, loading: false, products: action.payload.products }
    case ACTIONS.ERROR:
      return { ...state, loading: false, error: action.payload.error, products: [] }
    case ACTIONS.UPDATE_HAS_NEXT_PAGE:
      return { ...state, hasNextPage: action.payload.hasNextPage }
    default:
      return state
  }
}

function useFetchProducts(params, page) {
  const [state, dispatch] = useReducer(reducer, { products: [], loading: true });

  console.log(`Params: ${JSON.stringify(params)}`)
  console.log(`Page: ${page}`);

  useEffect(() => {
    const cancelTokenProducts = axios.CancelToken.source();
    dispatch({ type: ACTIONS.MAKE_REQUEST });
    axios.get('http://localhost:5000/users/productsPage', { 
      withCredentials: true,
      cancelToken: cancelTokenProducts.cancelToken,
      params: { page: page, ...params }
    })
    .then(res => {
      dispatch({ type: ACTIONS.GET_DATA, payload: { products: res.data.products } })
    })
    .catch(error => {
      if (axios.isCancel(error)) {
        return;
      }
      dispatch({ type: ACTIONS.ERROR, payload: { error: error }})
    });


    const cancelTokenPages = axios.CancelToken.source();
    axios.get('http://localhost:5000/users/productsPage', {
      withCredentials: true,
      cancelToken: cancelTokenPages.token,
      params: { page: page + 1, ...params }
    })
    .then(res => {
      dispatch({ type: ACTIONS.UPDATE_HAS_NEXT_PAGE, payload: { hasNextPage: res.data.products.length !== 0 } }) 
    })
    .catch(error => {
      if (axios.isCancel(error)) return
      dispatch({ type: ACTIONS.ERROR, payload: { error: error } }) 
    })

    return () => {
      cancelTokenProducts.cancel();
      cancelTokenPages.cancel();
    }
  }, [params, page]);

  return state;
}


export default useFetchProducts;