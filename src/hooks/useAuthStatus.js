import { useEffect, useState, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const useAuthStatus = () => {
    const _isMounted = useRef(true)

    const [loggedIn, setLoggedIn] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)
    
    useEffect(() => {
        if (_isMounted) {
            const auth = getAuth()
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setLoggedIn(true)
                }
                setCheckingStatus(false)
            })
        }
        
        return () => { _isMounted.current = false }
    }, [_isMounted])

    return { loggedIn, checkingStatus }
}

export default useAuthStatus
