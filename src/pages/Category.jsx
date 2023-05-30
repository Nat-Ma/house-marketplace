import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import ListingItem from '../components/ListingItem'
import Spinner from '../components/Spinner'

const Category = () => {

    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setLastFetchedListing] = useState(null)

    const params = useParams()

    useEffect(() => {
        const fetchListings = async() => {
            try {
                const listingsRef = collection(db, 'listings')
                const q = query(listingsRef, where('type', '==', params.categoryName), orderBy('timestamp', 'desc'), limit(10))

                // Execute query
                const querySnap = await getDocs(q)
                const listings = []

                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setLastFetchedListing(lastVisible)

                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                setListings(listings)
                setLoading(false)
            } catch (err) {
                toast.error('Could not fetch listings.')
            }
        }
        
        fetchListings()
    }, [params.categoryName])

    // Pagination / Load More
    const onFetchMoreListings = async() => {
        try {
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, where('type', '==', params.categoryName), orderBy('timestamp', 'desc'), startAfter(lastFetchedListing), limit(10))

            // Execute query
            const querySnap = await getDocs(q)
            const listings = []

            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedListing(lastVisible)

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setListings((prev) => [...prev, ...listings])
            setLoading(false)
        } catch (err) {
            toast.error('Could not fetch listings.')
        }
    }

    return (
        <div className="category">
            <header>
                <p className="pageHeader">
                    {params.categoryName === 'rent' ? 'Places for rent' : 'Places for sale'
                }</p>
            </header>
            {loading ? (
                <Spinner />
            ) : listings && listings.length > 0 ? (
                <>
                    <main>
                        <ul className="categoryListings">
                            {listings.map((listing) => (
                                <ListingItem 
                                    key={listing.id}
                                    listing={listing.data}
                                    id={listing.id}
                                >{listing.data.name}</ListingItem>
                            ))}
                        </ul>
                    </main>
                    <br />
                    {lastFetchedListing && (
                        <p className="loadMore" onClick={onFetchMoreListings}>Load More</p>
                    )}
                </>
                ) : (
                    <p>No listings for {params.categoryName}</p>
                )
            }
        </div>
    )
}

export default Category
