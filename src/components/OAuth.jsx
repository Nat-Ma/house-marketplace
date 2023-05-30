import { useLocation, useNavigate } from "react-router-dom"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import googleIcon from "../assets/svg/googleIcon.svg"

const OAuth = () => {
    const navigate = useNavigate()
    const location = useLocation()

    
    const onClick = async (e) => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            // Check for user in db
            const userRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(userRef)

            // If user doesnt exist, create user
            if (!docSnap.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            navigate('/')
        } catch (err) {
            toast.error(err.message)
        }
    }

  return (
    <div className="socialLogin">
        <p>Sign {location.pathname === "/sign-up" ? "up" : "in"} with </p>
      <button type="submit" className="socialIconDiv" onClick={onClick}>
        <img className="socialIconImg" src={googleIcon} alt="google" />
      </button>
    </div>
  )
}

export default OAuth
