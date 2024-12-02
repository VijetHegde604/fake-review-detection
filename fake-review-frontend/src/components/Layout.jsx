import React from 'react'
import { Outlet } from 'react-router'
import Header from './Header'
function Layout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}
export default Layout