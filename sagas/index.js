import { all, fork } from 'redux-saga/effects';
import paymnt from './paymnt';
import auth from './auth';
import comp from './comp';



export default function* rootSaga() {
  yield all([
    fork(paymnt),
    fork(auth),
    fork(comp),

  ]);
}
