import { faImages } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function UploadImage({ handleUploadImage }) {
    const handleChangeImage = (e) => {
        // console.log(e.target.files[0])
        const files = e.target.files
        createImageObject(files)
    }
    const handleDragOver = (e) => {
        e.preventDefault()
    }
    const handleDragLeave = (e) => {
        e.preventDefault()
    }
    const handleDrop = (e) => {
        e.preventDefault()
        const files = e.dataTransfer.files
        createImageObject(files)
    }

    const createImageObject = (files) => {
        const imgSrcList = []
        // console.log(files);
        for (let image of files) {
            imgSrcList.push(URL.createObjectURL(image))
        }

        // console.log(imgSrcList)
        handleUploadImage(imgSrcList)
    }

    return (
        <div
            className="w-80 h-[300px] md:w-[430px] md:h-[550px] flex flex-col text-center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="px-1 py-2 font-medium border-b-gray-300 border-b-[1px]">
                Tạo post mới
            </div>

            {/* Dragover */}
            <div className="flex flex-col items-center justify-center flex-grow text-lg">
                <label
                    className="px-3 py-1 font-medium text-white bg-blue-500 rounded-lg cursor-pointer"
                    htmlFor="image"
                >
                    Chọn ảnh từ máy tính!
                </label>
                <span className="inline-block my-5 text-xl font-light text-gray-600">
                    Hoặc kéo ảnh vào đây nè!
                </span>
                <div className="text-5xl">
                    <FontAwesomeIcon icon={faImages} />
                </div>
            </div>

            {/* form upload */}
            <form className="hidden">
                <input id="image" type="file" onChange={handleChangeImage} multiple></input>
            </form>
        </div>
    )
}

export default UploadImage
