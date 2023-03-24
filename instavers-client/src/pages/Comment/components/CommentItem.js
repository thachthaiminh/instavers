import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AvatarImage from '../../../components/AvatarImage'
import CommentReply from './CommentReply'

const HOST = process.env.REACT_APP_IMAGE_HOST
function CommentItem({ comment, onReply, gotoId }) {
    const [openReply, setOpenReply] = useState(false)

    const navigate = useNavigate()
    const replyBox = useRef(null)

    const handleOnSecondaryReply = (data) => {
        data.comment_id = comment.comment_id
        console.log(data)
        onReply(data)
    }

    useEffect(() => {
        if (comment.replies.length !== 0 && comment.new) {
            setOpenReply(true)
            replyBox.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [comment.replies, comment.new])

    useEffect(() => {
        if (gotoId === comment.comment_id)
            replyBox.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        else {
            const isReply = comment.replies.some((cmt) => cmt.comment_id === gotoId)
            if (isReply) {
                setOpenReply(true)
                replyBox.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        }
    }, [gotoId])

    const handleClickMention = (e) => {
        // console.log(e.target);
        if (e.target.classList.contains('accessible')) {
            const link = e.target.getAttribute('data-link')
            console.log(link)
            navigate(link)
        }
    }

    return (
        <div ref={replyBox} className="flex w-full gap-1 my-3">
            <div className="flex justify-center w-2/12 md:w-1/12 shrink-0">
                <div className="overflow-hidden rounded-full w-9 h-9">
                    <AvatarImage filename={comment.user_avatar} />
                    {/* <img
                        className="object-cover w-full h-full"
                        src={`${HOST}/static/avatar/${comment.user_avatar}`}
                        alt="avt"
                    /> */}
                </div>
            </div>
            <div className="w-10/12 grow">
                <div className="max-w-full">
                    <span className="pr-1 font-bold">@{comment.user_name}</span>
                    <span
                        className="break-words"
                        onClick={handleClickMention}
                        dangerouslySetInnerHTML={{ __html: comment.comment_content }}
                    ></span>
                </div>
                <div className="mt-2 font-medium text-gray-400">
                    <span className="pr-3">{comment.time_distance}</span>
                    <span className="cursor-pointer" onClick={() => onReply(comment)}>
                        Phản hồi
                    </span>
                </div>
                {comment.replies.length !== 0 && (
                    <div className="mt-2 ">
                        <div>
                            {!openReply && (
                                <span
                                    className="font-medium text-gray-400 cursor-pointer"
                                    onClick={() => setOpenReply(true)}
                                >
                                    ___ View replies
                                </span>
                            )}
                            {openReply && (
                                <span
                                    className="font-medium text-gray-400 cursor-pointer"
                                    onClick={() => setOpenReply(false)}
                                >
                                    ___ Close replies
                                </span>
                            )}
                        </div>
                        {openReply && (
                            <div className="">
                                {comment.replies.map((cmt, index) => (
                                    <CommentReply
                                        key={index}
                                        onReply={handleOnSecondaryReply}
                                        comment={cmt}
                                        gotoId={gotoId}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommentItem
