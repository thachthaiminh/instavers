import { createSlice } from '@reduxjs/toolkit'
const initialState = { current: null }

// sử dụng để lưu trữ trạng thái hiện tại của kết nối Socket.IO.

export const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.current = action.payload.socket
        },
        clearSocket: (state) => {
            state.current = null
        },
    },
})

export const { setSocket,clearSocket } = socketSlice.actions

export default socketSlice.reducer
