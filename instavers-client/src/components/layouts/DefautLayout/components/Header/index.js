import { faCirclePlus, faComment, faHouse } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cls from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import { open } from '../../../../../app/slices/modalSlice'

import logo from '../../../../../assets/logo.jpg'
import AccountNav from '../AccountNav'
import FriendshipNav from '../FriendshipNav'
import Notification from '../Notification'
import Search from '../Search'
import { useLocation } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

function Header() {
    const create = useSelector((state) => state.modal.create)
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()

    const location = useLocation()

    const [active_profile, set_active_profile] = useState('')

    const openCreate = (e) => {
        e.preventDefault()
        dispatch(open())
    }

    useEffect(() => {
        if (location.pathname.indexOf('chat') > -1) {
            set_active_profile('chat')
        }

        if (location.pathname === '/') {
            set_active_profile('home')
        }
    }, [location])

    return (
        <header className="fixed inset-0 z-10 h-16 bg-white border border-b-gray-300">
            <div className="flex items-center justify-between w-full h-full px-1 mx-auto text-black md:w-4/5 sm:px-5 md:px-10">
                <div className="flex-shrink-0 col-span-1 grow ">
                    <div className="w-20">
                        <NavLink to="/">
                            {' '}
                            <img src={logo} alt="logo" />
                        </NavLink>
                    </div>
                </div>

                <Search />
                <nav className="text-black grow">
                    <ul className="flex justify-end text-2xl gap-x-4 md:gap-x-5">
                        <li>
                            <NavLink
                                className={({ isActive }) => {
                                    return cls({ 'text-blue-500': isActive })
                                }}
                                to={'/'}
                            >
                                <FontAwesomeIcon icon={faHouse} />
                            </NavLink>
                        </li>
                        <li onClick={useLocation()}>
                            <NavLink
                                to={'/Chat'}
                                className={({ isActive }) => {
                                    return cls({ 'text-blue-500': isActive })
                                }}
                            >
                                {active_profile === 'chat' ? (
                                    <i
                                        className="fa fa-comment"
                                        style={{ fontSize: '25px', color: 'black' }}
                                    ></i>
                                ) : (
                                    <i
                                        className="fa fa-comment-o"
                                        style={{ fontSize: '25px', color: 'black' }}
                                    ></i>
                                )}
                                <FontAwesomeIcon icon={faComment} />
                            </NavLink>
                        </li>

                        <li onClick={openCreate}>
                            <a href="/#" className={cls({ 'text-blue-400': create })}>
                                <FontAwesomeIcon icon={faCirclePlus} />
                            </a>
                        </li>
                        <li>
                            <FriendshipNav />
                        </li>
                        <li>
                            <Notification />
                        </li>
                        <li>
                            <AccountNav user={user} />
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header
