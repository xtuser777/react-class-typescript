export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
  payload: LoginRequestPayload;
}

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: LoginRequestResult;
}

export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
}

export interface LoginRequestResult {
  token: boolean | string;
  user: {
    id: number;
    login: string;
    name: string;
    level: number;
  };
}

export interface LoginRequestPayload {
  login: string;
  password: string;
}

export type LoginAction = LoginRequestAction | LoginSuccessAction | LoginFailureAction;

export const PERSIST_REHYDRATE = 'persist/REHYDRATE';
