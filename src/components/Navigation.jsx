import React from 'react'
import { NavLink } from "react-router-dom"
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg'
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg'
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg'

const Navigation = () => {

  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          <NavLink to="/" className="navbarListItem" >
            <ExploreIcon/>
            <p className='navbarListItemName'>Explore</p>
          </NavLink>
          <NavLink to="/profile" className="navbarListItem">
            <PersonOutlineIcon/>
            <p className='navbarListItemName'>Profile</p>
          </NavLink>
          <NavLink to="/offers" className="navbarListItem">
            <OfferIcon/>
            <p className='navbarListItemName'>Offers</p>
          </NavLink>
        </ul>
      </nav>
    </footer>
  )
}

export default Navigation
