import * as types from './types';

export function loginRequest(payload: {
  login: string;
  password: string;
}): types.LoginRequestAction {
  return {
    type: types.LOGIN_REQUEST,
    payload,
  };
}

export function loginSuccess(payload: {
  token: boolean | string;
  user: {
    id: number;
    login: string;
    name: string;
    level: number;
  };
}): types.LoginSuccessAction {
  return {
    type: types.LOGIN_SUCCESS,
    payload,
  };
}

export function loginFailure(): types.LoginFailureAction {
  return {
    type: types.LOGIN_FAILURE,
  };
}
