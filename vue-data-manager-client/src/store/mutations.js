import * as types from './types';
const mutations = {
    [types.CheckLogin]:(state,payload)=>{
      state.login = payload;
    }
};

export default mutations