import update from 'immutability-helper';
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

    SET_PAGENUM_SUCCESS,
    SET_PAGENUM_FAILURE,

    SET_CONTENT_EDITABLE_SUCCESS,
    SET_CONTENT_EDITABLE_FAILURE,

    SET_TEMPPAYMNTLIST_UPDATE_SUCCESS,
    SET_TEMPPAYMNTLIST_UPDATE_FAILURE,

    SET_MULTIUPDATE_SUCCESS,
    SET_MULTIUPDATE_FAILURE,

    SET_PAYMNTDATA_DELETE_REQUEST,
    SET_PAYMNTDATA_DELETE_SUCCESS,
    SET_PAYMNTDATA_DELETE_FAILURE,

    SET_PAYMNTDATA_MULTIDELETE_REQUEST,
    SET_PAYMNTDATA_MULTIDELETE_SUCCESS,
    SET_PAYMNTDATA_MULTIDELETE_FAILURE,

    LOGIN_SUCCESS,
    LOGIN_FAILURE,

    LOAD_PAYMNT_INFO_SUCCESS,
    LOAD_PAYMNT_INFO_FAILURE,

    LOAD_PAYMNT_MAIN_SAVE_SUCCESS,
    LOAD_PAYMNT_MAIN_SAVE_FAILURE, LOAD_SSR_PAYMNT_LIST_SUCCESS, LOAD_SSR_PAYMNT_LIST_FAILURE,

} from "../actions/types";
import {element} from "prop-types";




export const initialState = {
  tempPaymntList: [],
  totalListCnt: 0,
  contentCntPerPage: 5,
  pageNum: 1,
  currPageList: [],
  searchOption: null,
  paymntHis: [],
  user: null,
  isLoggedIn: false,
  info: null,
  his: null,
  file: null,
  dataLoad: false,


};


export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_PAYMNT_LIST_REQUEST: {
      return {
        ...state,
        tempPaymntList: [],
      };
    }
    case LOAD_PAYMNT_LIST_SUCCESS: {
      return {
        ...state,
        tempPaymntList: action.payload.list,
        //totalListCnt: action.payload.cnt,
      };
    }
    case LOAD_PAYMNT_LIST_FAILURE: {
      return {
        ...state,
      };
    }


    case LOAD_SSR_PAYMNT_LIST_SUCCESS:
      return {
          ...state,
          tempPaymntList: action.data.templist,
          currPageList: action.data.currlist,
      };
    case LOAD_SSR_PAYMNT_LIST_FAILURE:
      return {
          ...state,
          tempPaymntList: [],
          currPageList: [],
      };


    case SET_CURRPAGELIST_SUCCESS:
      return {
        ...state,
        currPageList: action.data,
      };

    case GET_TOTALCNT_SUCCESS:
      return {
        ...state,
        totalListCnt: action.payload.cnt,
      };
    case GET_TOTALCNT_FAILURE:
      return {
        ...state,
        totalListCnt: '0',
      };

    case GET_CONTENTCNT_PERPAGE_SUCCESS:
      return {
        ...state,
        contentCntPerPage: action.data,
      };
    case GET_CONTENTCNT_PERPAGE_FAILURE:
      return {
        ...state,
        contentCntPerPage: 0,
      };

    case SET_PAGENUM_SUCCESS:
      return {
        ...state,
        pageNum: action.data,
      };
    case SET_PAGENUM_FAILURE:
      return {
        ...state,
        pageNum: 1,
      };


    case SET_CONTENT_EDITABLE_SUCCESS:
        const currPageList_v = state.currPageList;
        const dataIndex = state.currPageList.findIndex(v => v.id === action.payload.id);
        const currData = state.currPageList[dataIndex];
        const updatedData = update(currData, {editGbn: {$set: action.payload.editGbn }});   // array.splice(start, deleteCount, item1)
        const newData = update(currPageList_v, {
            $splice: [[dataIndex, 1, updatedData]]
        });
        return {
            ...state,
            currPageList: newData,
        };
    case SET_CONTENT_EDITABLE_FAILURE:
      return {
        ...state,
        currPageList: state.currPageList
      };

    case SET_TEMPPAYMNTLIST_UPDATE_SUCCESS:
      const eleIndex = state.tempPaymntList.findIndex(ele => ele.id === action.data.id);
      let newArray = [...state.tempPaymntList];

      newArray[eleIndex] = {...newArray[eleIndex],
        id: action.data.id,
        jungsan_date: action.data.jungsan_date,
        total_paymnt_amnt: action.data.total_paymnt_amnt,
        minus_amount: action.data.minus_amount,
        jungsan_amount: action.data.jungsan_amount,
        paymnt_method: action.data.paymnt_method,
        use: action.data.use,
        editGbn: false,
        editVal: true
      };
      return {
        ...state,
        tempPaymntList: newArray
      };

    case SET_TEMPPAYMNTLIST_UPDATE_FAILURE:
      return {
        ...state,
        tempPaymntList: state.tempPaymntList
      };

    case SET_PAYMNTDATA_DELETE_SUCCESS:
      let tempPaymntList_v = state.tempPaymntList;
      let index = tempPaymntList_v.findIndex(v => v.id === action.payload)
      const newArr = update(tempPaymntList_v, {
        $splice: [[index, 1]]
      });

      return {
        ...state,
        tempPaymntList: newArr,
      };
    case SET_PAYMNTDATA_DELETE_FAILURE:
      return {
        ...state,
        tempPaymntList: state.tempPaymntList
      };

    case SET_PAYMNTDATA_MULTIDELETE_SUCCESS:
      let tmpTempPaymntList = state.tempPaymntList;
      let checkedArr = action.payload;
      let result = [];
      checkedArr.map((item, idx) => {
        let index = tmpTempPaymntList.findIndex(element => element.id === item.id)
        if(index > -1){
          result = tmpTempPaymntList.splice(
              tmpTempPaymntList.splice(index, 1)
          )
        }
      });

      return {
        ...state,
        tempPaymntList: result,
      };
    case SET_PAYMNTDATA_MULTIDELETE_FAILURE:
      return {
        ...state,
        tempPaymntList: state.tempPaymntList
      };

    case LOAD_PAYMNT_INFO_SUCCESS:
      return {
        ...state,
        info: action.payload.data.info[0],
        his: action.payload.data.his[0],
        file: action.payload.data.file[0],
        dataLoad: true,
      };
    case LOAD_PAYMNT_INFO_FAILURE:
      return {
        ...state,
        info: null,
        his: null,
        file: null,
        dataLoad: false,
      };

    case LOAD_PAYMNT_MAIN_SAVE_SUCCESS:
      return {
          ...state,
          dataLoad: false,
      };
    case LOAD_PAYMNT_MAIN_SAVE_FAILURE:
      return {
          ...state,
          dataLoad: false,
      };






    default:
      return state;
  }
}
