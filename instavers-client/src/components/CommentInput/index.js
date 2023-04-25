import { faSmile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import FriendService from '../../services/FriendService'
import cls from 'classnames'
import HashtagService from '../../services/HashtagService'
import CommentService from '../../services/CommentService'
import { useSelector } from 'react-redux'
import AvatarImage from '../AvatarImage'

const icons = ['😀', '😂', '😅', '😆', '😈', '😍', '😎', '😛', '😨']
const HOST = process.env.REACT_APP_IMAGE_HOST
function CommentInput({ postId, username, replyData, onUpdateCommentList }) {
    const user = useSelector((state) => state.auth.user)
    const socket = useSelector((state) => state.socket.current)

//xử lý thẻ @ tag người dùng khác.
    const [getMention, setGetMention] = useState(false)
    const [startPos, setStartPos] = useState(0)
    const [searchMention, setSearchMention] = useState('')
    const [mentionList, setMentionList] = useState([])
    
//xử lý thẻ # hashtag.
    const [getHashTag, setGetHashTag] = useState(false)
    const [searchHashtag, setSearchHashtag] = useState('')
    const [hashtagList, setHashtagList] = useState([])

//lưu danh sách các thẻ @ và # đã được thêm vào bình luận.
    const [addedMetionList, setAddedMentionList] = useState([])
    const [addedHashtagList, setAddedHashtagList] = useState([])

//hiển thị trạng thái xử lý
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const inputRef = useRef(null)
    function typeInTextarea(newText) {
        inputRef.current.focus()
        const el = document.activeElement
        const [start, end] = [el.selectionStart, el.selectionEnd]
        el.setRangeText(newText, start, end, 'end')
    }

// lắng nghe sự thay đổi của replyData (nếu có) để đưa ra lựa chọn đề cập đến người dùng khác 
// khi trả lời bình luận của người khác
    useEffect(() => {
        if (replyData) {
            inputRef.current.value = ''
            if (user.username !== replyData.user_name) {
                setAddedMentionList((preList) => {
                    let ok = !preList.some((u) => u.user_name === replyData.user_name)
                    if (ok) return [...preList, replyData]
                    return preList
                })
                typeInTextarea('@' + replyData.user_name + ' ')
            }
        }
    }, [replyData])

//được gọi mỗi khi người dùng thay đổi giá trị của input element, 
// hàm này sẽ xử lý việc đề cập đến người dùng khác và hashtag.
    const handleOnChange = (e, el = document.activeElement) => {
        const currentPointer = el.selectionStart
        const value = e.target.value
        const lastChar = value[el.selectionStart - 1]
        handleTypingMention(value, lastChar, currentPointer)
        handleTypingHashTag(value, lastChar, currentPointer)
    }

// xử lý đề cập đến người dùng khác
    const handleTypingMention = (value, lastChar, currentPointer) => {
        if (!getMention) {
            if (
                lastChar === '@' &&
                (currentPointer - 1 === 0 || value[currentPointer - 2] === ' ')
            ) {
                console.log('Get hashtag: ')
                setGetMention(true)
                setStartPos(currentPointer - 1)
            }
        } else {
            if (lastChar === ' ' || currentPointer <= startPos) {
                setGetMention(false)
                setMentionList([])
                return
            }

            const mention = value.substring(startPos, currentPointer)
            setSearchMention(mention)
        }
    }

    // lắng nghe sự kiện tìm tag
    useEffect(() => {
        const searchData = searchMention.slice(1)

        const id = setTimeout(async () => {
            try {
                // console.log(searchData)
                if (searchData && getMention) {
                    const res = await FriendService.getMention(searchData)
                    console.log(res.data)
                    setMentionList(res.data)
                }
            } catch (error) {}
        }, 300)

        return () => {
            clearTimeout(id)
        }
    }, [searchMention, getMention])


// thêm đề cập đến người dùng khác
    const handleAddMention = (userInfo) => {
        const user = userInfo.user_name
        typeInTextarea(user.slice(searchMention.length - 1) + ' ')
        setMentionList([])
        setGetMention(false)
        setSearchMention('')
        setAddedMentionList((preList) => {
            let ok = !preList.some((u) => u.user_name === user)
            if (ok) return [...preList, userInfo]
            return preList
        })
    }

    // lắng nghe sự kiện tìm hashtag
    useEffect(() => {
        const searchData = searchHashtag.slice(1)

        const id = setTimeout(async () => {
            try {
                if (searchData && getHashTag) {
                    const res = await HashtagService.search(searchData)
                    console.log(res.data)
                    setHashtagList(res.data)
                }
            } catch (error) {}
        }, 300)

        return () => {
            clearTimeout(id)
        }
    }, [searchHashtag, getHashTag])

    // hàm kiểm tra nếu người dùng đang gõ hashtag và đặt các trạng thái getHashTag, searchHashtag tương ứng.
    const handleTypingHashTag = (value, lastChar, currentPointer) => {
        if (!getHashTag) {
            if (
                lastChar === '#' &&
                (currentPointer - 1 === 0 || value[currentPointer - 2] === ' ')
            ) {
                console.log('Get hashtag: ')
                setGetHashTag(true)
                setStartPos(currentPointer - 1)
            }
        } else {
            if (lastChar === ' ' || currentPointer <= startPos) {
                setGetHashTag(false)
                setHashtagList([])
                return
            }

            const hashtag = value.substring(startPos, currentPointer)
            setSearchHashtag(hashtag)
        }
    }

    // hàm thêm một hashtag đã được nhập vào comment box và vào danh sách đã thêm (addedHashtagList).
    const handleAddHashtag = (tag) => {
        const tagname = tag.hashtag_name
        typeInTextarea(tagname.slice(searchHashtag.length - 1) + ' ')
        setHashtagList([])
        setGetHashTag(false)
        setSearchHashtag('')
        setAddedHashtagList((preList) => {
            let ok = !preList.some((t) => t.hashtag_name === tagname)
            if (ok) return [...preList, tag]
            return preList
        })
    }

    const handleAddComment = async () => {
        const caption = inputRef.current.value
        if (!caption) return

        const [mentions, captionWithMention] = getMentionOrHashTagList(
            addedMetionList,
            caption,
            '@'
        )
        const [hashtags, captionFinal] = getMentionOrHashTagList(
            addedHashtagList,
            captionWithMention,
            '#'
        )

        const captionData = {
            content: captionFinal,
            mentions,
            hashtags,
        }

        const data = {
            postId,
            captionData,
        }

        if (replyData) data.replyId = replyData.comment_id

        console.log('Comment data:', data)
        try {
            setLoading(true)
            const res = await CommentService.add(data)
            console.log('Comment res:', res)
            const commentId = res.comment_id
            updateCommentList(commentId, data, user)
            setLoading(false)
            showSuccessNotification()
        } catch (error) {
            setLoading(false)
            setError(true)
        }
    }

    const updateCommentList = (comment_id, data, user) => {
        const newComment = {
            comment_id,
            comment_content: data.captionData.content,
            user_name: user.username,
            user_id: user.id,
            user_avatar: user.avatar,
            replies: [],
            reply_comment_id: data.replyId,
            time_distance: 'Vừa mới',
        }
        console.log('New comment:', newComment)

        //Notification
        const dataEmit = {
            from: user.username,
            to: username,
            mentions: addedMetionList,
            postId: postId,
            commentData: newComment,
        }
        socket.emit('notification:comment', dataEmit)
        if (onUpdateCommentList) {
            onUpdateCommentList(newComment)
        }
    }

    const showSuccessNotification = () => {
        setShowSuccess(true)
        setTimeout(() => {
            setShowSuccess(false)
        }, 1000)
        inputRef.current.value = ''
        setAddedMentionList([])
        setAddedHashtagList([])
    }

    const getMentionOrHashTagList = (array, caption, signalChar) => {
        const lists = []
        let newCaption = caption

        const uri = signalChar === '@' ? '/profile/' : '/hashtags/'

        array.forEach((tag) => {
            const value = tag.user_name || tag.hashtag_name
            if (caption.indexOf(value) !== -1) {
                newCaption = newCaption.replace(
                    signalChar + value + ' ',
                    `<span class="accessible cursor-pointer font-medium ${
                        signalChar === '@' ? 'text-blue-500' : ''
                    }" data-link='${uri}${value}'>${signalChar}${value} </span>`
                )
                lists.push(tag.user_id || tag.hashtag_id)
            }
        })
        return [lists, newCaption]
    }

    return (
        <>
            <div className="relative text-2xl">
                <FontAwesomeIcon className="cursor-pointer peer" icon={faSmile} />
                <div className="absolute hidden w-32 p-1 -mb-2 text-lg text-center bg-white border border-gray-200 peer-hover:block hover:block bottom-full">
                    {icons.map((icon) => (
                        <span
                            key={icon}
                            className="p-1 cursor-pointer"
                            onClick={() => typeInTextarea(icon)}
                        >
                            {icon}
                        </span>
                    ))}
                </div>
            </div>
            <div className="relative mx-4 grow">
                <input
                    ref={inputRef}
                    onChange={handleOnChange}
                    className="w-full h-full outline-none"
                    placeholder="Thêm bình luận..."
                    spellCheck="false"
                    // onBlur={(e) => e.target.focus()}
                />

                <div
                    className={cls(
                        'absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-blue-500 px-2 text-white rounded-xl transition-all',
                        {
                            hidden: false,
                        }
                    )}
                >
                    {showSuccess && <span>Đã đăng!</span>}
                    {error && <span>Bài đăng không tồn tại</span>}
                    {loading && (
                        <div className="py-1">
                            <span className="block w-4 h-4 border border-white rounded-full border-l-transparent animate-spin"></span>
                        </div>
                    )}
                </div>

                {mentionList.length !== 0 && (
                    <div className="absolute p-2 bottom-full left-0 h-40 border rounded-lg bg-white min-w-[150px] overflow-y-auto">
                        <ul>
                            {mentionList.map((user) => (
                                <li
                                    key={user.user_id}
                                    className="flex gap-1 p-1 cursor-pointer"
                                    onClick={() => handleAddMention(user)}
                                >
                                    <div className="w-6 h-6">
                                        <AvatarImage filename={user.user_avatar} />
                                    </div>
                                    <span>@{user.user_name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {hashtagList.length !== 0 && (
                    <div className="absolute p-2 bottom-full left-0 h-40 border rounded-lg bg-white min-w-[150px] overflow-y-auto">
                        <ul>
                            {hashtagList.map((tag) => (
                                <li
                                    key={tag.hashtag_id}
                                    className="flex gap-1 p-1 cursor-pointer"
                                    onClick={() => handleAddHashtag(tag)}
                                >
                                    <span>#{tag.hashtag_name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className="font-medium text-blue-400 cursor-pointer" onClick={handleAddComment}>
                Đăng
            </div>
        </>
    )
}

export default CommentInput
