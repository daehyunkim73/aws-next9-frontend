import {
  LOGIN_SUCCESS, LOGIN_FAILURE,
  LOG_OUT_SUCCESS, LOG_OUT_FAILURE,
  LOG_INIT_SUCCESS, LOG_INIT_FAILURE,
  REGISTER_SUCCESS, REGISTER_FAILURE,
  MESSAGE_SUCCESS, MESSAGE_CLEAR,
  SET_COOKIE_SUCCESS, SET_COOKIE_FAILURE,
  SET_SSR_USER_SUCCESS, SET_SSR_USER_FAILURE,
  SET_SSR_USER2_SUCCESS, SET_SSR_USER2_FAILURE,

} from "../actions/types";
import { setCookie, removeCookie, deleteCookie } from '../utils/cookie';
import SsrCookie from "ssr-cookie";


const cookie = new SsrCookie();
//const user = typeof localStorage !== 'undefined' &&  localStorage.getItem("user");


const initialState = {
    isLoggedIn: false,
    user: null,
    message: null,
    authentication: null,

}


export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      //return res.json({"code": 200, "desc": "success", "info": {username: username, email: db_email, token: token, roles: db_role}});
      localStorage.setItem('user', JSON.stringify(action.payload.info));
      setCookie('token', action.payload.info.token);
      setCookie('username', action.payload.info.username);
      setCookie('email', action.payload.info.email);
      setCookie('roles', action.payload.info.roles);

      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.info,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        user: null
      };
    case LOG_OUT_SUCCESS:
      localStorage.removeItem('user'); //삭제
      localStorage.clear(); // 전체삭제

      deleteCookie('username');
      deleteCookie('email');
      deleteCookie('token');
      deleteCookie('roles');
      //removeCookie('authentication');

      document.cookie = 'username' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'email' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'token' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'roles' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };

    case LOG_INIT_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: {usernmae: action.data.username, email: action.data.email, token: action.data.token, roles: action.data.roles},
      };
    case LOG_INIT_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };


    case SET_SSR_USER_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: {usernmae: action.data.username, email: action.data.email, token: action.data.token, roles: action.data.roles},
      };
    case SET_SSR_USER_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };


    case SET_SSR_USER2_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: {username: action.data?.username || null, email: action.data?.email || null, token: action.data?.token || null, roles: action.data?.roles || null},
      };
    case SET_SSR_USER2_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };


    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
      };
    case REGISTER_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
      };

    case MESSAGE_SUCCESS:
      return {
        ...state,
        message: {code: action.data.code, desc: action.data.dsec, info: action.data.info},
      };
    case MESSAGE_CLEAR:
      return {
        ...state,
        message: null,
      };

    case SET_COOKIE_SUCCESS:
      return {
        ...state,
        authentication: { token: action.data },
      };
    case SET_COOKIE_FAILURE:
      return {
        ...state,
        authentication: null,
      };



    default:
      return state;
  }
}
