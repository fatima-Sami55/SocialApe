import {
  SET_SCREAMS,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  LOADING_DATA,
  DELETE_SCREAM,
  SET_ERRORS,
  POST_SCREAM,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_SCREAM,
  STOP_LOADING_UI,
  SUBMIT_COMMENT,
  EDIT_SCREAM,
  DELETE_COMMENT,
  EDIT_COMMENT
} from '../types';
import axios from 'axios';



export const getScreams = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get('/screams')
    .then((res) => {
      dispatch({ type: SET_SCREAMS, payload: res.data });
    })
    .catch(() => {
      dispatch({ type: SET_SCREAMS, payload: [] });
    });
};

export const getScream = (screamId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/scream/${screamId}`)
    .then((res) => {
      dispatch({ type: SET_SCREAM, payload: res.data });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.error(err));
};

export const postScream = (newScream) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('/scream', newScream)
    .then((res) => {
      dispatch({ type: POST_SCREAM, payload: res.data });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

export const likeScream = (screamId) => (dispatch) => {
  axios
    .get(`/scream/${screamId}/like`)
    .then((res) => {
      dispatch({ type: LIKE_SCREAM, payload: res.data });
    })
    .catch((err) => console.error(err));
};

export const unlikeScream = (screamId) => (dispatch) => {
  axios
    .get(`/scream/${screamId}/unlike`)
    .then((res) => {
      dispatch({ type: UNLIKE_SCREAM, payload: res.data });
    })
    .catch((err) => console.error(err));
};

export const submitComment = (screamId, commentData) => async (dispatch) => {
  try {
    const res = await axios.post(`/scream/${screamId}/comment`, commentData);
    dispatch({
      type: SUBMIT_COMMENT,
      payload: res.data // Should be the new comment object
    });
    dispatch({ type: CLEAR_ERRORS });
  } catch (err) {
    dispatch({
      type: SET_ERRORS,
      payload: err.response?.data || { general: 'Something went wrong' }
    });
  }
};

export const deleteScream = (screamId) => (dispatch) => {
  axios
    .delete(`/scream/${screamId}`)
    .then(() => {
      dispatch({ type: DELETE_SCREAM, payload: screamId });
    })
    .catch((err) => console.error(err));
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

export const getUserData = (userHandle) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userHandle}`) 
    .then((res) => {
      dispatch({
        type: SET_SCREAMS,
        payload: res.data.screams
      });
    })
    .catch(() => {
      dispatch({
        type: SET_SCREAMS,
        payload: []
      });
    });
};

export const editScream = (screamId, bodyData) => (dispatch) => {
  axios
    .post(`/scream/${screamId}/edit`, { body: bodyData })
    .then(() => {
      dispatch({
        type: EDIT_SCREAM,
        payload: { screamId, body: bodyData }
      });
    })
    .catch((err) => console.error(err));
};

export const deleteComment = (commentId) => (dispatch) => {
  axios
    .delete(`/comment/${commentId}`)
    .then(() => {
      dispatch({
        type: DELETE_COMMENT,
        payload: { commentId }
      });
    })
    .catch((err) => console.error(err));
};

export const editComment = (commentId, bodyData) => (dispatch) => {
  axios
    .post(`/comment/${commentId}/edit`, { body: bodyData })
    .then(() => {
      dispatch({
        type: EDIT_COMMENT,
        payload: { commentId, body: bodyData }
      });
    })
    .catch((err) => console.error(err));
};
