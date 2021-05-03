import { all, fork, takeLatest, put, delay, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  LOAD_PAYMNT_LIST_REQUEST,
  LOAD_PAYMNT_LIST_SUCCESS,
  LOAD_PAYMNT_LIST_FAILURE,
  SET_CURRPAGELIST_REQUEST,
  SET_CURRPAGELIST_SUCCESS,
  SET_CURRPAGELIST_FAILURE,
  GET_TOTALCNT_REQUEST,
  GET_TOTALCNT_SUCCESS,
  GET_TOTALCNT_FAILURE,
  GET_CONTENTCNT_PERPAGE_REQUEST,
  GET_CONTENTCNT_PERPAGE_SUCCESS,
  GET_CONTENTCNT_PERPAGE_FAILURE,
  SET_PAGENUM_REQUEST,
  SET_PAGENUM_SUCCESS,
  SET_PAGENUM_FAILURE,
  SET_CONTENT_EDITABLE_REQUEST,
  SET_CONTENT_EDITABLE_SUCCESS,
  SET_CONTENT_EDITABLE_FAILURE,
  SET_TEMPPAYMNTLIST_UPDATE_REQUEST,
  SET_TEMPPAYMNTLIST_UPDATE_SUCCESS,
  SET_TEMPPAYMNTLIST_UPDATE_FAILURE,
  SET_MULTIUPDATE_REQUEST,
  SET_MULTIUPDATE_SUCCESS,
  SET_MULTIUPDATE_FAILURE,
  SET_PAYMNTDATA_DELETE_REQUEST,
  SET_PAYMNTDATA_DELETE_SUCCESS,
  SET_PAYMNTDATA_DELETE_FAILURE,
  SET_PAYMNTDATA_MULTIDELETE_REQUEST,
  SET_PAYMNTDATA_MULTIDELETE_SUCCESS,
  SET_PAYMNTDATA_MULTIDELETE_FAILURE,
  LOAD_PAYMNT_INFO_REQUEST,
  LOAD_PAYMNT_INFO_SUCCESS,
  LOAD_PAYMNT_INFO_FAILURE,
  LOAD_PAYMNT_MAIN_SAVE_REQUEST,
  LOAD_PAYMNT_MAIN_SAVE_SUCCESS,
  LOAD_PAYMNT_MAIN_SAVE_FAILURE,
  LOAD_PAYMNT_HIS_SAVE_REQUEST,
  LOAD_PAYMNT_HIS_SAVE_SUCCESS,
  LOAD_PAYMNT_HIS_SAVE_FAILURE,
  LOAD_SSR_PAYMNT_LIST_REQUEST,
  LOAD_SSR_PAYMNT_LIST_SUCCESS,
  LOAD_SSR_PAYMNT_LIST_FAILURE,

} from "../actions/types";
import {siteUrl, apiUrl} from '../config/config'



const API_URL = `${apiUrl}`;
const ORIGIN_URL = `${siteUrl}`;





async function loadPaymntListAPI (params) {
  const data =  await axios.get(API_URL + "/api/front_api/paymnts_lists", {
    params: {
      comp_nm_Ref_v: params.comp_nm_Ref_v,
      jungsan_date_Ref_v: params.jungsan_date_Ref_v,
      total_paymnt_amnt_Ref_v: params.total_paymnt_amnt_Ref_v,
      paymnt_method_Ref_v: params.paymnt_method_Ref_v,
      minus_amount_Ref_v: params.minus_amount_Ref_v,
      jungsan_amount_Ref_v: params.jungsan_amount_Ref_v,
      use_Ref_v: params.use_Ref_v,
      orderBy: params.orderBy,
      descasc: params.descasc
    }
  });
  return data;
}

function* loadPaymntList(action) {
  try {
    const result = yield call(loadPaymntListAPI, action.data);
    yield put({
      type: LOAD_PAYMNT_LIST_SUCCESS,
      payload: {list: result.data},
    });
  } catch (e) {
    yield put({
      type: LOAD_PAYMNT_LIST_FAILURE,
      error: e,
    });
  }
}

function* watchLoadPaymntList() {
  yield takeLatest(LOAD_PAYMNT_LIST_REQUEST, loadPaymntList);
}

function* setCurrPageList(action) {
  try {
    yield put({
      type: SET_CURRPAGELIST_SUCCESS,
      data: action.payload,
    });
  } catch (e) {
    yield put({
      type: SET_CURRPAGELIST_FAILURE,
      error: e,
    });
  }
}

function* watchSetCurrPageList() {
  yield takeLatest(SET_CURRPAGELIST_REQUEST, setCurrPageList);
}

function getPaymntsTotalCntAPI() {
  const data = axios.get(API_URL + "/api/front_api/paymnts_totalCnt", {
    params: {
    }
  });
  return data;
}

function* getPaymntsTotalCnt(action) {
  try {
    const result = yield call(getPaymntsTotalCntAPI);
    yield put({
      type: GET_TOTALCNT_SUCCESS,
      payload: {cnt: result.data[0].cnt}
    });
  } catch (e) {
    yield put({
      type: GET_TOTALCNT_FAILURE,
      error: e,
    });
  }
}

function* watchGetPaymntTotalCnt() {
  yield takeLatest(GET_TOTALCNT_REQUEST, getPaymntsTotalCnt);
}

function* getContentPerPage(action) {
  try {
    yield put({
      type: GET_CONTENTCNT_PERPAGE_SUCCESS,
      data: action.payload,
    });
  } catch (e) {
    yield put({
      type: GET_CONTENTCNT_PERPAGE_FAILURE,
      error: e,
    });
  }
}
function* watchGetContentPerPage() {
  yield takeLatest(GET_CONTENTCNT_PERPAGE_REQUEST, getContentPerPage);
}

function* setPageNum(action) {
  try {
    yield put({
      type: SET_PAGENUM_SUCCESS,
      data: action.payload,
    });
  } catch (e) {
    yield put({
      type: SET_PAGENUM_FAILURE,
      error: e,
    });
  }
}
function* watchSetPageNum() {
  yield takeLatest(SET_PAGENUM_REQUEST, setPageNum);
}

function* setContentEditable(action) {
  try {
    yield put({
      type: SET_CONTENT_EDITABLE_SUCCESS,
      payload: {id: action.payload.id, editGbn: action.payload.editGbn },
    });
  } catch (e) {
    yield put({
      type: SET_CONTENT_EDITABLE_FAILURE,
      error: e,
    });
  }
}
function* watchSetContentEditable() {
  yield takeLatest(SET_CONTENT_EDITABLE_REQUEST, setContentEditable);
}

function* setTempPaymntList_Update(action) {
  try {
    yield put({
      type: SET_TEMPPAYMNTLIST_UPDATE_SUCCESS,
      data: {
        id: action.payload.id,
        jungsan_date: action.payload.jungsan_date,
        total_paymnt_amnt: action.payload.total_paymnt_amnt,
        minus_amount: action.payload.minus_amount,
        jungsan_amount: action.payload.jungsan_amount,
        paymnt_method: action.payload.paymnt_method,
        use: action.payload.use,
      },
    });
  } catch (e) {
    yield put({
      type: SET_TEMPPAYMNTLIST_UPDATE_FAILURE,
      error: e,
    });
  }
}

function* watchSetTempPaymntList_Update() {
  yield takeLatest(SET_TEMPPAYMNTLIST_UPDATE_REQUEST, setTempPaymntList_Update);
}

async function setMultiUpdateAPI (payload) {
  const result = await axios.post(API_URL + "/api/front_api/paymntsDataUpdate", {
    params: payload
  }, {
        withCredentials: true,
  })
  return result;
}

function* setMultiUpdate(action) {
  try {
    const result = yield call(setMultiUpdateAPI, action.payload);
    // yield put({
    //   type: SET_MULTIUPDATE_SUCCESS,
    //   payload: result,
    // });
  } catch (e) {
    // yield put({
    //   type: SET_MULTIUPDATE_FAILURE,
    //   error: e,
    // });
  }
}

function* watchSetMultiUpdate() {
  yield takeLatest(SET_MULTIUPDATE_REQUEST, setMultiUpdate);
}

function setPaymntDataDeleteAPI(param) {
  const data = axios.post(API_URL + "/api/front_api/paymntsDataDelete", {
    id: param.id,
  }, {
    withCredentials: true,
  })
  return data;
}

function* setPaymntDataDelete(action) {
  try {
    const result = yield call(setPaymntDataDeleteAPI, action.payload);
    yield put({
      type: SET_PAYMNTDATA_DELETE_SUCCESS,
      payload: action.payload.id
    });
  } catch (e) {
    yield put({
      type: SET_PAYMNTDATA_DELETE_FAILURE,
      error: e,
    });
  }
}

function* watchSetPaymntDataDelete() {
  yield takeLatest(SET_PAYMNTDATA_DELETE_REQUEST, setPaymntDataDelete);
}

function setPaymntDataMultiDeleteAPI(param) {
  const data = axios.post(API_URL + "/api/front_api/paymntsDataMultiDelete", {
    dataArr: param,
  }, {
    withCredentials: true,
  })
  return data;
}

function* setPaymntDataMultiDelete(action) {
  try {
    const result = yield call(setPaymntDataMultiDeleteAPI, action.payload);
    yield put({
      type: SET_PAYMNTDATA_MULTIDELETE_SUCCESS,
      payload: action.payload
    });
  } catch (e) {
    yield put({
      type: SET_PAYMNTDATA_MULTIDELETE_FAILURE,
      error: e,
    });
  }
}

function* watchSetPaymntDataMultiDelete() {
  yield takeLatest(SET_PAYMNTDATA_MULTIDELETE_REQUEST, setPaymntDataMultiDelete);
}

async function setTempInfoAPI(param) {
  //axios.defaults.headers.common = {'Authorization': `bearer ${param.token}`}
  axios.defaults.headers.common = {
    'Access-Control-Allow-Origin': ORIGIN_URL,
    'Access-Control-Allow-Credentials': true,
    'Authorization': `bearer ${param.token}`
  }

  const data = await axios.post(API_URL + "/api/front_api/Paymnts_Info", {
    idx: param.idx,
  })
  return data;
}

function* setTempInfo(action) {
  try {
    const result = yield call(setTempInfoAPI, action.data);    // res.json({info:result[0], his:result2, file:result3 });
    yield put({
      type: LOAD_PAYMNT_INFO_SUCCESS,
      payload: result
    });
  } catch (e) {
    yield put({
      type: LOAD_PAYMNT_INFO_FAILURE,
      error: e,
    });
  }
}

function* watchSetTempInfo() {
  yield takeLatest(LOAD_PAYMNT_INFO_REQUEST, setTempInfo);
}

async function setPaymntMainSaveAPI(paramData) {
  console.log('paramData ====================>> ', paramData)
  const data = await axios.post(API_URL + "/api/front_api/paymntMainSave", {
    data: paramData,
  })
  console.log('data ))) ', data);
  return data;
}

function* setPaymntMainSave(action) {
  try {
    const result = yield call(setPaymntMainSaveAPI, action.data);
    yield put({
      type: LOAD_PAYMNT_MAIN_SAVE_SUCCESS,
      payload: result
    });
  } catch (e) {
    yield put({
      type: LOAD_PAYMNT_MAIN_SAVE_FAILURE,
      error: e,
    });
  }
}

function* watchSetPaymntMainSave() {
  yield takeLatest(LOAD_PAYMNT_MAIN_SAVE_REQUEST, setPaymntMainSave);
}

async function setPaymntHISSaveAPI(paramData) {
  console.log('paramData ====================>> ', paramData)
  const data = axios.post(API_URL + "/api/front_api/paymntHisSave", {
    compId: paramData.compId,
    paymntHis: paramData.paymntHis,
  })
  console.log('data ))) ', data);
  return data;
}

function* setPaymntHISSave(action) {
  try {
    const result = yield call(setPaymntHISSaveAPI, action.data);
    yield put({
      type: LOAD_PAYMNT_HIS_SAVE_SUCCESS,
      payload: result
    });
  } catch (e) {
    yield put({
      type: LOAD_PAYMNT_HIS_SAVE_FAILURE,
      error: e,
    });
  }
}

function* watchSetPaymntHISSave() {
  yield takeLatest(LOAD_PAYMNT_HIS_SAVE_REQUEST, setPaymntHISSave);
}

async function loadSSRPaymntListAPI (params) {
  const data =  await axios.get(API_URL + "/api/front_api/paymnts_lists", {
    params: {
      comp_nm_Ref_v: params.comp_nm_Ref_v,
      jungsan_date_Ref_v: params.jungsan_date_Ref_v,
      total_paymnt_amnt_Ref_v: params.total_paymnt_amnt_Ref_v,
      paymnt_method_Ref_v: params.paymnt_method_Ref_v,
      minus_amount_Ref_v: params.minus_amount_Ref_v,
      jungsan_amount_Ref_v: params.jungsan_amount_Ref_v,
      use_Ref_v: params.use_Ref_v,
      orderBy: params.orderBy,
      descasc: params.descasc
    }
  });
  return data;
}

function* loadSSRPaymntList(action) {
  try {
    const result = yield call(loadSSRPaymntListAPI, action.data);

    const editData =  result.data.map((data, idx) => {
      return idx >= 0 && idx < 1 * 5
          //? data.id === param.id ? {...data, editGbn: param.editGbn} : {...data, editGbn: false}
          ? {...data, editGbn: false}
          : null;
    }).filter((mapData) => {
      return mapData !== null && mapData !== "undifined" && mapData !== "";
    });

    yield put({
      type: LOAD_SSR_PAYMNT_LIST_SUCCESS,
      data: {templist: result.data, currlist: editData},
    });
  } catch (e) {
    yield put({
      type: LOAD_SSR_PAYMNT_LIST_FAILURE,
      error: e,
    });
  }
}

function* watchLoadSSRPaymntList() {
  yield takeLatest(LOAD_SSR_PAYMNT_LIST_REQUEST, loadSSRPaymntList);
}







export default function* paymntSaga() {
  yield all([
    fork(watchLoadPaymntList),
    fork(watchSetCurrPageList),
    fork(watchGetPaymntTotalCnt),
    fork(watchGetContentPerPage),
    fork(watchSetPageNum),
    fork(watchSetContentEditable),
    fork(watchSetTempPaymntList_Update),
    fork(watchSetMultiUpdate),
    fork(watchSetPaymntDataDelete),
    fork(watchSetPaymntDataMultiDelete),
    fork(watchSetTempInfo),
    fork(watchSetPaymntMainSave),
    fork(watchSetPaymntHISSave),
    fork(watchLoadSSRPaymntList),

  ]);
}
