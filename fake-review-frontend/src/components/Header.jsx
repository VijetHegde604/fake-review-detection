import React from 'react'
import { NavLink } from 'react-router'
function Header() {
    return (
        <header className="bg-white shadow-md w-full fixed top-0 font-mono">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-lg font-bold text-indigo-600">
                    Review Guard</div>
                <nav>
                    <ul className="flex space-x-6 text-gray-600 font-bold">
                        <li>
                            <NavLink
                                to={"/"}
                                className={({ isActive }) =>
                                    `block py-2 pr-4 pl-3 duration-200 border-b ${isActive ? "text-purple-700" : "text-gray-700"} border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-blue-700 lg:p-0`}
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={"/about"}
                                className={({ isActive }) =>
                                    `block py-2 pr-4 pl-3 duration-200 border-b ${isActive ? "text-purple-700" : "text-gray-700"} border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-blue-700 lg:p-0`}
                            >
                                About
                            </NavLink>
                        </li>
                        <li>
                            <a
                                href="https://github.com/VijetHegde604/fake-review-detection"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-indigo-600"
                            >
                                GitHub
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header >
    )
}

export default Header