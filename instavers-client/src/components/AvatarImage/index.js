import { useEffect, useRef, useState } from 'react'
import { getImageUrl } from '../../storage'
import cls from 'classnames'

// Hiển thị avatar người dùng
function AvatarImage({ filename, imageRef }) {
    const imgRef = useRef(null)
    const [loading, setLoading] = useState(true)

    const loadImage = async (filename) => {
        console.log('Loading')
        try {
            const url = await getImageUrl(filename)
            imgRef.current.src = url
            imageRef && (imageRef.current = imgRef.current)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }
//tải hình ảnh khi filename thay đổi
    useEffect(() => {
        if (filename) {
            loadImage(filename)
        }
    }, [filename])

    return (
        <>
            <img
                ref={imgRef}
                className={cls('rounded-full h-full w-full object-cover', {
                    hidden: loading,
                })}
                src={` `}
                alt=""
                draggable={false}
            />

            {loading && (
                <div className="flex items-center justify-center w-full h-full">
                    <div className="border border-blue-500 rounded-full w-9 h-9 border-t-transparent animate-spin"></div>
                </div>
            )}
        </>
    )
}

export default AvatarImage
