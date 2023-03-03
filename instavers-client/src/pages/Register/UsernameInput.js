import UserService from '../../services/UserService'

function UsernameInput({ register, error, isCheckExist }) {
    const checkuserName = async (username) => {
        let message
        try {
            await UserService.checkExistUsername(username)
            return true
        } catch (error) {
            message = `Tên người dùng đã tồn tại`
            return message
        }
        // return true
    }

    function valid_username(username) {
        const regex = /^[a-z0-9_]+$/
        return regex.test(username)
    }
    return (
        <div className="py-2 text-left">
            <input
                {...register('username', {
                    required: 'Tên người dùng là bắt buộc',
                    minLength: {
                        value: 5,
                        message: 'Từ 5 kí tự trở lên!',
                    },
                    validate: {
                        // you can do asynchronous validation as well
                        valid: async (value) =>
                            valid_username(value) || "Tên gồm in thường, số, '-' , '_'",
                        checkExist: isCheckExist
                            ? async (value) => await checkuserName(value)
                            : () => true,
                    },
                })}
                autoComplete="off"
                className="block w-full px-4 py-2 bg-gray-100 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                placeholder="Tên người dùng"
            />
            {error && <span className="inline-block px-2 text-red-500">{error.message}</span>}
        </div>
    )
}

export default UsernameInput
