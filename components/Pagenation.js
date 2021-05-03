import React, {useState, useEffect, useRef, useCallback} from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { SET_PAGENUM_REQUEST } from "../actions/types";


const Pagenation = (props) => {

    const [startPageNum, setStartPageNum] = useState(0);
    const [endPageNum, setEndPageNum] = useState(0);
    const [totalPageArr, setTotalPageArr] = useState([]);
    const [totalPageCount, setTotalPageCount] = useState(0);
    const {tempPaymntList, totalListCnt, contentCntPerPage, pageNum} = useSelector(state => state.paymnt);
    const dispatch = useDispatch();
    //const tempArr = [1, 2, 3];


    useEffect(() => {
            //const totalPageCount_v = Math.ceil(Number(totalListCnt) / Number(contentCntPerPage));
            const totalPageCount_v = Math.ceil(Number(tempPaymntList.length) / Number(contentCntPerPage));
            const currBlock_v = Math.ceil(Number(pageNum) / Number(10));
            const startPageNum_v = ( (Number(currBlock_v) - 1) * Number(10) ) + 1;
            const endPageNum_v = (Number(startPageNum_v) + Number(10) - 1) >= Number(totalPageCount_v) ? Number(totalPageCount_v) : (Number(startPageNum_v) + Number(10) - 1);
            const totalPageArr_v = _.range(startPageNum_v, endPageNum_v + 1);

            setTotalPageCount(totalPageCount_v);
            setStartPageNum(startPageNum_v);
            setEndPageNum(endPageNum_v);
            setTotalPageArr(totalPageArr_v);
            console.log('pageNum -> ', pageNum);
            props.setPageNation(false);
        },
        [
            pageNum,
            totalListCnt,
            contentCntPerPage,
            props.loading === true,
            props.pageNation === true,
        ]);


    const handle_click_pageNum = (newPageNum) => {
        dispatch({
            type: SET_PAGENUM_REQUEST,
            payload: newPageNum
        });
    };


    const handle_click_pageMove = (moveGbn) => {
        if (moveGbn === 'first'){
            dispatch({
                type: SET_PAGENUM_REQUEST,
                payload: 1
            });
        }else if (moveGbn === 'prev'){
            dispatch({
                type: SET_PAGENUM_REQUEST,
                payload: pageNum <= 1 ? 1 : pageNum - 1
            });
        }else if (moveGbn === 'next'){
            dispatch({
                type: SET_PAGENUM_REQUEST,
                payload: pageNum < totalPageCount ? pageNum + 1 : totalPageCount
            });
        }else if (moveGbn === 'last'){
            dispatch({
                type: SET_PAGENUM_REQUEST,
                payload: totalPageCount
            });
        }
    }


    useEffect(() => {
        console.log('startPageNum -> ', startPageNum);
        console.log('endPageNum -> ', endPageNum);
        console.log('totalPageArr -> ', totalPageArr);
        console.log('totalPageCount -> ', totalPageCount);
    },[
    ])


    return (
            <td colSpan={10}  >
                <div className="align_content_center" style={{ backgroundColor: "silver", height: '30px' }}>
                    <p style={{marginTop: '15px', marginRight: '10px', cursor: "pointer", }}  onClick={() => handle_click_pageMove('first')}>처음</p>
                    <p style={{marginTop: '15px', marginRight: '10px', cursor: "pointer", }}  onClick={() => handle_click_pageMove('prev')}>이전</p>
                    {
                        Array.prototype.slice.call(totalPageArr).map((item, index) => {
                            const fontColor_v = (pageNum === item ? 'blue' : 'gray');
                            const fontBold_v = (pageNum === item ? 'bold' : '');
                            return (
                                <p key={index} style={{color: fontColor_v, fontWeight: fontBold_v, marginTop: '15px', marginRight: '10px', cursor: "pointer",  }}  onClick={() => handle_click_pageNum(item)}>
                                    {item}
                                </p>
                            )
                        })
                    }
                    <p style={{marginTop: '15px', marginRight: '10px', cursor: "pointer", }}  onClick={() => handle_click_pageMove('next')}>다음</p>
                    <p style={{marginTop: '15px', marginRight: '10px', cursor: "pointer", }}  onClick={() => handle_click_pageMove('last')}>마지막</p>
                </div>
            </td>
    );
};

export default Pagenation;
