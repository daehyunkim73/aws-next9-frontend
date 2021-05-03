import React, {useEffect} from "react";
import { Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useRouter } from 'next/router'
import cookie from "js-cookie";
import wrapper from "../store/configureStore";
import axios from "axios";
import {getServerCookieValue} from "../utils/cookie";
import {SET_SSR_USER_REQUEST} from "../actions/types";
import {END} from "redux-saga";
import useSWR from 'swr';
import {siteUrl, apiUrl, apiUrlNotPort} from '../config/config'
import {urlObjectKeys} from "next/dist/next-server/lib/utils";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";



const fetcherWithParams = (url, token,  username) =>{
    axios.defaults.headers.common = {
        'Access-Control-Allow-Origin': siteUrl,
        'Access-Control-Allow-Credentials': true,
        'Authorization': `bearer ${token}`
    }

    const data = axios.post(url, {
        userNm: typeof username !== 'undefined' ? username : '',
    })
        .then((result) =>{
            result.data.compInfo[0] && console.log('<<<<<<<<<<<<<<<<<< result >>>>>>>>>>>>>>>', result.data.compInfo[0])
            return result.data.compInfo[0]
        })
    return data;
}


const Profile = () => {
  const router = useRouter();
  const { user: currentUser,  isLoggedIn} = useSelector((state) => state.auth);
  const { data: compInfo, error: compError } = useSWR([`${apiUrl}/api/comp_api/compInfoByUserNm`, `${currentUser?.token}`, `${currentUser?.usernmae}`], fetcherWithParams );



  useEffect(() => {
      if (!isLoggedIn) {
          router.push("/login");
      }
      
      // return state must bottom
      if (compError){
          console.error(compError);
          return <div>company info error</div>;
      }
  },[
  ]);


  const handle_click_moveList =(e) =>{
      e.preventDefault();
      router.push('/');
  }


  return (
          <div style={{position:'relative', left: '30%'}}>
            <div>
              {compInfo && (
                  <div style={{float:'left'}}>
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
                                          <option value={``}>Conn Select</option>
                                          <option value={`Y`}>Connect</option>
                                          <option value={`N`}>DisConnect</option>
                                      </select>
                                  </div>


                                  <div className="form-group">
                                      <button className="btn btn-primary btn-block" onClick={(e) => handle_click_moveList(e)}>Go to List Page</button>
                                  </div>
                              </div>
                          </Form>
                      </div>
                  </div>
              )}

              <div style={{float:'left'}}>
                  <div className="card card-container">
                      <div>

                          <div className="form-group">
                              <label htmlFor="username">Username</label>
                              <input
                                  type="text"
                                  className="form-control"
                                  name="username2"
                                  defaultValue={currentUser && currentUser.usernmae}
                              />
                          </div>

                          <div className="form-group">
                              <label htmlFor="email">Email</label>
                              <input
                                  type="text"
                                  className="form-control"
                                  name="email2"
                                  defaultValue={currentUser && currentUser.email}
                              />
                          </div>
                          <strong>Token Key:</strong>
                          <p>
                              {currentUser && currentUser.token?.substring(0, 20)} ...{" "}
                              {currentUser && currentUser.token?.substr(currentUser.token?.length - 20)}
                          </p>
                          <strong>Authorities:</strong>
                          <ul>
                              {currentUser && currentUser.roles}
                              {/*Array.prototype.slice.call(currentUser?.roles).map((role, index) => <li key={index}>{role}</li>)}*/}
                          </ul>

                      </div>
                  </div>
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

    const username_ck = cookie?.split(';').find(c => c.trim().startsWith(`${'username'}=`));
    const email_ck = cookie?.split(';').find(c => c.trim().startsWith(`${'email'}=`));
    const token_ck = cookie?.split(';').find(c => c.trim().startsWith(`${'token'}=`));
    const roles_ck = cookie?.split(';').find(c => c.trim().startsWith(`${'roles'}=`));

    const username_v = username_ck ? getServerCookieValue('username', context.req) : null
    const email_v = email_ck ? getServerCookieValue('email', context.req) : null
    const token_v  = token_ck ? getServerCookieValue('token', context.req) : null
    const roles_v = roles_ck ? getServerCookieValue('roles', context.req) : null

    try {
        // username, email, token, roles
        if (username_v && email_v && token_v && roles_v){
            context.store.dispatch({
                type: SET_SSR_USER_REQUEST,
                data: {username: username_v, email: email_v, token: token_v, roles: roles_v}
            });
        }

        context.store.dispatch(END);
        await context.store.sagaTask.toPromise();
    }catch(e){
        console.log(e);
    }
});


export default Profile;
