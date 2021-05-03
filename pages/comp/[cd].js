import React, {useState, useRef, useCallback, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { useRouter } from 'next/router'
import {
    LOAD_COMP_INFO_REQUEST,
    SET_SSR_USER2_REQUEST,
} from "../../actions/types";

import SsrCookie from "ssr-cookie";
import wrapper from "../../store/configureStore";
import axios from "axios";
import {END} from "redux-saga";
import {getServerCookieValue} from "../../utils/cookie";
import { siteUrl } from '../../config/config'
import AppLayout from '../../components/AppLayout';
import Head from 'next/head';




const Comp = () => {
    const [successGbn, setSuccessGbn] = useState(false);
    const { comp: compInfo, dataLoad } = useSelector((state) => state.comp);
    const { user: currentUser,  isLoggedIn} = useSelector((state) => state.auth);
    // comp_cd, comp_nm, comp_tel, use, ceo_nm, addr, addr_desc, fax, img

    const cookie = new SsrCookie();
    const dispatch = useDispatch();
    const router = useRouter();
    const {cd} = router.query;


    //useEffect(()=>{
    //    console.log('isLoggedIn -------->>>>>>>>>> ', isLoggedIn )
    //    if (!isLoggedIn) {
    //        router.push('/');
    //    }
    //},[
    //    isLoggedIn
    //])


    useEffect(() => {
        console.log('cd  ----------->>>>>>>>>> ', cd);
        try{
            new Promise(async function(resolve, reject) {
                const access_token = cookie.get('token') || '';
                await dispatch({
                    type: LOAD_COMP_INFO_REQUEST,
                    data: {cd: cd, token: access_token}
                });
                dataLoad && resolve('success');
            })
                .then((value) => {
                    setSuccessGbn(true);
                })

        }
        catch(e){
            console.log(e);
        }
        finally{

        }
    },[
        cd,
        dataLoad,
    ])


    const handle_click_moveList =(e) =>{
        e.preventDefault();
        router.push('/');
    }


    return (

        <>
            {
                successGbn && (
                    <div>
                        <Head>
                            <title>
                                {`${compInfo.comp_nm} 회사 정보`}
                            </title>
                            <meta name="description" content={`${compInfo.comp_nm}/${compInfo.ceo_nm}`} />
                            <meta property="og:title" content={`${compInfo.ceo_nm} 대표`} />
                            <meta property="og:description" content={compInfo.comp_nm} />
                            <meta property="og:image" content={compInfo?.img ? compInfo?.img : 'https://nodebird.com/favicon.ico'} />
                            <meta property="og:url" content={`${siteUrl}/${cd}`} />
                        </Head>

                        <div className="col-md-12">
                            <div className="card card-container">
                                <img
                                    src={compInfo?.img}
                                    alt="profile-img"
                                    className="profile-img-card"
                                />

                                <Form>
                                    <div>
                                        <div className="form-group">
                                            <label htmlFor="username">Company Name</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="comp_name"
                                                value={compInfo.comp_nm}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="email">Company Tel</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="comp_tel"
                                                value={compInfo.comp_tel}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="email">Ceo Name</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="ceo_nm"
                                                value={compInfo.ceo_nm}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="password">Addr Main</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                style={{color: 'blue'}}
                                                name="addr"
                                                value={compInfo.addr}
                                            />
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="addr_desc"
                                                value={compInfo.addr_desc}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="password">Fax</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                style={{color: 'blue'}}
                                                name="fax"
                                                value={compInfo.fax}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="password">Use</label>
                                            <select
                                                id={`use`}
                                                name={`use`}
                                                as="select"
                                                className="table_select tb_select"
                                                style={{ width:'268px', height:'40px'}}
                                                defaultValue={compInfo.useGbn}
                                            >
                                                <option value={``}>계약여부</option>
                                                <option value={`Y`}>계약</option>
                                                <option value={`N`}>해지</option>
                                            </select>
                                        </div>


                                        <div className="form-group">
                                            <button className="btn btn-primary btn-block" onClick={(e) => handle_click_moveList(e)}>Go to List Page</button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};



export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (context.req && cookie) {
        axios.defaults.headers.Cookie = cookie;
    }

    try {
        if (cookie){
            context.store.dispatch({
                type: SET_SSR_USER2_REQUEST
            });
        }
        const token_ck = cookie?.split(';').find(c => c.trim().startsWith(`${'token'}=`));
        const token_v  = token_ck ? getServerCookieValue('token', context.req) : null
        const { cd } = context.query;

        context.store.dispatch({
            type: LOAD_COMP_INFO_REQUEST,
            data: {cd: cd, token: token_v}
        });

        context.store.dispatch(END);
        await context.store.sagaTask.toPromise();
    }catch(e){
        console.log(e);
    }
});



export default Comp;
