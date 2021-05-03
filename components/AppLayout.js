import Link from 'next/link';
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    LOG_OUT_REQUEST,
} from "../actions/types";
import { useRouter } from 'next/router'
import {resolveHref} from "next/dist/next-server/lib/router/router";
import {deleteCookie} from "../utils/cookie";



const AppLayout = ({ children }) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    const onLogout = () => {
        if (router.pathname === '/profile'){
            location.href = '/?logout=y';
        }
        else{
            dispatch({
                type: LOG_OUT_REQUEST,
            });

            //deleteCookie('username');
            //deleteCookie('email');
            //deleteCookie('token');
            //deleteCookie('roles');
            document.cookie = 'username' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = 'email' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = 'token' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = 'roles' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            router.push('/');
        }
    };


    useEffect(()=> {
        const {logout} = router.query;
        if (logout === 'y'){
            dispatch({
                type: LOG_OUT_REQUEST,
            });

            document.cookie = 'username' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = 'email' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = 'token' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = 'roles' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    },[])


    return(
        <div>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <Link href='/'>
                    <a className="navbar-brand">Manhattansky73</a>
                </Link>
                <div className="navbar-nav mr-auto">
                    <li className="nav-item navbar-link">
                        <Link href='/' >
                            <a>Home</a>
                        </Link>
                    </li>
                </div>

                {currentUser ? (
                    <div className="navbar-nav ml-auto">
                        <li className="nav-item" style={{marginTop:'7.5px'}}>
                            <Link href={"/profile"} >
                                <a>{currentUser.username} [{currentUser.email}]</a>
                            </Link>
                        </li>
                        &nbsp;&nbsp;
                        <li className="nav-item" onClick={onLogout}>
                            <div className="nav-link">
                                LogOut
                            </div>
                        </li>
                    </div>
                ) : (
                    <div className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link href={"/login"} >
                                <a>Login</a>
                            </Link>
                        </li>
                        &nbsp;&nbsp;&nbsp;
                        <li className="nav-item">
                            <Link href={"/register"} >
                                <a>Sign Up</a>
                            </Link>
                        </li>
                    </div>
                )}
            </nav>
        <div style={{marginTop:'15px', }}>
            {children}
        </div>
    </div>
    );
};




export default AppLayout;