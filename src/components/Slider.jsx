import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase.config'
import { register } from 'swiper/element'
import Spinner from './Spinner'

const Slider = () => {

    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchListings = async () => {
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5))

            const querySnapshot = await getDocs(q)

            let listings = []

            querySnapshot.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setListings(listings)
            setLoading(false)
        }
        fetchListings()
        register()
    }, [])

    if(loading) {
        return <Spinner />
    }

    if (listings.length === 0) {
        return <></>
    }

  return listings && (
    <>
        <p className='exploreHeading'>Recommended</p>
        <swiper-container
            navigation="true" 
            pagination="true"
            slides-per-view="1"
            loop="true"
            style={{ height: '42vh'}}
        >
            {listings.map(({ data, id }) => {
                return <swiper-slide key={id}>
                    <div
                        style={{
                            background: `url(${data.imgUrls[0]}) center no-repeat`,
                            backgroundSize: 'cover'
                        }}
                        className='swiperSlideDiv'
                        onClick={() => navigate(`category/${data.type}/${id}`)}
                    >
                        <p className='swiperSlideText'>{data.name}</p>
                        <p className='swiperSlidePrice'>
                            ${data.discountedPrice ?? data.regularPrice}{' '}
                            {data.type === 'rent' && '/ month'}
                        </p>
                    </div>
                </swiper-slide>
            })}
        </swiper-container>
    </>
  )
}

export default Slider
