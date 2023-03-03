import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import FriendService from '../../services/FriendService'
import FriendSugguest from './FriendSugguest'
import AvatarImage from '../AvatarImage'

const HOST = process.env.REACT_APP_IMAGE_HOST
function Sidebar() {
    const user = useSelector((state) => state.auth.user)
    const socket = useSelector((state) => state.socket.current)
    const userName = useRef(null)

    const [suggestList, setSuggestList] = useState([])

    useEffect(() => {
        ;(async () => {
            try {
                const res = await FriendService.getSuggest()
                console.log('Suggest:', res.data)
                setSuggestList(res.data)
            } catch (error) {}
        })()
    }, [])

    useEffect(() => {
        if (socket) {
            socket.on('notification:action:suggest:makeFriend', (payload) => {
                console.log('Notify MakeFriend IN Suggest:', payload)
                if (payload.type === 1) {
                    setSuggestList((preList) => [
                        ...preList.filter((item) => item.user_name !== payload.from.user_name),
                    ])
                }
            })

            return () => {
                socket.off('notification:action:suggest:makeFriend')
            }
        }
    }, [socket])

    return (
        <div className="sidebar">
            <div className="flex items-center justify-between mb-1">
                <div className="w-16 h-16">
                    <AvatarImage filename={user?.avatar} />
                </div>

                <div className="flex flex-col w-3/5 ml-2 ">
                    <NavLink to={`/profile/${user.username}`}>
                        <span className="cursor-pointer">{user.fullname}</span>
                    </NavLink>
                    <span className=" text-slate-400">@{user.username}</span>
                </div>

                <div className="mr-1 cursor-pointer">
                    <NavLink to={`/account`}>
                        <span className="text-teal-700 cursor-pointer text-md">Sửa</span>
                    </NavLink>
                </div>
            </div>
            <div>
                <div className="flex justify-between mt-2/5 mb-2/5">
                    <span className="font-bold text-slate-400">Gợi ý cho bạn</span>
                    <span className="text-sm font-semibold cursor-pointer">Xem tất cả</span>
                </div>
                <div>
                    {suggestList.map((user) => (
                        <FriendSugguest key={user.user_id} user={user} />
                    ))}
                </div>
                <div className="mt-5">
                    <ul className="flex justify-around">
                        <li className="text-sm cursor-pointer text-slate-400">Giới thiệu</li>
                        <li className="text-sm cursor-pointer text-slate-400">Trợ giúp</li>
                        <li className="text-sm cursor-pointer text-slate-400">Điều khoản</li>
                        <li className="text-sm cursor-pointer text-slate-400">Liên hệ</li>
                    </ul>
                </div>
                <div className="mt-2 text-center ">
                    <span className="text-sm text-slate-400">© 2023 instavers</span>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
