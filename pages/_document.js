// import Document, {Head, Main, Html, AppLayout, NextScript} from 'next/document';
//
// export default class MyDocument extends Document {
//     render() {
//         return (
//             <Html>
//                 <Head>
//                     <link rel="stylesheet" href="/static/bootstrap/dist/css/bootstrap.min.css" />
//                     <link rel="stylesheet" href="/static/styles/App.css" />
//                     <link rel="stylesheet" href="/static/styles/custom.css" />
//                     <link rel="stylesheet" href="/static/styles/else.css" />
//                     <link rel="stylesheet" href="/static/styles/index.css" />
//                     <link rel="stylesheet" href="/static/react-datepicker/dist/react-datepicker.css" />
//                     <link rel="stylesheet" href="/static/react-datepicker/dist/react-datepicker-cssmodules.css" />
//                     <link rel="stylesheet" href="/static/react-confirm-alert/src/react-confirm-alert.css" />
//                 </Head>
//             <body>
//             <Main />
//             <NextScript />
//             </body>
//             </Html>
//         )
//     }
// }



// import React from 'react';
// import Helmet from 'react-helmet';
// import PropTypes from 'prop-types';
// import Document, { Main, NextScript } from 'next/document';
// import { ServerStyleSheet } from 'styled-components';
//
// class MyDocument extends Document {
//     static getInitialProps(context) {
//         const sheet = new ServerStyleSheet();
//         const page = context.renderPage((App) => (props) => sheet.collectStyles(<App {...props} />));
//         const styleTags = sheet.getStyleElement();
//         return { ...page, helmet: Helmet.renderStatic(), styleTags };
//     }
//
//     render() {
//         const { htmlAttributes, bodyAttributes, ...helmet } = this.props.helmet;
//         const htmlAttrs = htmlAttributes.toComponent();
//         const bodyAttrs = bodyAttributes.toComponent();
//
//         return (
//             <html {...htmlAttrs}>
//             <head>
//                 <link rel="stylesheet" href="/static/bootstrap/dist/css/bootstrap.min.css" />
//                 <link rel="stylesheet" href="/static/styles/App.css" />
//                 <link rel="stylesheet" href="/static/styles/custom.css" />
//                 <link rel="stylesheet" href="/static/styles/else.css" />
//                 <link rel="stylesheet" href="/static/styles/index.css" />
//                 <link rel="stylesheet" href="/static/react-datepicker/dist/react-datepicker.css" />
//                 <link rel="stylesheet" href="/static/react-datepicker/dist/react-datepicker-cssmodules.css" />
//                 <link rel="stylesheet" href="/static/react-confirm-alert/src/react-confirm-alert.css" />
//                 {this.props.styleTags}
//                 {Object.values(helmet).map(el => el.toComponent())}
//             </head>
//             <body {...bodyAttrs}>
//                 <Main />
//                 {process.env.NODE_ENV === 'production'
//                 && <script src="https://polyfill.io/v3/polyfill.min.js?features=es6,es7,es8,es9,NodeList.prototype.forEach&flags=gated" />}
//                 <NextScript />
//             </body>
//             </html>
//         );
//     }
// }

//export default MyDocument;





import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import PropTypes from 'prop-types';


export default class MyDocument extends Document {
    static async getInitalProps(ctx) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;
        try {
            ctx.renderPage = () => originalRenderPage({
                enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
            });
            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            };
        } catch (error) {
            console.error(error);
        } finally {
            sheet.seal();
        }
    }

    render() {
        return (
            <Html>
                <Head />
                <body>
                <script src="https://polyfill.io/v3/polyfill.min.js?features=default%2Ces2015%2Ces2016%2Ces2017%2Ces2018%2Ces2019" />
                <Main />
                <NextScript />
                </body>
            </Html>
        );
    }
}

// IE?????? ????????? ??????????????? ???????????? ?????? ????????? ????????????
// ??????????????? babel??? ???????????? ??????
// Promise, Map, Set ?????? babel??? ?????? ????????? ??????, ????????? babelPolyfill ?????? ????????? ?????? ?????????
// ????????? Polyfill.io ??? ?????? => IE????????? ??????


MyDocument.propTypes = {
    helmet: PropTypes.object.isRequired,
    styleTags: PropTypes.array.isRequired,
};



