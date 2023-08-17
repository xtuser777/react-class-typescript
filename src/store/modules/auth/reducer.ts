import * as types from './types';
import axios from '../../../services/axios';

export interface AuthState {
  isLoggedIn: boolean;
  token: boolean | string;
  user: {
    id: number;
    login: string;
    name: string;
    level: number;
  };
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: false,
  user: {
    id: 0,
    login: '',
    name: '',
    level: 0,
  },
};

export default function authReducer(
  state: AuthState = initialState,
  action: types.LoginAction,
): AuthState {
  switch (action.type) {
    case types.LOGIN_SUCCESS: {
      const newState = { ...state };
      newState.isLoggedIn = true;
      newState.token = action.payload.token;
      newState.user = action.payload.user;
      return newState;
    }

    case types.LOGIN_REQUEST: {
      const newState = { ...state };
      return newState;
    }

    case types.LOGIN_FAILURE: {
      delete axios.defaults.headers.Authorization;
      const newState = { ...initialState };
      return newState;
    }

    default: {
      return state;
    }
  }
}
