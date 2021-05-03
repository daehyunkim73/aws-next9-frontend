// resource for handling cookies taken from here:
// https://github.com/carlos-peru/next-with-api/blob/master/lib/session.js

import cookie from 'js-cookie';
import SsrCookie from "ssr-cookie";




export const setCookie = (key, value) => {
    const cookie = new SsrCookie();
    if (process.browser) {
        cookie.set(key, value, {
            expires: 1,
            path: '/'
        });
    }
};

export const removeCookie = (key) => {
    const cookie = new SsrCookie();
    if (process.browser) {
        cookie.remove(key, {
            expires: 1
        });
        cookie.remove(key);
    }
};

export const getCookie = (key, req) => {
    return process.browser
        ? getCookieFromBrowser(key)
        : getCookieFromServer(key, req);
};

export const getCookieValue = (key) => {
    let cookieKey = key + "=";
    let result = "";
    const cookieArr = cookie.split(";");

    for(let i = 0; i < cookieArr.length; i++) {
        if(cookieArr[i][0] === " ") {
            cookieArr[i] = cookieArr[i].substring(1);
        }

        if(cookieArr[i].indexOf(cookieKey) === 0) {
            result = cookieArr[i].slice(cookieKey.length, cookieArr[i].length);
            return result;
        }
    }
    return result;
}

export const getServerCookieValue = (key, req) => {
    let cookieKey = key + "=";
    let result = "";
    const cookieArr = req.headers.cookie?.split(";");

    for(let i = 0; i < cookieArr?.length; i++) {
        if(cookieArr[i][0] === " ") {
            cookieArr[i] = cookieArr[i].substring(1);
        }

        if(cookieArr[i].indexOf(cookieKey) === 0) {
            result = cookieArr[i].slice(cookieKey.length, cookieArr[i].length);
            return result;
        }
    }
    return result;
}

export const getCookieFromBrowser = key => {
    const cookie = new SsrCookie();
    return cookie.get(key);
};

export const getCookieFromServer = (key, req) => {
    const cookie = new SsrCookie();
    if (!req.headers.cookie) {
        return undefined;
    }
    const rawCookie = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith(`${key}=`));
    if (!rawCookie) {
        return undefined;
    }
    return rawCookie.split('=')[1];
};

export const deleteCookie = (name) =>{
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
