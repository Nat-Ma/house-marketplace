import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthStatus from '../hooks/useAuthStatus'

const PrivateRoute = () => {
    const { loggedIn, checkingStatus } = useAuthStatus()

    if (checkingStatus) {
        // needed cause loggedIn takes some time and we display h3 instead of redirecting
        return <h3>Loading...</h3>
    }

    return (
        <>
            {loggedIn ? <Outlet /> : <Navigate to="/sign-in" />}
        </>
    )
}

export default PrivateRoute
