import React, {useState, useEffect, useRef, useCallback, useMemo} from "react";
import { useHistory } from 'react-router-dom';
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from "react-redux";
import { confirmAlert } from 'react-confirm-alert';
import DatePicker from "react-datepicker";
import moment from "moment"
import Pagenation from "../components/Pagenation";
import {
    LOAD_PAYMNT_LIST_REQUEST,
    SET_CURRPAGELIST_REQUEST,
    GET_TOTALCNT_REQUEST,
    GET_CONTENTCNT_PERPAGE_REQUEST,
    SET_CONTENT_EDITABLE_REQUEST,
    SET_TEMPPAYMNTLIST_UPDATE_REQUEST,
    SET_MULTIUPDATE_REQUEST,
    SET_PAYMNTDATA_DELETE_REQUEST,
    SET_PAYMNTDATA_MULTIDELETE_REQUEST,
    LOAD_SSR_PAYMNT_LIST_REQUEST,
    SET_SSR_USER_REQUEST,
    SET_SSR_USER2_REQUEST,

} from "../actions/types";
import Rows from "../components/Rows";
import wrapper from '../store/configureStore';
import axios from 'axios';
import { END } from 'redux-saga';
import { getServerCookieValue } from '../utils/cookie';



const Index = () => {
    const { tempPaymntList, totalListCnt, contentCntPerPage, pageNum, currPageList } = useSelector(state => state.paymnt);
    const { user: currentUser } = useSelector((state) => state.auth);

    const [searchResultCnt, setSearchResultCnt] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(false);
    const [total_paymnt_amnt_value_bak, setTotal_paymnt_amnt_value_bak]  = useState([]);
    const [checkbxArr, setCheckbxArr] = useState([]);
    const [pageNation, setPageNation] = useState(false);

    const comp_nm_Ref = useRef("");
    const jungsan_date_Ref = useRef("");
    const total_paymnt_amnt_Ref = useRef("");
    const paymnt_method_Ref = useRef("");
    const minus_amount_Ref = useRef("");
    const jungsan_amount_Ref = useRef("");
    const use_Ref = useRef("");
    const orderbyRef = useRef('');
    const descascRef = useRef('');

    const contentCntPerPageRef = useRef("");
    const jungsan_date = useRef([]);
    const total_paymnt_amnt = useRef([]);
    const minus_amount = useRef([]);
    const jungsan_amount = useRef([]);
    const paymnt_method = useRef([]);
    const use = useRef([]);

    const dispatch = useDispatch();
    const router = useRouter();




    useEffect(() => {
        if (search === true){
            try {
                let comp_nm_Ref_v = comp_nm_Ref.current.value;
                let jungsan_date_Ref_v = jungsan_date_Ref.current.value;
                let total_paymnt_amnt_Ref_v = total_paymnt_amnt_Ref.current.value;
                let paymnt_method_Ref_v = paymnt_method_Ref.current.value;
                let minus_amount_Ref_v = minus_amount_Ref.current.value;
                let jungsan_amount_Ref_v = jungsan_amount_Ref.current.value;
                let use_Ref_v = use_Ref.current.value;
                let orderBy = orderbyRef.current.value;
                let descasc = descascRef.current.value;


                new Promise(function(resolve, reject) {
                    dispatch({
                        type: LOAD_PAYMNT_LIST_REQUEST,
                        data: {
                            comp_nm_Ref_v: comp_nm_Ref_v,
                            jungsan_date_Ref_v: jungsan_date_Ref_v,
                            total_paymnt_amnt_Ref_v: total_paymnt_amnt_Ref_v,
                            paymnt_method_Ref_v: paymnt_method_Ref_v,
                            minus_amount_Ref_v: minus_amount_Ref_v,
                            jungsan_amount_Ref_v: jungsan_amount_Ref_v,
                            use_Ref_v: use_Ref_v,
                            orderBy: orderBy,
                            descasc: descasc
                        }
                    });
                    resolve('success');
                })
                    .then(() => {
                        dispatch({
                            type: GET_TOTALCNT_REQUEST
                        });
                    })
                    .catch(() => {
                        setLoading(false);
                        reject('failure');
                    })
                    .finally(() =>{
                        getCurrPageList();
                        setLoading(true);
                    });

            }catch(e){
                console.log(e);
            }
            setLoading(false);
            setSearch(false);
        }
    }, [
        search === true,
    ]);


    const getCurrPageList = useCallback(() => {
        try {
            setSearchResultCnt(tempPaymntList.length);

            const currIndex = (pageNum - 1) * contentCntPerPage;
            const editData =  tempPaymntList.map((data, idx) => {
                return idx >= currIndex && idx < pageNum * contentCntPerPage
                    //? data.id === param.id ? {...data, editGbn: param.editGbn} : {...data, editGbn: false}
                    ? {...data, editGbn: false}
                    : null;
            }).filter((mapData) => {
                return mapData !== null && mapData !== "undifined" && mapData !== "";
            });

            // return editData;
            dispatch({
                type: SET_CURRPAGELIST_REQUEST,
                payload: editData
            });

            // pageNation
            setPageNation(true)
        }catch(e){
            console.log(e);
        }
        setSearch(false);
    }, [
        //loading === true,
        tempPaymntList,
        pageNum,
        contentCntPerPage
    ]);


    useEffect(() => {
        getCurrPageList();    //useCallback 으로 최신값을 호출  //Redux > Store > State를 Dependence 추가경우 잗동 안됨
    },[
        loading === true,
        tempPaymntList,
        pageNum,
        contentCntPerPageRef.current.value,
    ]);


    const handle_paymntList_Search = (e) => {
        setSearch(true);
    }


    const handle_change_contentCntPerPage = useCallback(() => {
        dispatch({
            type: GET_CONTENTCNT_PERPAGE_REQUEST,
            payload: contentCntPerPageRef.current.value
        });
    },[
        contentCntPerPageRef.current.value
    ]);

    const handle_click_Editable = useCallback((id, editable) => {
        dispatch({
            type: SET_CONTENT_EDITABLE_REQUEST,
            payload: {id: id, editGbn: editable }
        });
    },[]);


    const handle_keypress_totalPaymntAmnt = (e, param) => {
        if (! (/([0-9])/g.test(e.key) || (e.key === "Delete" || e.key === "Backspace") || (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) )) {
            e.preventDefault();
        }
    }


    // const img_in_remove = useCallback(
    //     (file_index_num) => () => {
    //         const file_remove_arr_file = Array.prototype.slice.call(file_in_name);
    //         [].filter.call(file_in_name, (c) => {
    //             file_remove_arr_file.indexOf(c) === file_index_num &&
    //             setFile_remove(
    //                 file_remove_arr_file.splice(
    //                     file_remove_arr_file.splice(file_remove_arr_file.indexOf(c), 1)
    //                 )
    //             );
    //         });
    //     },
    //     [file_in_name, file_remove]
    // );


    const handle_click_totalPaymntAmnt = (e, param) => {
        const elemntIndex = total_paymnt_amnt_value_bak.findIndex(elemnt => elemnt.id === param.id);
        console.log('param.id, elemntIndex - ', param.id +', '+ elemntIndex);

        if (elemntIndex < 0 ){
            setTotal_paymnt_amnt_value_bak((total_paymnt_amnt_value_bak) => [
                ...total_paymnt_amnt_value_bak, {
                    id: param.id,
                    value: param.value
                }
            ]);
        }else{
            let newArray = [...total_paymnt_amnt_value_bak];
            newArray[elemntIndex] = {...newArray[elemntIndex], value: param.value};
            setTotal_paymnt_amnt_value_bak(newArray);
        }
    }


    const handle_blur_totalPaymntAmnt = useCallback((e, param) => {
        let total_paymnt_amnt_value = document.querySelector('#total_paymnt_amnt_'+param.id).value;
        let minus_amount_value = document.querySelector('#minus_amount_'+param.id).value;
        let total_paymnt_amnt_select_bak = Array.prototype.slice.call(total_paymnt_amnt_value_bak).filter(v => v.id === param.id);

        if (Number(total_paymnt_amnt_value) < Number(minus_amount_value)){
            total_paymnt_amnt.current[param.id].value = total_paymnt_amnt_select_bak[0].value;
            document.querySelector('#total_paymnt_amnt_'+param.id).select();
        }
        console.log('total_paymnt_amnt_value, minus_amount_value -> ', total_paymnt_amnt_value +','+ minus_amount_value);
        console.log('total_paymnt_amnt_value_bak -> ', total_paymnt_amnt_value_bak);
        console.log('total_paymnt_amnt_select_bak -> ', total_paymnt_amnt_select_bak[0].value);
    },[
        total_paymnt_amnt_value_bak,
    ]);


    const handle_click_Update = useCallback((e, param) => {
        //e.preventDefault();

        //alert('param - '+ param.id);
        let total_paymnt_amnt_value = document.querySelector('#total_paymnt_amnt_'+param.id).value;
        let minus_amount_value = document.querySelector('#minus_amount_'+param.id).value;
        let total_paymnt_amnt_select_bak = Array.prototype.slice.call(total_paymnt_amnt_value_bak).filter(v => v.id === param.id);

        if (Number(total_paymnt_amnt_value) < Number(minus_amount_value)){
            total_paymnt_amnt.current[param.id].value = total_paymnt_amnt_select_bak[0].value;
            document.querySelector('#total_paymnt_amnt_'+param.id).select();
        }else{
            jungsan_amount.current[param.id].value = Number(total_paymnt_amnt.current[param.id].value) - Number(minus_amount.current[param.id].value)

            //currPageList에 임시저장된 jungsan_date값 가져오기
            const elemntIndex = currPageList.findIndex(elemnt => elemnt.id === param.id);
            let newArray = [...currPageList];

            //console.log('elemntIndex, param.id ----> ', elemntIndex.toString()+', '+param.id.toString())
            confirmAlert({
                title: 'Confirm to Update',
                message: 'Are you sure to do this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => {
                            set_paymntList_Update(
                                param.id,
                                newArray[elemntIndex].jungsan_date,
                                total_paymnt_amnt.current[param.id].value,
                                minus_amount.current[param.id].value,
                                jungsan_amount.current[param.id].value,
                                paymnt_method.current[param.id].value,
                                use.current[param.id].value
                            )

                        }
                    },
                    {
                        label: 'No',
                    }
                ]
            });
        }
    },[
        total_paymnt_amnt_value_bak,
        currPageList
    ]);


    const set_paymntList_Update = (
        id,
        jungsan_date,
        total_paymnt_amnt,
        minus_amount,
        jungsan_amount,
        paymnt_method,
        use
    ) => {
        try{
            const params = {
                id: id,
                jungsan_date: jungsan_date,
                total_paymnt_amnt: total_paymnt_amnt,
                minus_amount: minus_amount,
                jungsan_amount: jungsan_amount,
                paymnt_method: paymnt_method,
                use: use
            }

            dispatch({
                type: SET_TEMPPAYMNTLIST_UPDATE_REQUEST,
                payload: params
            });
            setLoading(true);
        }
        catch(e){
            setLoading(false);
        }
    }


    const handle_click_Delete = (e, param) => {
        alert('param.id > ', param.id)
        try {
            return new Promise(function(resolve, reject) {
                dispatch({
                    type: SET_PAYMNTDATA_DELETE_REQUEST,
                    payload: param
                });
                resolve('success');
            })
                .then(() => {
                    setLoading(true);
                })
                .catch(() => {
                    setLoading(false);
                });
        }catch(e){
            console.log(e);
        }
        setLoading(false);
    }


    const handle_paymntList_multiDelete = (e) => {
        checkbxArr.length > 0 && confirmAlert({
            title: 'Confirm to Update',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => handle_paymntList_multiDelete_proc(
                        checkbxArr
                    )
                },
                {
                    label: 'No',
                }
            ]
        })
    }


    const handle_paymntList_multiDelete_proc = (checkbxArr) => {
        try {
            return new Promise(function(resolve, reject) {
                dispatch({
                    type: SET_PAYMNTDATA_MULTIDELETE_REQUEST,    //setPaymntsDataMultiDelete
                    payload: checkbxArr
                });
                resolve('success');
            })
                .then(() => {
                    //setLoading(true);
                })
                .catch(() => {
                    setLoading(false);
                });

        }catch(e){
            console.log(e);
        }
        setSearch(false);
    }


    const handle_click_checkbx_all = useCallback((e) => {
        let paymnt_chkbx_all = document.querySelector('#paymnt_chkbx_all');

        if (paymnt_chkbx_all.checked === true) {
            setCheckbxArr([]);
            currPageList.map((item, index) => {
                setCheckbxArr((checkbxArr) => [
                    ...checkbxArr, {
                        id: item.id
                    }
                ])
                document.querySelector('#paymnt_chkbx_' + item.id).checked = true;
            })
        }else {
            setCheckbxArr([]);
            currPageList.map((item, index) => {
                document.querySelector('#paymnt_chkbx_' + item.id).checked = false;
            })
        }
    },[]);


    const handle_click_checkbx = useCallback((e, param) => {
        let paymnt_chkbx = document.querySelector('#paymnt_chkbx_'+param.id);
        //console.log('param.id, paymnt_chkbx.checked - ', param.id +', '+ paymnt_chkbx.checked)

        paymnt_chkbx.checked === true && checkbxArr.includes(param.id) === false ?
            setCheckbxArr((checkbxArr) => [
                ...checkbxArr, {
                    id: param.id
                }
            ])
            : setCheckbxArr(
            Array.prototype.slice.call(checkbxArr).filter(value => value.id !== param.id)
            )
        document.querySelector('#paymnt_chkbx_all').checked = false;
    },[
        checkbxArr,
    ]);


    const handle_change_date = useCallback((date, param) => {
        console.log('date, param.id - ', date +', '+ param.id);
        jungsan_date.current[param.id].value = date;

        const elemntIndex = currPageList.findIndex(elemnt => elemnt.id === param.id);
        let newArray = [...currPageList];
        console.log('newArray -> ', newArray );
        newArray[elemntIndex] = {...newArray[elemntIndex], editGbn: true, jungsan_date: date,  };

        dispatch({
            type: SET_CURRPAGELIST_REQUEST,
            payload: newArray
        });
    }, [
        currPageList
    ]);


    useEffect(() => {
        Array.prototype.slice.call(currPageList).map((item, idx) => {
            jungsan_date.current[item.id] = jungsan_date.current[item.id] || React.createRef();
            total_paymnt_amnt.current[item.id] = total_paymnt_amnt.current[item.id] || React.createRef();
            minus_amount.current[item.id] = minus_amount.current[item.id] || React.createRef();
            jungsan_amount.current[item.id] = jungsan_amount.current[item.id] || React.createRef();
            paymnt_method.current[item.id] = paymnt_method.current[item.id] || React.createRef();
            use.current[item.id] = use.current[item.id] || React.createRef();
        });
    },[
        currPageList
    ]);


    const handle_change_orderby = () => {
        setPageNation(true);
        setSearch(true);
    }


    const  handle_click_toDescPage = useCallback((e, id) => {
        if (!currentUser) {
            router.push('/login');
        }else{
            router.push(`/detail/${id}`);
        }
    },[]);


    const  handle_click_toCompDescPage = useCallback((e, cd) => {
        // if (!currentUser) {
        //     router.push('/login');
        // }else{
        //     router.push(`/comp/${cd}`);
        // }
        router.push(`/comp/${cd}`);
    },[]);


    const handle_paymntList_multiUpdate = (e) => {
        const resultArr = currPageList.map((ele, index) => {
            return ele.editVal === true && ele;
        }).filter((item) => {
            return item !== null && item !== false
        })

        if (resultArr.length > 0) {
            try {
                dispatch({
                    type: SET_MULTIUPDATE_REQUEST,
                    payload: resultArr
                });
            }catch(e){
                console.log(e);
            }
        }
    }


    useEffect(() => {
        setLoading(false);

        console.log('loading - ',loading);
        console.log('currPageList - ',currPageList);
        console.log('checkbxArr - ', checkbxArr);
        console.log('comp_nm_Ref.current.value - ', comp_nm_Ref.current.value);
        console.log('jungsan_date_Ref.current.value - ', jungsan_date_Ref.current.value);
        console.log('total_paymnt_amnt_Ref.current.value - ', total_paymnt_amnt_Ref.current.value);
        console.log('paymnt_method_Ref.current.value - ', paymnt_method_Ref.current.value);
        console.log('minus_amount_Ref.current.value - ', minus_amount_Ref.current.value);
        console.log('jungsan_amount_Ref.current.value - ', jungsan_amount_Ref.current.value);
        console.log('use_Ref.current.value - ', use_Ref.current.value);


    }, [
        currPageList,

    ]);


    const currPageList_v = React.useMemo(() => currPageList, [currPageList]);
    //const currPageList_v = currPageList;


    return(
        <div>
            <div className="container" style={{ width: '1000px', textAlign:'center', }}>
                <div className="tb_select_wrap left_profile_box" style={{ paddingTop: '15px', paddingBottom: '20px', }}>
                    <form>
                        <div className='left_profile_box table_select_box'>
                            <input type="text" name="comp_nm" id="comp_nm" className="width60" placeholder="회사명" defaultValue={comp_nm_Ref.current.value} ref={comp_nm_Ref} />
                            <input type="text" name="jungsan_date" id="jungsan_date" className="width60" placeholder="정산일" defaultValue={jungsan_date_Ref.current.value}  ref={jungsan_date_Ref}  />
                            <input type="text" name="total_paymnt_amnt" id="total_paymnt_amnt" className="width60" placeholder="총결제금액" defaultValue={total_paymnt_amnt_Ref.current.value}  ref={total_paymnt_amnt_Ref} />
                            <select
                                as="select"
                                className="table_select tb_select"
                                className="width60"
                                defaultValue={paymnt_method_Ref.current.value}
                                ref={paymnt_method_Ref}
                            >
                                <option value={``}>결제수단</option>
                                <option value={`C`}>카드</option>
                                <option value={`P`}>포인트</option>
                            </select>
                            <input type="text" name="minus_amount" id="minus_amount" className="width60" placeholder="수수료" defaultValue={minus_amount_Ref.current.value}  ref={minus_amount_Ref} />
                            <input type="text" name="jungsan_amount" id="jungsan_amount" className="width60" placeholder="정산금액" defaultValue={jungsan_amount_Ref.current.value}  ref={jungsan_amount_Ref} />
                            <select
                                as="select"
                                className="table_select tb_select"
                                className="width60"
                                defaultValue={use_Ref.current.value}
                                ref={use_Ref}
                            >
                                <option value={``}>계약여부</option>
                                <option value={`Y`}>계약</option>
                                <option value={`N`}>해지</option>
                            </select>
                            <input type="button" name="searchBtn" id="searchBtn" value={`검색`} className="width60" onClick={(e) => handle_paymntList_Search(e)} />
                        </div>
                    </form>
                </div>


                <div className="tb_select_wrap left_profile_box topMargin">
                    <div className='left_profile_box'>[총 <p className="number_data">{totalListCnt}</p>건 / 검색결과 <p className="number_data">{searchResultCnt}</p>건]</div>
                    <div className='table_select_box'>
                        <select
                            as="select"
                            className="table_select tb_select"
                            onChange={handle_change_orderby}
                            ref={orderbyRef}
                            //defaultValue={orderbyRef.current.value}
                        >
                            <option value={``}>정렬 구분</option>
                            <option value={`id`}>번호 순</option>
                            <option value={`jungsan_date`}>정산일 순</option>
                            <option value={`jungsan_amount`}>정산금액 순</option>
                            <option value={`minus_amount`}>수수료 순</option>
                            <option value={`total_paymnt_amnt`}>총 결제금액 순</option>
                        </select>
                        <select
                            as="select"
                            className="table_select tb_select"
                            onChange={handle_change_orderby}
                            ref={descascRef}
                            //defaultValue={descascRef.current.value}
                        >
                            <option value={``}>정렬 조건</option>
                            <option value={`ASC`}>오름차순</option>
                            <option value={`DESC`}>내림차순</option>
                        </select>
                        <select
                            as="select"
                            className="list_select tb_select"
                            onChange={handle_change_contentCntPerPage}
                            ref={contentCntPerPageRef}
                            defaultValue={contentCntPerPage}
                        >
                            <option value={0} >목록</option>
                            <option value={5} >5</option>
                            <option value={10} >10</option>
                            <option value={15} >15</option>
                            <option value={20} >20</option>
                            <option value={30} >30</option>
                        </select>
                    </div>
                </div>

                <div className="bottom-padding-50">
                    <table  className="border-table">
                        <thead className="theadBackground  height-35">
                        <tr>
                            <th style={{width:'10px',}}>
                                <input type="checkbox" id={`paymnt_chkbx_all`} value={'all'} onClick={(e)=> handle_click_checkbx_all(e)}/>
                            </th>
                            <th style={{width:'10px',}}>번호</th>
                            <th>회사명</th>
                            <th>정산일</th>
                            <th>총결제금액</th>
                            <th>결제수단</th>
                            <th>수수료</th>
                            <th>정산금액</th>
                            <th>계약</th>
                            <th className="width20" >
                                수정|삭제
                            </th>
                        </tr>
                        </thead>
                        <tbody style={{ alignContent: "center", }}>
                        {
                            currPageList_v.map((item, index) => {
                                if(item.editGbn === false) {
                                    //return React.useMemo(() => <Component {...props} />, Object.keys(props).map(key => props[key]));

                                    return (
                                        <Rows
                                            item={item}
                                            handle_click_checkbx={handle_click_checkbx}
                                            handle_click_toDescPage={handle_click_toDescPage}
                                            handle_click_Editable={handle_click_Editable}
                                            handle_click_Delete={handle_click_Delete}
                                            handle_click_toCompDescPage={handle_click_toCompDescPage}
                                            key={index}
                                        />
                                    )

                                }else{
                                    return(
                                        <tr  key={index}>
                                            <td>
                                                <input type="checkbox" id={`paymnt_chkbx_${item.id}`} value={item.id} onClick={(e)=> handle_click_checkbx(e,{id: item.id})} />
                                            </td>
                                            <td style={{cursor:"pointer", }} onClick={(e) => handle_click_toDescPage(e, item.id)}>{item.id}</td>
                                            <td style={{cursor:"pointer", }} onClick={(e) => handle_click_toCompDescPage(e, item.comp_cd)}>{item.comp_nm}</td>
                                            <td  style={{fontSize:'15px', width: '100px'}}>
                                                <div className="customDatePickerWidth">
                                                    <DatePicker
                                                        id={`jungsan_date_${item.id}`} name={`jungsan_date_${item.id}`}
                                                        ref={(el) => (jungsan_date.current[item.id] = el)}
                                                        selected={moment(item.jungsan_date).toDate()}
                                                        dateFormat="yyyyMMdd"
                                                        style={{ 'text-align': 'center', }}
                                                        //onSelect={handleDateSelect} //when day is clicked
                                                        onChange={(date) => handle_change_date(moment(date).format('YYYYMMDD'),{id: item.id})}   // when value has changed
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <input type="text" id={`total_paymnt_amnt_${item.id}`} name={`total_paymnt_amnt_${item.id}`} defaultValue={item.total_paymnt_amnt} style={{width: '100%', height: '100%', }}
                                                       onKeyPress={(e) => handle_keypress_totalPaymntAmnt(e,{id: item.id, value: item.total_paymnt_amnt})}
                                                       onBlur={(e) => handle_blur_totalPaymntAmnt(e, {id: item.id})}
                                                       onClick={(e) => handle_click_totalPaymntAmnt(e,{id: item.id, value: item.total_paymnt_amnt})}
                                                       ref={(el) => (total_paymnt_amnt.current[item.id] = el)}
                                                />
                                            </td>
                                            <td>
                                                <div className="th_double_wrap left_profile_box">
                                                    <select
                                                        as="select"
                                                        className="list_select tb_select"
                                                        style={{width: '100%', }}
                                                        //onChange={() => handle_change_paymnt_method(item.id)}
                                                        defaultValue={item.paymnt_method}
                                                        id={`paymnt_method_${item.id}`}
                                                        ref={(el) => (paymnt_method.current[item.id] = el)}
                                                    >
                                                        <option value='C'>카드</option>
                                                        <option value='P'>포인트</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td>
                                                <input type="text" id={`minus_amount_${item.id}`} name={`minus_amount_${item.id}`} defaultValue={item.minus_amount} style={{width: '100%', height: '100%', }}
                                                       ref={(el) => (minus_amount.current[item.id] = el)}
                                                />
                                            </td>
                                            <td>
                                                <input type="text" id={`jungsan_amount_${item.id}`} name={`jungsan_amount_${item.id}`} defaultValue={item.jungsan_amount} style={{width: '100%', height: '100%', }}
                                                       ref={(el) => (jungsan_amount.current[item.id] = el)}
                                                />
                                            </td>
                                            <td>
                                                <select
                                                    as="select"
                                                    className="list_select tb_select"
                                                    style={{width: '100%', }}
                                                    //onChange={() => handle_change_use(item.id)}
                                                    defaultValue={item.use}
                                                    id={`use_${item.id}`}
                                                    ref={(el) => (use.current[item.id] = el)}
                                                >
                                                    <option value='Y'>계약</option>
                                                    <option value='N'>해지</option>
                                                </select>
                                            </td>
                                            <td className="width20">
                                                <div className="th_double_wrap left_profile_box">
                                                    <p style={{cursor: "pointer", color: "black", }} onClick={() => handle_click_Editable(item.id, false)}>취소</p>
                                                    <p style={{cursor: "pointer", color: "black", }} onClick={(e) => handle_click_Update(e,{id: item.id})}>수정</p>
                                                    <p style={{cursor: "pointer", color: "red", }} onClick={(e) => handle_click_Delete(e,{id: item.id})}>삭제</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }
                            })
                        }

                        <tr style={{ height: '30px', }}>
                            {
                                <Pagenation loading={loading} search={search} pageNation={pageNation} setPageNation={setPageNation}/>
                            }
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div style={{ marginTop: '-35px', paddingBottom: '0px', width: '930px', textAlign: "right",  }}>
                    <form>
                        <div style={{ float:'right',}}>
                            <input type="button" name="multiUpdateBtn" id="multiUpdateBtn" value={`일괄저장`} className="width60" onClick={(e) => handle_paymntList_multiUpdate(e)} />
                        </div>
                        <div style={{ float:'right',}}>
                            <input type="button" name="multiDeleteBtn" id="multiDeleteBtn" value={`일괄삭제`} className="width60" onClick={(e) => handle_paymntList_multiDelete(e)} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (context.req && cookie) {
        axios.defaults.headers.Cookie = cookie;
    }

    // const username_ck = cookie?.split(';').find(c => c.trim().startsWith(`${'username'}=`));
    // const email_ck = cookie?.split(';').find(c => c.trim().startsWith(`${'email'}=`));
    // const token_ck = cookie?.split(';').find(c => c.trim().startsWith(`${'token'}=`));
    // const roles_ck = cookie?.split(';').find(c => c.trim().startsWith(`${'roles'}=`));
    //
    // const username_v = username_ck ? getServerCookieValue('username', context.req) : null
    // const email_v = email_ck ? getServerCookieValue('email', context.req) : null
    // const token_v  = token_ck ? getServerCookieValue('token', context.req) : null
    // const roles_v = roles_ck ? getServerCookieValue('roles', context.req) : null

    try {
        // username, email, token, roles
        // if (username_v && email_v && token_v && roles_v){
        //     context.store.dispatch({
        //         type: SET_SSR_USER_REQUEST,
        //         data: {username: username_v, email: email_v, token: token_v, roles: roles_v}
        //     });
        // }

        if (cookie){
            context.store.dispatch({
                type: SET_SSR_USER2_REQUEST
            });
        }

        context.store.dispatch({
            type: LOAD_SSR_PAYMNT_LIST_REQUEST,
            data: {
                comp_nm_Ref_v: '',
                jungsan_date_Ref_v: '',
                total_paymnt_amnt_Ref_v: '',
                paymnt_method_Ref_v: '',
                minus_amount_Ref_v: '',
                jungsan_amount_Ref_v: '',
                use_Ref_v: '',
                orderBy: '',
                descasc: '',
            }
        });

        context.store.dispatch({
            type: GET_TOTALCNT_REQUEST
        });

        context.store.dispatch(END);
        await context.store.sagaTask.toPromise();
    }catch(e){
        console.log(e);
    }
});


export default Index;