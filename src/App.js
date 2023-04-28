import React from "react"
import { Routes, Route } from "react-router-dom"
import Navigation from "./components/Navigation"
import PrivateRoute from "./components/PrivateRoute"
import Home from "./pages/Home"
import Offers from "./pages/Offers"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Profile from "./pages/Profile"
import ForgotPassword from "./pages/ForgotPassword"
import NotFound from "./pages/NotFound"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
      <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
          <ToastContainer />
        <Navigation />
      </div>
  );
}

export default App;
