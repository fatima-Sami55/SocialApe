import {
  SET_SCREAMS,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  LOADING_DATA,
  DELETE_SCREAM,
  POST_SCREAM,
  SET_SCREAM,
  SUBMIT_COMMENT,
  EDIT_SCREAM,
  DELETE_COMMENT,
  EDIT_COMMENT
} from '../types';

const initialState = {
  screams: [],
  scream: {}, // Detailed scream (shown in dialog)
  loading: false
};

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return { ...state, loading: true };

    case SET_SCREAMS:
      return { ...state, screams: action.payload, loading: false };

    case SET_SCREAM:
      return { ...state, scream: action.payload };

    case POST_SCREAM:
      return {
        ...state,
        screams: [action.payload, ...state.screams]
      };

    case DELETE_SCREAM:
      return {
        ...state,
        screams: state.screams.filter((scream) => scream.screamId !== action.payload)
      };

    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      return {
        ...state,
        screams: state.screams.map((scream) =>
          scream.screamId === action.payload.screamId ? action.payload : scream
        ),
        scream:
          state.scream.screamId === action.payload.screamId
            ? { ...state.scream, ...action.payload }
            : state.scream
      };

      case SUBMIT_COMMENT:
  const updatedScreams = state.screams.map((s) =>
    s.screamId === state.scream.screamId
      ? { ...s, commentCount: (s.commentCount || 0) + 1 }
      : s
  );
  return {
    ...state,
    screams: updatedScreams,
    scream: {
      ...state.scream,
      commentCount: (state.scream.commentCount || 0) + 1,
      comments: [action.payload, ...(state.scream.comments || [])]
    }
  };

    case EDIT_SCREAM:
      return {
        ...state,
        screams: state.screams.map((scream) =>
          scream.screamId === action.payload.screamId
            ? { ...scream, body: action.payload.body }
            : scream
        ),
        scream:
          state.scream.screamId === action.payload.screamId
            ? { ...state.scream, body: action.payload.body }
            : state.scream
      };

    case DELETE_COMMENT:
      return {
        ...state,
        screams: state.screams.map((scream) =>
          scream.screamId === state.scream.screamId
            ? { ...scream, commentCount: Math.max(0, (scream.commentCount || 0) - 1) }
            : scream
        ),
        scream: {
          ...state.scream,
          commentCount: Math.max(0, (state.scream.commentCount || 0) - 1),
          comments: state.scream.comments.filter((c) => c.commentId !== action.payload.commentId)
        }
      };

    case EDIT_COMMENT:
      return {
        ...state,
        scream: {
          ...state.scream,
          comments: state.scream.comments.map((comment) =>
            comment.commentId === action.payload.commentId
              ? { ...comment, body: action.payload.body }
              : comment
          )
        }
      };

    default:
      return state;
  }
}
