import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { ZEle } from 'zero-element';
import config from './List.config';

@connect(({ fashion, loading }) => ({
  modelStatus: fashion,
  namespace: 'fashion',
  loading: loading.effects,
}))
export default class List extends PureComponent {
  render() {
    return (
      <ZEle { ...this.props } config={ config }
       CPortal={{
         'BatchOperation': () => {
           return null;
         }
       }}
       />
    );
  }
}