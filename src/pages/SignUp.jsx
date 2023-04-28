import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import { toast } from 'react-toastify'


const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '', 
    password: ''
  })

  const { name, email, password } = formData
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      updateProfile(auth.currentUser, { displayName: name })

      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()

      await setDoc(doc(db, 'users', user.uid), formDataCopy)

      navigate('/')
    } catch (err) {
      console.log(err.message)
      toast.error('Bad User Credentials')
    }

    setFormData({ name: '', email: '', password: '' })
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
        <p className="pageHeader">Sign Up!</p>
      </header>
      <form onSubmit={handleSubmit}>
      <input 
          className="nameInput" 
          placeholder="Name" 
          type="name" 
          name="name" 
          id="name" 
          value={name} 
          onChange={handleChange}
        />
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

        {/* <Link to="/forgot-password" className="forgotPasswordLink">Forgot Password</Link> */}
        <div className="signUpBar">
          <p className="signUpText">
            Sign Up
          </p>
          <button className="signUpButton" type="submit">
            <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
          </button>
        </div>
      </form>

      {/* Google OAuth */}

      <Link to="/sign-in" className="registerLink">
        Sign In Instead
      </Link>
    </div>
  )
}

export default SignUp
