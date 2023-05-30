import React from "react"
import { Routes, Route } from "react-router-dom"
import Navigation from "./components/Navigation"
import PrivateRoute from "./components/PrivateRoute"
import Explore from "./pages/Explore"
import Offers from "./pages/Offers"
import Category from "./pages/Category"
import Listing from "./pages/Listing"
import Contact from "./pages/Contact"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Profile from "./pages/Profile"
import CreateListing from "./pages/CreateListing"
import EditListing from "./pages/EditListing"
import ForgotPassword from "./pages/ForgotPassword"
import NotFound from "./pages/NotFound"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
      <div>
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/category/:categoryName" element={<Category />} />
            <Route path="/category/:categoryName/:listingId" element={<Listing />} />
            <Route path="/profile" element={<PrivateRoute />}>
              {/* renders the outlet */}
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/create-listing" element={<PrivateRoute />}>
              <Route path="/create-listing" element={<CreateListing />} />
            </Route>
            <Route path="/edit-listing" element={<PrivateRoute />}>
              <Route path="/edit-listing/:listingId" element={<EditListing />} />
            </Route>
            <Route path="/contact/:landlordId" element={<Contact />} />
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
