import {
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  STOP_LOADING_UI,
  SET_SERVER_ERROR,
  CLEAR_SERVER_ERROR
} from '../types';

const initialState = {
  loading: false,
  errors: null,
  serverError: false
};

export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: null
      };
    case LOADING_UI:
      return {
        ...state,
        loading: true
      };
    case STOP_LOADING_UI:
      return {
        ...state,
        loading: false
      };
    case SET_SERVER_ERROR:
      return {
        ...state,
        loading: false,
        serverError: true
      };
    case CLEAR_SERVER_ERROR:
      return {
        ...state,
        serverError: false,
        errors: null
      };
    default:
      return state;
  }
}

