import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import PostItem from '../../components/PostItem'
import ViewImage from '../../components/ViewImage'
import PostService from '../../services/PostService'
import Comment from '../Comment'

function ItemDetail() {
    const [openView, setOpenView] = useState(false)
    const [commentId, setCommentId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const { id } = useParams()

    const location = useLocation()

    const [post, setPost] = useState(null)

    const handleOpenView = () => {
        setOpenView(true)
    }

    useEffect(() => {
        if (location.state) setCommentId(location.state.commentId)
        else setCommentId(null)
    }, [location])

    const fetchPost = async (postId) => {
        try {
            setLoading(true)
            const res = await PostService.getById(postId)
            console.log(res)
            setLoading(false)
            setError(false)
            setPost(res.data)
        } catch (error) {
            setLoading(false)
            setError(true)
        }
    }

    useEffect(() => {
        fetchPost(id)
    }, [id])

    return (
        <div className="w-4/5 mx-auto md:w-1/2 lg:w-1/3 ">
            {!loading &&
                (error ? (
                    <div className="text-red-500">Khong tim thay bai post</div>
                ) : (
                    <>
                        {post && (
                            <PostItem
                                postData={post}
                                openView={() => handleOpenView(post)}
                                gotoId={commentId}
                            />
                        )}

                        {openView && (
                            <ViewImage
                                imageList={post?.images}
                                aspect={post.aspect}
                                close={() => setOpenView(false)}
                            />
                        )}
                    </>
                ))}
            {loading && (
                <div className="flex justify-center">
                    <span className="block w-24 h-24 border-2 rounded-full border-t-transparent animate-spin"></span>
                </div>
            )}
        </div>
    )
}

export default ItemDetail
