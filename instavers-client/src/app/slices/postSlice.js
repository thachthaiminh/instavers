import { createSlice } from '@reduxjs/toolkit'

// Slice được sử dụng để lưu trữ danh sách các bài đăng trong ứng dụng, 
// bao gồm cả danh sách bài đăng công khai và bài đăng của bạn bè.

const initialState = {
  public: [],
  friend: [],
}

export const postSlice= createSlice({
  name: 'post',
  initialState,
  reducers: {
    updatePublicPostList: (state, action) => {
      state.public = action.payload
    },
    updateFriendPostList: (state, action) => {
      state.friend = action.payload
    },
  }
})

export const { updatePublicPostList,updateFriendPostList } = postSlice.actions

export default postSlice.reducer