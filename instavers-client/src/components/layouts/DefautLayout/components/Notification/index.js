import { faHeart, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cls from 'classnames'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import NotificationService from '../../../../../services/NotificationService'
import LikeNotify from './LikeNotify'
import MentionNotify from './MentionNotify'
import style from './Notification.module.css'

const MENTION = 0
const LIKE = 1
const MENTION_NOTIFY = 2
const COMMENT_NOTIFY = 3

function Notification() {
    const [notificationList, setNotificationList] = useState([])

    const [status, setStatus] = useState({ open: false, newNotification: false })
    const [likeNotify, setLikeNotify] = useState({ show: false, username: '' })
    const [commentNotify, setCommentNotify] = useState({ show: false, username: '' })
    const [mentionNotify, setMentionNotify] = useState({ show: false, username: '' })

    const socket = useSelector((state) => state.socket.current)

    const fetchNotification = async (frist) => {
        try {
            const res = await NotificationService.getAll()
            console.log('Notification:', res)
            const newNotify = res.data.some((item) => item.is_seen === 0)
            console.log('newNotifyStatus', newNotify)
            setStatus((status) => ({ ...status, newNotification: newNotify }))

            setNotificationList(res.data)
        } catch (error) {}
    }

    const closeNotification = () => {
        setStatus((status) => ({ ...status, open: false }))
        fetchNotification()
    }

    useEffect(() => {
        fetchNotification(true)
    }, [])

    useEffect(() => {
        if (!socket) return

        socket.on('notification:like', (payload) => {
            console.log('Notify LIKE: ', payload)
            setStatus((status) => {
                handleGetNotification(status.open)
                return status
            })
            if (payload.number === -1) return

            setStatus((preStatus) => ({ ...preStatus, newNotification: true }))

            setLikeNotify({ show: true, username: payload.from })
            setTimeout(() => setLikeNotify({ show: false, username: '' }), 2500)
        })
        socket.on('notification:comment', (payload) => {
            console.log('Notify COMMENT:', payload)
            setStatus((status) => {
                handleGetNotification(status.open)
                return status
            })
            setStatus((preStatus) => ({ ...preStatus, newNotification: true }))

            if (payload.type === COMMENT_NOTIFY) {
                setCommentNotify({ show: true, username: payload.from })
                setTimeout(() => setCommentNotify({ show: false, username: '' }), 2500)
            }
            if (payload.type === MENTION_NOTIFY) {
                setMentionNotify({ show: true, username: payload.from })
                setTimeout(() => setMentionNotify({ show: false, username: '' }), 2500)
            }
        })

        return () => {
            socket.off('notification:like')
            socket.off('notification:comment')
        }
    }, [socket])

    const handleOpen = () => {
        // updateNotifyStatus()
        setStatus({ ...status, open: true })
        // setStatus((preStatus) => ({ ...preStatus, newNotification: false }))
        fetchNotification()
    }
    const handleGetNotification = (open) => {
        console.log('Open', open)
        if (open) {
            // setStatus((preStatus) => ({ ...preStatus, newNotification: false }))
            fetchNotification()
        }
    }

    return (
        <div className="relative">
            <span className="cursor-pointer peer">
                <FontAwesomeIcon icon={faHeart} onClick={handleOpen} className="notification" />
            </span>

            <div className="fixed bottom-0 right-0 z-50 mb-2 mr-5 text-xl text-blue-800">
                {likeNotify.show && (
                    <div className="relative w-full px-4 py-1 text-black bg-white border border-gray-400 rounded-md cursor-default">
                        <span>
                            <span className="font-medium text-blue-800">
                                @{likeNotify.username}
                            </span>{' '}
                            thích bài đăng của bạn!
                        </span>
                        <span
                            className="absolute right-0 flex items-center justify-center w-5 h-5 -mb-4 -mr-2 text-sm text-red-500 bg-white border border-red-500 rounded-full cursor-pointer bottom-full"
                            onClick={() => setLikeNotify({ show: false, username: '' })}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </div>
                )}
                {commentNotify.show && (
                    <div className="relative z-50 w-full px-4 py-1 mt-1 text-black bg-white border border-gray-400 rounded-md cursor-default">
                        <span>
                            <span className="font-medium text-blue-800">
                                @{commentNotify.username}
                            </span>{' '}
                            đã bình luận bài đăng của bạn!
                        </span>
                        <span
                            className="absolute right-0 flex items-center justify-center w-5 h-5 -mb-4 -mr-2 text-sm text-red-500 bg-white border border-red-500 rounded-full cursor-pointer bottom-full"
                            onClick={() => setCommentNotify({ show: false, username: '' })}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </div>
                )}
                {mentionNotify.show && (
                    <div className="relative z-50 w-full px-4 py-1 mt-1 text-black bg-white border border-gray-400 rounded-md cursor-default">
                        <span>
                            <span className="font-medium text-blue-800">
                                @{mentionNotify.username}
                            </span>{' '}
                            đã nhắc đến bạn!
                        </span>
                        <span
                            className="absolute right-0 flex items-center justify-center w-5 h-5 -mb-4 -mr-2 text-sm text-red-500 bg-white border border-red-500 rounded-full cursor-pointer bottom-full"
                            onClick={() => setMentionNotify({ show: false, username: '' })}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </div>
                )}
            </div>

            {/* List notify */}

            <div
                className={cls(
                    'bg-white  hidden transition-all  absolute w-80 md:w-96 right-0  border rounded-lg p-2 text-[15px] z-20',
                    { '!block': status.open }
                )}
            >
                <div className="pb-2 text-lg font-medium text-center border-b">Thông báo</div>
                <ul className={cls('max-h-[450px] overflow-y-auto', style['notification-list'])}>
                    {notificationList.map((noti, index) => {
                        if (noti.type === MENTION)
                            return (
                                <MentionNotify key={index} noti={noti} onGoto={closeNotification} />
                            )
                        if (noti.type === LIKE)
                            return <LikeNotify key={index} noti={noti} onGoto={closeNotification} />
                    })}
                </ul>
            </div>
            {status.open && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setStatus({ ...status, open: false })}
                ></div>
            )}
            {status.newNotification && (
                <div className="absolute top-0 right-0 flex items-center justify-center w-3 h-3 text-center text-white bg-red-300 rounded-full"></div>
            )}
        </div>
    )
}

export default Notification
