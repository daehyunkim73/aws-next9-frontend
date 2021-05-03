import {all, call, fork, put, takeEvery, takeLatest} from 'redux-saga/effects';
import axios from 'axios';

import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  LOG_OUT_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE,
  LOG_INIT_REQUEST, LOG_INIT_SUCCESS, LOG_INIT_FAILURE,
  REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE,
  MESSAGE_SUCCESS, MESSAGE_CLEAR,
  SET_COOKIE_REQUEST, SET_COOKIE_SUCCESS, SET_COOKIE_FAILURE,
  SET_SSR_USER_REQUEST, SET_SSR_USER_SUCCESS, SET_SSR_USER_FAILURE,
  SET_SSR_USER2_REQUEST, SET_SSR_USER2_SUCCESS, SET_SSR_USER2_FAILURE

} from "../actions/types";
import {siteUrl, apiUrl} from "../config/config";


if(typeof localStorage !== 'undefined' && localStorage.length > 0 ) {
  let user = localStorage.getItem('user');
  let data = user;
  let access_token = !data ? '' : data.token;
  axios.defaults.headers.common = {'Authorization': `bearer ${access_token}`}
  console.log('access_token -> ', access_token);
}


const headers = {
  'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'Access-Control-Allow-Origin': `'${siteUrl}'`,
  'Access-Control-Allow-Credentials': true
}


const API_URL = `${apiUrl}`;



function setLoginAPI(param) {
  const result = axios.post(API_URL + "/api/front_api/login", {
    username: param.username,
    password: param.password
  }, {
    withCredentials: true,
  },{
    headers
  })

  return result;
}

function* setLogin(action) {
  try {
    const result = yield call(setLoginAPI, action.data);
    //return res.json({"code": 200, "desc": "success", "info": {username: username, email: db_email, token: token, roles: db_role}});
    //return res.json({"code": '000', "desc": "failure", "info": null});

    console.log('result -> ', result);
    if (result.data.code === 200){
      yield put({
        type: LOGIN_SUCCESS,
        payload: result.data
      });
    }else{
      yield put({
        type: LOGIN_FAILURE,
        error: e,
      });
    }
  } catch (e) {
    yield put({
      type: LOGIN_FAILURE,
      error: e,
    });
  }
}

function* watchSetLogin() {
  yield takeLatest(LOGIN_REQUEST, setLogin);
}

function logOutAPI() {
  // return axios.post('/user/logout', {}, {
  //   withCredentials: true,
  // });
}

function* logOut() {
  try {
    //yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOG_OUT_FAILURE
    });
  }
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

// function* logInit(action) {
//   try {
//     yield put({
//       type: LOG_INIT_SUCCESS,
//       data: action.data
//     });
//   } catch (error) {
//     console.error(error);
//     yield put({
//       type: LOG_INIT_FAILURE
//     });
//   }
// }
//
// function* watchLogInit() {
//   yield takeLatest(LOG_INIT_REQUEST, logInit);
// }


function signUpAPI(param) {
  const result = axios.post(API_URL + "/api/front_api/signup", {
    username: param.username,
    email: param.email,
    password: param.password,
    role: param.role,
  }, {
    withCredentials: true,
  },{
    headers
  })

  //return res.json({ "code": 200, "desc": "success", "info": {"username": username, "email": email }});
  return result;
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    yield put({
      type: REGISTER_SUCCESS,
      data: result.data,
    });

    yield put({
      type: MESSAGE_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({ error, type: REGISTER_FAILURE, reason: error.response && error.response.data.reason || '서버 에러' });
  }
}

function* watchSignUp() {
  yield takeLatest(REGISTER_REQUEST, signUp);
}

function* messageClear(action) {
  try {
    yield put({
      type: MESSAGE_CLEAR,
      data: null,
    });
  } catch (error) {
    console.error(error);
    yield put({ error, type: REGISTER_FAILURE, reason: error.response && error.response.data.reason || '서버 에러' });
  }
}

function* watchMessageClear() {
  yield takeLatest(MESSAGE_CLEAR, messageClear);
}

function* setCookie(action) {
  try {
    yield put({
      type: SET_COOKIE_SUCCESS,
      data: action.data
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: SET_COOKIE_FAILURE
    });
  }
}

function* watchSetCookie() {
  yield takeLatest(SET_COOKIE_REQUEST, setCookie);
}

function* setSSRUser(action) {
  try {
    yield put({
      type: SET_SSR_USER_SUCCESS,
      data: action.data,
     });
  } catch (error) {
    console.error(error);
    yield put({
      type: SET_SSR_USER_FAILURE
    });
  }
}

function* watchSetSSRUser() {
  yield takeLatest(SET_SSR_USER_REQUEST, setSSRUser);
}








function setSSRUser2API() {
  const result = axios.post(API_URL + "/api/front_api/ssrLogin", {
  }, {
    withCredentials: true,
  },{
    headers
  })

  return result;
}

function* setSSRUser2() {
  try {
    const result = yield call(setSSRUser2API);

    yield put({
      type: SET_SSR_USER2_SUCCESS,
      data: result.data.info,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: SET_SSR_USER2_FAILURE
    });
  }
}

function* watchSetSSRUser2() {
  yield takeLatest(SET_SSR_USER2_REQUEST, setSSRUser2);
}












export default function* userSaga() {
  yield all([
    fork(watchSetLogin),
    fork(watchLogOut),
    //fork(watchLogInit),
    fork(watchSignUp),
    fork(watchMessageClear),
    fork(watchSetCookie),
    fork(watchSetSSRUser),
    fork(watchSetSSRUser2),


  ]);
}
