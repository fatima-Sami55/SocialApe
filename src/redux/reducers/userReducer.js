import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  MARK_NOTIFICATIONS_READ,
  FOLLOW_USER,
  UNFOLLOW_USER
} from '../types';

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  likes: [],
  following: [],
  notifications: []
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true
      };
    case LIKE_SCREAM:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentials.handle,
            screamId: action.payload.screamId
          }
        ]
      };
    case UNLIKE_SCREAM:
      return {
        ...state,
        likes: state.likes.filter(
          (like) => like.screamId !== action.payload.screamId
        )
      };
    case FOLLOW_USER:
      return {
        ...state,
        following: [...state.following, action.payload],
        credentials: {
          ...state.credentials,
          followingCount: (state.credentials.followingCount || 0) + 1
        }
      };
    case UNFOLLOW_USER:
      return {
        ...state,
        following: state.following.filter((h) => h !== action.payload),
        credentials: {
          ...state.credentials,
          followingCount: Math.max(0, (state.credentials.followingCount || 0) - 1)
        }
      };
    case MARK_NOTIFICATIONS_READ:
      state.notifications.forEach((not) => (not.read = true));
      return {
        ...state
      };
    default:
      return state;
  }
}
