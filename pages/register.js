import React, {useState, useRef, useCallback} from "react";
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import { useRouter } from 'next/router'

import {
  REGISTER_REQUEST,
  MESSAGE_SUCCESS,
  MESSAGE_CLEAR,


} from "../actions/types";



const Register = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirm, setPassword_confirm] = useState("");
  const password_confirm_ref = useRef('');
  const password_ref = useRef('');
  const [password_alert, setPassword_alert] = useState(false);
  const [password_confirm_alert, setPassword_confirm_alert] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const role_ref = useRef('');

  const { message } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();



  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    if (password_ref.current.value.length < 6 || password_ref.current.value.length > 40 ) {
      setPassword_alert(true)
    }else{
      setPassword_alert(false)
    }
  }

  const onChangePassword_confirm = (e) => {
    if (password_ref.current.value !== password_confirm_ref.current.value) {
      setPassword_confirm_alert(true)
    }else{
      setPassword_confirm_alert(false)
    }
  }

  const handleRegister = (e) => {
    e.preventDefault();

    setSuccessful(false);
    form.current.validateAll();
    const role_v = role_ref.current?.value;

    if (checkBtn.current.context._errors.length === 0) {
      new Promise(function(resolve, reject) {
        dispatch({
          type: REGISTER_REQUEST,
          data: {
            username: username,
            email: email,
            password: password_ref.current.value,
            role: role_v,
          }
        });
        resolve('success');
      })
        .then(() => {
          setSuccessful(true);
        })
        .catch(() => {
          setSuccessful(false);
        });
    }
  };

  const required = (value) => {
    if (!value) {
      return (
          <div className="alert alert-danger" role="alert">
            This field is required!
          </div>
      );
    }
  };

  const validEmail = (value) => {
    if (!isEmail(value)) {
      return (
          <div className="alert alert-danger" role="alert">
            This is not a valid email.
          </div>
      );
    }
  };

  const vusername = (value) => {
    if (value.length < 3 || value.length > 20) {
      return (
          <div className="alert alert-danger" role="alert">
            The username must be between 3 and 20 characters.
          </div>
      );
    }
  };

  const handle_click_loginPage = (e) => {
    //router.push(`/login`);
    window.open('/login', '_self');
  }

  const handle_click_signUpPage = () => {
    setSuccessful(false);
    setUsername('');
    setEmail('');

    dispatch({
      type: MESSAGE_CLEAR,
      payload: null
    });

    router.push("/register");
    //window.location.reload()
  }


  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Form onSubmit={handleRegister} ref={form}>
          {!successful && (
            <div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <Input
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  onChange={onChangeUsername}
                  validations={[required, vusername]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Input
                  type="text"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  validations={[required, validEmail]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  style={{color: 'blue'}}
                  name="password"
                  ref={password_ref}
                  onChange={(e) => onChangePassword(e)}
                />
              </div>
              {
                password_alert === true &&
                <div className="alert alert-danger" role="alert" style={{marginTop:'-16px'}}>
                  The password must be between 6 and 40 characters.
                </div>
              }

              <div className="form-group">
                <label htmlFor="password">Password Confirm</label>
                <input
                    type="password"
                    className="form-control"
                    style={{color: 'blue'}}
                    name="password_confirm"
                    ref={password_confirm_ref}
                    onChange={(e) => onChangePassword_confirm(e)}
                />
              </div>
              {
                password_confirm_alert === true &&
                <div className="alert alert-danger" role="alert" style={{marginTop:'-16px'}}>
                  Confirm password does not match with The Password.
                </div>
              }

              <div className="form-group">
                <label htmlFor="password">Role Config</label>
                <select
                    id={`role`} name={`role`}
                    as="select"
                    className="table_select tb_select"
                    ref={role_ref}
                    style={{ width:'268px', height:'40px'}}
                    defaultValue={``}
                >
                  <option value={``}>업무 구분</option>
                  <option value={`PM`}>기획자</option>
                  <option value={`PG`}>프로그래머</option>
                  <option value={`PL`}>프로젝트리더</option>
                </select>
              </div>


              <div className="form-group" style={{marginTop:'30px'}}>
                <button className="btn btn-primary btn-block">Sign Up</button>
              </div>
            </div>
          )}

          {
            (successful && message && message.code === 200) && (
              <div>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <Input
                      type="text"
                      className="form-control"
                      name="username2"
                      value={message && message.info.username}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Input
                      type="text"
                      className="form-control"
                      name="email2"
                      value={message && message.info.email}
                  />
                </div>

                <div className="form-group">
                  <button className="btn btn-primary btn-block" onClick={(e) => handle_click_loginPage(e)}>Go to Login Page</button>
                </div>
              </div>
            )
            || (successful && message && message.code === 100) &&
            (
              <div>
                <div className="form-group" style={{height: '100px', marginTop: '30px'}}>
                  <label htmlFor="email" style={{textAlign:"center"}}>{message && message.desc}</label>
                </div>

                <div className="form-group">
                  <button className="btn btn-primary btn-block" onClick={() => handle_click_signUpPage()}>Go to SignUp Page</button>
                </div>
              </div>
            )
          }
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default Register;
