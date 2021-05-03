import { all, fork, takeLatest, put, delay, call } from 'redux-saga/effects';
import axios from 'axios';
import {
    LOAD_COMP_INFO_REQUEST,
    LOAD_COMP_INFO_SUCCESS,
    LOAD_COMP_INFO_FAILURE,

} from "../actions/types";
import {siteUrl, apiUrl} from '../config/config'



const API_URL = `${apiUrl}`;
const ORIGIN_URL = `${siteUrl}`;




async function loadCompInfoAPI(param) {
    //axios.defaults.headers.common = {'Authorization': `bearer ${param.token}`}
    axios.defaults.headers.common = {
        'Access-Control-Allow-Origin': ORIGIN_URL,
        'Access-Control-Allow-Credentials': true,
        'Authorization': `bearer ${param.token}`
    }

    const data = axios.post(API_URL + "/api/comp_api/compInfo", {
        compCd: param.cd,
    })
    console.log('data ))) ', data);
    return data;
}


function* loadCompInfo(action) {
    try {
        const result = yield call(loadCompInfoAPI, action.data);
        yield put({
            type: LOAD_COMP_INFO_SUCCESS,
            payload: result
        });
    } catch (e) {
        yield put({
            type: LOAD_COMP_INFO_FAILURE,
            error: e,
        });
    }
}

function* watchLoadCompInfo() {
    yield takeLatest(LOAD_COMP_INFO_REQUEST, loadCompInfo);
}




export default function* compSaga() {
    yield all([
        fork(watchLoadCompInfo),



    ]);
}
