import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'react-toastify'
import { ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const auth = getAuth()

  const onChange = (e) => setEmail(e.target.value)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Reset password email was sent.')
    } catch (err) {
      toast.error('Email could not be sent to the provided address.')
    }
  }


  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input 
            type="email" 
            className="emailInput" 
            placeholder="Enter your email" 
            value={email}
            id="email"
            name="email"
            onChange={onChange}
          />
          <Link className="forgotPasswordLink" to="/sign-in">Reset Password</Link>

          <div className="signInBar">
            <div className="signInText">Send Reset Link</div>
            <button className="signInButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default ForgotPassword
