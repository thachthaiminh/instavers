import { useEffect, useRef, useState } from 'react'
import { getImageUrl } from '../../storage'
import cls from 'classnames'

function GalleryThumbnail({ filename }) {
    const imgRef = useRef(null)
    const [loading, setLoading] = useState(true)

    const loadImage = async (filename) => {
        console.log('Loading')
        try {
            const url = await getImageUrl(filename)
            imgRef.current.src = url
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (filename) {
            loadImage(filename)
        }
    }, [filename])

    return (
        <>
            <img
                ref={imgRef}
                alt="gallery"
                className={cls('object-cover object-center w-full h-full rounded-lg', {
                    hidden: loading,
                })}
                src={` `}
            />

            {loading && (
                <div className="">
                    <div className="w-20 h-20 border border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
            )}
        </>
    )
}

export default GalleryThumbnail
