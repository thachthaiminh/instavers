import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cls from 'classnames'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { logout } from '../../../../../app/slices/authSlice'

function AccountNav({ user }) {
    const [open, setOpen] = useState(false)

    const dispatch = useDispatch()
    const handleLogout = () => {
        dispatch(logout())
    }

    return (
        <div className="relative z-0">
            <span className="cursor-pointer peer">
                <FontAwesomeIcon
                    icon={faUserCircle}
                    onClick={() => setOpen(!open)}
                    className="user"
                />
            </span>
            <div
                className={cls(
                    'bg-white hidden hover:block transition-all  absolute w-40 right-0  border rounded-lg p-2 text-[15px] font-medium z-10',
                    { '!block': open }
                )}
            >
                <ul>
                    <li>
                        <NavLink to={`/profile/${user.username}`}>Trang cá nhân</NavLink>
                    </li>
                    <li>
                        <NavLink to={'/account'}>Thông tin cá nhân</NavLink>
                    </li>
                    <li onClick={handleLogout}>
                        <NavLink to={'/'}>Đăng xuất</NavLink>
                    </li>
                </ul>
            </div>

            {open && <div className="fixed inset-0 z-0" onClick={() => setOpen(false)}></div>}
        </div>
    )
}

export default AccountNav
