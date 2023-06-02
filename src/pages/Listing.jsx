import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { register } from 'swiper/element/bundle'
import { getAuth } from 'firebase/auth'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import shareIcon from '../assets/svg/shareIcon.svg'

const Listing = () => {
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)

    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchListing = async() => {
            try {
                const docRef = doc(db, "listings", `${params.listingId}`);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setListing(docSnap.data())
                    setLoading(false)
                } else {
                    // docSnap.data() will be undefined in this case
                    console.log("No such document!");
                }
            } catch (error) {
                toast.error(error)
            }
        }
        
        fetchListing()
        register()
    }, [navigate, params.listingId])

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <main>
            <div className="shareIconDiv" onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                setShareLinkCopied(true)
                setTimeout(() => {
                    setShareLinkCopied(false)
                }, 2000)
                }}>
                <img src={shareIcon} alt="share link icon" />
            </div>
            {shareLinkCopied && <p className="linkCopied">Link Copied</p>}

            <swiper-container
                navigation="true" 
                pagination="true"
                slides-per-view="1"
                loop="true"
                style={{ height: '42vh'}}
            >
                {listing.imgUrls.map((url, i) => {
                    return <swiper-slide key={i}>
                        <div
                            style={{
                                background: `url(${url}) center no-repeat`,
                                backgroundSize: 'cover'
                            }}
                            className='swiperSlideDiv'
                        ></div>
                    </swiper-slide>
                })}
            </swiper-container>

            <div className="listingDetails">
                <p className="listingName">
                    {listing.name} - ${
                        listing.offer 
                        ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') 
                        : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                </p>
                <p className="listingLocation">{listing.location}</p>
                <p className="listingType">For {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>
                {listing.offer && (
                    <p className="discountPrice">
                        ${listing.regularPrice - listing.discountedPrice} discount
                    </p>
                )}
                <ul className="listingDetailsList">
                    <li>
                        {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
                    </li>
                    <li>
                        {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}
                    </li>
                    <li>{listing.parking && 'Parking Spot'}</li>
                    <li>{listing.furnished && 'Furnished'}</li>
                </ul>

                <p className="listingLocationTitle">Location</p>

                <div className="leafletContainer">
                    <MapContainer
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                        center={[52.520008, 13.404954]}
                        zoom={15}
                        scrollWheelZoom={false}
                    >
                        <TileLayer 
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                        />
                        <Marker 
                            position={[52.520008, 13.404954]}
                        >
                            <Popup>{'Berlin Mitte some address'}</Popup>
                        </Marker>
                    </MapContainer>
                </div>

                {auth.currentUser?.uid !== listing.userRef && (
                    <Link 
                        to={`/contact/${listing.userRef}?listingName=${listing.name}`} 
                        className='primaryButton'
                    >
                        Contact Landlord
                    </Link>
                )}
            </div>
        </main>
    )
}

export default Listing
