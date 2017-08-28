import * as types from './types';
const actions = {
    checkLogin:({commit},payload)=>{
      commit(types.CheckLogin,payload); 
    }
};

export default actions