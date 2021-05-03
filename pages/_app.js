import Head from 'next/head';
import {Provider} from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';


function grandskywind({Component}) {
    return (
        <>
            <Head>
                 <title>grandskywind</title>
                 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"/>
                 <link rel="stylesheet" href="/static/styles/App.css"/>
                 <link rel="stylesheet" href="/static/styles/custom.css"/>
                 <link rel="stylesheet" href="/static/styles/else.css"/>
                 <link rel="stylesheet" href="/static/bootstrap/dist/css/bootstrap.min.css"/>
                 <link rel="stylesheet" href="/static/styles/index.css"/>
                 <link rel="stylesheet" href="/static/react-datepicker/dist/react-datepicker.css"/>
                 <link rel="stylesheet" href="/static/react-datepicker/dist/react-datepicker-cssmodules.css"/>
                 <link rel="stylesheet" href="/static/react-confirm-alert/src/react-confirm-alert.css"/>
            </Head>
            <AppLayout>
                <Component/>
            </AppLayout>
        </>
    );
};


// grandskywind.getInitialProps = async context => {
//     console.log('CONTEXT', context);
//     const { ctx, Component } = context; // next에서 넣어주는 context
//     let pageProps = {};
//     if (Component.getInitialProps) {
//         // Component (pages 폴더에 있는 컴포넌트)에 getInitialProps가 있다면 return 값을 pageProps에 넣음.
//         pageProps = await Component.getInitialProps(ctx); // ctx를 컴포넌트에 넘겨준다.
//     }
//     return { pageProps };
// };


grandskywind.propTypes = {
    Component: PropTypes.elementType.isRequired
};


export default wrapper.withRedux(grandskywind);


//모든 페이지에 공통으로 들어가기 때문에 레이아웃역할을 한다
//리액트와 리덕스 연결하는 코드 작성 => 모든 컴포넌트가 _app.js내 리덕스 state 공유
//NEXT 에서는 리액트에 리덕스 적용하는 방법
//npm i next-redux-wrapper 실행
