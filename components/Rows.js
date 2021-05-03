import React, {useState, useEffect, useRef, useCallback, useMemo} from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";


const Rows = (props) => {
    const {
        // item_id,
        // item_comp_nm,
        // item_jungsan_date,
        // item_total_paymnt_amnt,
        // item_paymnt_method,
        // item_minus_amount,
        // item_jungsan_amount,
        // item_use,
        item,
        handle_click_checkbx,
        handle_click_toDescPage,
        handle_click_Editable,
        handle_click_Delete,
        handle_click_toCompDescPage,
    } = props;

    const item_v = React.useMemo(() => props.item, [props.item]);

    return (
        <tr>
            <td>
                <input type="checkbox" id={`paymnt_chkbx_${item_v.id}`} value={item_v.id} onClick={(e)=> handle_click_checkbx(e,{id: item_v.id})}/>
            </td>
            <td style={{cursor:"pointer", }} onClick={(e) => handle_click_toDescPage(e, item_v.id)}>{item_v.id}</td>
            <td style={{cursor:"pointer", }} onClick={(e) => handle_click_toCompDescPage(e, item.comp_cd)}>{item_v.comp_nm}</td>
            <td  style={{fontSize:'15px', width: '200px'}}>{moment(item_v.jungsan_date).format('YYYY.MM.DD')}</td>
            <td>{item_v.total_paymnt_amnt}</td>
            <td>
                <div className="th_double_wrap left_profile_box">
                    <p>{
                        item_v.paymnt_method === 'C' && '카드'
                        || item_v.paymnt_method === 'P' && '포인트'
                    }</p>
                </div>
            </td>
            <td>{item_v.minus_amount}</td>
            <td>{item_v.jungsan_amount}</td>
            <td>
                <div>{
                    item_v.use === 'Y' && '계약'
                    || item_v.use === 'N' && '해지'
                }</div>
            </td>
            <td className="width20">
                <div className="th_double_wrap left_profile_box">
                    <p style={{cursor: "pointer", color: "silver", }} onClick={() => handle_click_Editable(item_v.id, true)}>변경</p>
                    <p style={{cursor: "", color: "silver", }}>수정</p>
                    <p style={{cursor: "pointer", color: "red", }}  onClick={(e) => handle_click_Delete(e, {id: item_v.id})}>삭제</p>
                </div>
            </td>
        </tr>
    )
}


//export default Rows;
export default React.memo(Rows);



