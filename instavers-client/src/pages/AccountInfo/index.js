import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { update } from '../../app/slices/authSlice'
import UserService from '../../services/UserService'
import { removeAvatar, upload, uploadAvatar } from '../../storage'
import UploadAvatar from './UploadAvatar'

function AccountInfo() {
    const user = useSelector((state) => state.auth.user)

    const fileRef = useRef(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fullname: user.fullname || '',
            email: user.email || '',
            description: user.description || '',
            gender: user.gender || '1',
        },
    })

    const onSubmit = async (data) => {
        try {
            const [avatar] = fileRef.current.files
            if (avatar) {
                data.avatar = await uploadAvatar(avatar)
                console.log('Uploaded Avatar sucessfully')
            }
            const res = await UserService.update(data)
            if (user.avatar !== 'avatar/avatar.png') {
                await removeAvatar(user.avatar)
            }
            console.log(res)
            dispatch(update(res.user))
            navigate('/')
        } catch (error) {
            console.log('Error')
        }
    }

    const validEmail = (text) => {
        const email = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
        // console.log('Email', text)
        return email.test(text)
    }

    return (
        <div className="flex justify-center">
            <div className="w-full md:w-[60%] bg-indigo-100 h-fit pb-5 flex flex-col items-center rounded-lg">
                <UploadAvatar username={user.username} avatar={user.avatar} fileRef={fileRef} />

                <form className="w-full mt-3" method="POST" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex justify-between w-full mt-5">
                        <div className="w-[40%] flex justify-end items-start pt-3">
                            <label htmlFor="Name" className="text-xl ">
                                Tên người dùng
                            </label>
                        </div>

                        <div className="w-[55%] h-fit">
                            <input
                                id="Name"
                                {...register('fullname', { required: true })}
                                className="w-3/5 h-full p-2 text-xl border border-black rounded-md"
                                type="text"
                            />
                            <div className="mt-2 w-[70%]">
                                {!errors.fullname && (
                                    <span className="text-sm">
                                        Hãy chọn một cái tên thật đẹp nào!
                                    </span>
                                )}
                                {errors.fullname && (
                                    <span className="text-sm text-red-600">Tên bắt buộc</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between w-full mt-5">
                        <div className="w-[40%] flex justify-end items-center">
                            <label htmlFor="Email" className="text-xl">
                                Email
                            </label>
                        </div>
                        <div className="w-[55%] h-fit">
                            <input
                                id="Email"
                                {...register('email', {
                                    validate: {
                                        email: (value) =>
                                            validEmail(value) || 'Email không hợp lệ!',
                                    },
                                })}
                                className="w-3/5 h-full p-2 text-xl border border-black rounded-md"
                                type="text"
                            />

                            <div>
                                {errors.email && (
                                    <span className="block my-2 text-red-500">
                                        {errors.email?.message}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between w-full mt-5">
                        <div className="w-[40%] flex justify-end items-start pt-3">
                            <label htmlFor="BIO" className="text-xl">
                                Giới thiệu
                            </label>
                        </div>
                        <div className="w-[55%]">
                            <textarea
                                className="w-3/5 h-20 p-2 text-xl border border-black rounded-md"
                                {...register('description', { required: true, minLength: 20 })}
                                id="BIO"
                                cols="40"
                                rows="5"
                            ></textarea>
                            <div className="mt-2 w-[70%]">
                                {!errors.description && (
                                    <span className="text-sm">
                                        Giới thiệu đôi nét về bản thân đi nào bạn ơi!
                                    </span>
                                )}
                                {errors.description && (
                                    <span className="text-sm text-red-600"> Ít nhất 20 kí tự!</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between w-full mt-5">
                        <div className="w-[40%] flex justify-end items-center">
                            <label htmlFor="Gender" className="text-xl">
                                Giới tính
                            </label>
                        </div>
                        <div className="w-[55%] h-fit">
                            <select
                                className="w-3/5 h-full p-2 text-xl border border-black rounded-md"
                                {...register('gender', { required: true })}
                                id="Gender"
                            >
                                <option value="1">Nam</option>
                                <option value="0">Nữ</option>
                                <option value="2">Khác</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-between w-full mt-5">
                        <div className="w-[57%] flex justify-end items-center">
                            <button className="px-3 py-2 text-lg text-white rounded-md bg-sky-600">
                                Lưu
                            </button>
                        </div>
                        <div className="w-[55%]"></div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AccountInfo
