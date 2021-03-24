import { Dispatch } from 'redux';
import LangService from '../services/lang-service';
import { authErrorPath } from '../utils/constants';

export const USER_CREATED = 'USER_CREATED';
export const USER_CREATE_LOAD = 'USER_CREATE_LOAD';
export const INPUT_NAME_CHANGE = 'INPUT_NAME_CHANGE';
export const INPUT_EMAIL_CHANGE = 'INPUT_EMAIL_CHANGE';
export const INPUT_PASSWORD_CHANGE = 'INPUT_PASSWORD_CHANGE';
export const USER_CREATE_ERROR = 'USER_CREATE_ERROR';
export const USER_AUTH_ERROR = 'AUTH_ERROR';
export const USER_AUTH_OK = 'USER_AUTH_OK';
export const LOGIN_PAGE_CHANGE = 'LOGIN_PAGE_CHANGE';

export type UserType = {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
};

export type UserAuthErrType = {
  path: string;
  message: string;
};

export type UserCreateErrorsArrayType = Array<UserAuthErrType>;

export type UserCreatedActionType = {
  type: string;
};

export type UserCreateErrorActionType = {
  type: string;
  payload: UserCreateErrorsArrayType;
};

export type InputActionsType = {
  type: string;
  payload: string;
};

export type UserAuthActionType = {
  type: string;
  payload: UserType;
};

export type UserAuthErrorActionType = {
  type: string;
  payload: UserAuthErrType;
};

type SaveFromBackDataActions =
  | UserCreatedActionType
  | UserCreateErrorActionType
  | UserAuthActionType
  | UserAuthErrorActionType;

const userCreated = () => ({
  type: USER_CREATED,
});

const userCreatError = (error: UserCreateErrorsArrayType) => ({
  type: USER_CREATE_ERROR,
  payload: error,
});

const userAuthOk = (user: UserType) => ({
  type: USER_AUTH_OK,
  payload: user,
});

const userAuthErr = (error: UserAuthErrType) => ({
  type: USER_AUTH_ERROR,
  payload: error,
});

export const inputNameChange = (value: string) => ({
  type: INPUT_NAME_CHANGE,
  payload: value,
});

export const inputEmailChange = (value: string) => ({
  type: INPUT_EMAIL_CHANGE,
  payload: value,
});

export const inputPasswordChange = (value: string) => ({
  type: INPUT_PASSWORD_CHANGE,
  payload: value,
});

export const loginPageChange = (value: boolean) => ({
  type: LOGIN_PAGE_CHANGE,
  payload: value,
});

export const userDataLoading = (value: boolean) => ({
  type: USER_CREATE_LOAD,
  payload: value,
});

const wordService = new LangService();

const createUser = (params: {
  name: string;
  email: string;
  password: string;
}) => (dispatch: Dispatch<SaveFromBackDataActions>) => {
  dispatch(userDataLoading(true));
  wordService
    .createUser(params)
    .then((data) => {
      if (data.error) {
        const errData = data.error.errors.map((err: UserAuthErrType) => {
          if (err.path[0] === authErrorPath.name) {
            return {
              ...err,
              message: 'поле лигин не должно быть пустым',
              path: err.path[0],
            };
          }
          if (err.path[0] === authErrorPath.password) {
            return {
              ...err,
              message: 'длина пароля не менее 8 символов',
              path: err.path[0],
            };
          }
          if (err.path === authErrorPath.email) {
            return {
              ...err,
              message: err.message,
              path: err.path,
            };
          }
          return {
            ...err,
            message:
              'поле email должно быть заполнен в формате электронной почты',
            path: err.path[0],
          };
        });
        dispatch(userCreatError(errData));
      } else {
        dispatch(userCreated());
      }
      dispatch(userDataLoading(false));
    })
    .catch((err) => {
      dispatch(userDataLoading(false));
      console.error('fetch err action user', err);
    });
};

const logIn = (params: { email: string; password: string }) => (
  dispatch: Dispatch<SaveFromBackDataActions>
) => {
  wordService
    .loginUser(params)
    .then((data) => {
      if (data.error) {
        dispatch(userAuthErr(data.error));
      }
      dispatch(userAuthOk(data));
    })
    .catch((err) => console.error('fetch err action user', err));
};

export { createUser, logIn };
