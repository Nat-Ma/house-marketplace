import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { getAuth, updateProfile, updateEmail } from 'firebase/auth'
import {
    updateDoc,
    doc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    deleteDoc,
  } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

const Profile = () => {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)

    const auth = getAuth()
    const [changeDetails, setChangeDetails] = useState(false)

    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    const { name, email } = formData

    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listings')

            const q = query(listingsRef, where('userRef', '==', `${auth.currentUser.uid}`), orderBy('timestamp', 'desc'))

            const querySnapshot = await getDocs(q)

            let listings = []

            querySnapshot.forEach(doc => {
                listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })

            setListings(listings)
            setLoading(false)
        }

        fetchUserListings()
    }, [auth.currentUser.uid])

    const onLogout = () => {
        auth.signOut()
        navigate('/')
    }

    const onSubmit = async () => {
        try {
            if(auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, { displayName: name })
                await updateEmail(auth.currentUser, email)
    
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, { email, name })
                toast.success('User successfully updated!')
            }
        } catch (err) {
            toast.error('Could not update profile details.')
        }
    }

    const onChange = (e) => {
        setFormData((prev) => ({
            ...prev, 
            [e.target.id]: e.target.value
        }))
    }

    const onDelete = async (id) => {
        if (window.confirm('Sure?')) {
            await deleteDoc(doc(db, 'listings', id))
            setListings(listings.filter(listing => listing.id !== id))
            toast.success('Sucessfully deleted item!')
        }
    }

    const onEdit = async (id) => {
        navigate(`/edit-listing/${id}`)
    }

    if(loading) {
        return <Spinner />
    }


    return (
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                <button type="button" className="logOut" onClick={onLogout}>Logout</button>
            </header>
            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailsText">Personal Details</p>
                    <p className="changePersonalDetails" onClick={() => {
                        changeDetails && onSubmit()
                        setChangeDetails(prev => !prev)
                    }}>
                        {changeDetails ? 'done' : 'change'}
                    </p>
                </div>
                <div className="profileCard">
                    <form>
                        <input type="text" id="name" className={!changeDetails ? 'profileName' : 'profileNameActive'} disabled={!changeDetails} value={name} onChange={onChange}/>
                        <input type="text" id="email" className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} disabled={!changeDetails} value={email} onChange={onChange}/>
                    </form>
                </div>

                <Link to="/create-listing" className="createListing">
                    <img src={homeIcon} alt="home" />    
                    <p>Sell or rent your home</p>
                    <img src={arrowRight} alt="arrow right" />
                </Link>

                {!loading && listings?.length > 0 && (
                    listings.map(({ data, id }) => (
                        <ListingItem key={id} listing={data} id={id} onDelete={() => onDelete(id)} onEdit={() => onEdit(id)} />
                    ))
                )}
            </main>
        </div>
    )
}

export default Profile
