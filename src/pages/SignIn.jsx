import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'


const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '', 
    password: ''
  })

  const { email, password } = formData
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      if (userCredential.user) {
        navigate('/')
      }
    } catch (err) {
      toast.error(err.message)
    }

    setFormData({ email: '', password: '' })
  }

  const handleChange = (e) => {
    setFormData(prev => ({ 
      ...prev, 
      [e.target.id]: e.target.value
    }))
  }

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Welcome Back!</p>
      </header>
      <form onSubmit={handleSubmit}>
        <input 
          className="emailInput" 
          placeholder="Email" 
          type="email" 
          name="email" 
          id="email" 
          value={email} 
          onChange={handleChange}
        />
        <div className="passwordInputDiv">
          <input 
            className="passwordInput"
            placeholder="Password"
            type={showPassword ? "text" : "password"} 
            name="password" 
            id="password" 
            value={password} 
            onChange={handleChange}
          />
          <img 
            src={visibilityIcon} 
            alt="show password" 
            className="showPassword" 
            onClick={() => setShowPassword(prev => !prev)}
          />
        </div>

        <Link to="/forgot-password" className="forgotPasswordLink">Forgot Password</Link>
        <div className="signInBar">
          <p className="signInText">
            Sign In
          </p>
          <button className="signInButton" type="submit">
            <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
          </button>
        </div>
      </form>

      {/* Google OAuth */}

      <Link to="/sign-up" className="registerLink">
        Sign Up Instead
      </Link>
    </div>
  )
}

export default SignIn
