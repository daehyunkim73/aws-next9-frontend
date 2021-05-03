import update from 'immutability-helper';
import {
    LOAD_COMP_INFO_REQUEST,
    LOAD_COMP_INFO_SUCCESS,
    LOAD_COMP_INFO_FAILURE,

} from "../actions/types";
import {element} from "prop-types";




export const initialState = {
    comp: null,
    dataLoad: false,


};


export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {

        case LOAD_COMP_INFO_SUCCESS:
            return {
                ...state,
                comp: action.payload.data.info[0],
                dataLoad: true,
            };
        case LOAD_COMP_INFO_FAILURE:
            return {
                ...state,
                comp: null,
                dataLoad: false,
            };

        default:
            return state;
    }
}
