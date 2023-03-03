import { faTimes, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cls from 'classnames'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import FriendService from '../../../../../services/FriendService'

function FriendshipNav() {
    const socket = useSelector((state) => state.socket.current)

    const [newRequest, setNewRequest] = useState(false)
    const [friendNotify, setFriendNotify] = useState({ show: false, username: '' })

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (socket) {
            socket.on('notification:makeFriend', (payload) => {
                console.log('Notify MakeFriend:', payload)
                if (payload.type === 1) {
                    setNewRequest(true)
                    setFriendNotify({ show: true, username: payload.from.user_name })
                    setTimeout(() => {
                        setFriendNotify({ show: false, username: '' })
                    }, 3000)
                }
                // else setNewRequest(false)
            })
            socket.on('notification:friend', (payload) => {
                console.log('Notify Friend:', payload)
                if (payload.type === 1) {
                    setNewRequest(true)
                }
                // else setNewRequest(false)
            })
            return () => {
                socket.off('notification:makeFriend')
                socket.off('notification:friend')
            }
        }
    }, [socket])

    useEffect(() => {
        if (location.pathname === '/friend' && newRequest) setNewRequest(false)
    }, [location.pathname, newRequest])

    const getNewRequestStatus = async () => {
        try {
            const res = await FriendService.getNewRequestStatus()
            console.log('Res status', res)
            setNewRequest(res.data)
        } catch (error) {}
    }

    useEffect(() => {
        getNewRequestStatus()
    }, [])

    const isActive = location.pathname === '/friend'

    const handleGotoFriend = async () => {
        try {
            if (newRequest) {
                const res = await FriendService.updateNewRequestStatus()
                console.log('Res update new request status', res)
            }
            navigate(`/friend`)
        } catch (error) {}
    }

    return (
        <div className="relative">
            {friendNotify.show && (
                <div className="fixed bottom-0 right-0 z-50 mb-2 mr-5 text-xl text-blue-800">
                    <div className="w-full px-4 py-1 text-black bg-white border border-gray-400 rounded-md cursor-default relactive">
                        <span>
                            <span className="font-medium text-blue-800">
                                @{friendNotify.username}
                            </span>{' '}
                            đã gửi cho bạn lời mời kết bạn
                        </span>
                        <span
                            className="absolute right-0 flex items-center justify-center w-5 h-5 -mb-4 -mr-2 text-sm text-red-500 bg-white border border-red-500 rounded-full cursor-pointer bottom-full"
                            onClick={() => setFriendNotify({ show: false, username: '' })}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </div>
                </div>
            )}
            <FontAwesomeIcon
                className={cls('cursor-pointer', { 'text-blue-500': isActive })}
                icon={faUserGroup}
                onClick={handleGotoFriend}
            />

            {newRequest && (
                <div className="absolute top-0 right-0 flex items-center justify-center w-3 h-3 text-center text-white bg-red-300 rounded-full"></div>
            )}
        </div>
    )
}

export default FriendshipNav
