import { createSlice } from '@reduxjs/toolkit'

//  Slice này sử dụng để lưu trữ thông tin về người dùng đăng nhập và trạng thái đăng nhập

const data = JSON.parse(localStorage.getItem('user')) 
const initialState = {
  user: data?.user||null,
  token: data?.token || null,
}

export const modalSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signup: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('user', JSON.stringify({user:state.user,token:state.token}))
    },
    login: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('user', JSON.stringify({user:state.user,token:state.token}))
    },
    logout:(state)=>{
      state.user = null
      state.token = null
      localStorage.removeItem('user')
    },
    update: (state, action) => {
      state.user = {...state.user, ...action.payload, isCompleteInfo: 1}
      localStorage.setItem('user', JSON.stringify({user:state.user,token:state.token}))
    },
  }
})


export const { signup, logout,login,update } = modalSlice.actions

export default modalSlice.reducer