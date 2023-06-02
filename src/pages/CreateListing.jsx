import React, { useEffect, useState, useRef } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { serverTimestamp, addDoc, collection } from "firebase/firestore"
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import { v4 as uuidv4 } from "uuid"

const CreateListing = () => {
    const navigate = useNavigate()
    const _isMounted = useRef(true)
    const auth = getAuth()

    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        type: "rent",
        bathrooms: 1,
        bedrooms: 1,
        discountedPrice: 0,
        furnished: false,
        lat: 0,
        lng: 0,
        imgUrls: {},
        location: "",
        name: "",
        offer: false,
        parking: false,
        regularPrice: 0,
    })

    const { 
        type, 
        bathrooms, 
        bedrooms, 
        discountedPrice, 
        furnished,  
        imgUrls,
        location, 
        name, 
        offer, 
        parking, 
        regularPrice } = formData

    useEffect(() => {
        if (_isMounted) {
            onAuthStateChanged((auth), (user) => {
                if (user) {
                    setFormData({ ...formData, userRef: user.uid })
                    setLoading(false)
                } 
            })
        }
        return () => _isMounted.current = false
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_isMounted])

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (discountedPrice >= regularPrice) {
            setLoading(false)
            toast.error('Discounted price should be less than the regular price.')
            return
        }

        if (imgUrls.length > 6) {
            setLoading(false)
            toast.error('You cannot upload more than 6 images.')
            return
        }
        
        // for every image in the url list we need to do the images Ref
        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

                const storageRef = ref(storage, 'images/' + fileName)
                const uploadTask = uploadBytesResumable(storageRef, image)
                
                uploadTask.on('state_changed', 
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        console.log('Upload is ' + progress + '% done')
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused')
                                break
                            case 'running':
                                console.log('Upload is running')
                                break
                            default:
                                break
                          }
                    }, 
                    (error) => {
                        reject(error)
                    }, 
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL)
                        });
                    }
                );
            })
        }

        const newImgUrls = await Promise.all(
            [...imgUrls].map((image) => storeImage(image))
        ).catch(() => {
            setLoading(false)
            toast.error('Images not uploaded.')
            return
        })

        const formDataCopy = {
            ...formData,
            imgUrls: [...newImgUrls],
            timestamp: serverTimestamp(),
        }
    
        delete formDataCopy.address
        !formDataCopy.offer && delete formDataCopy.discountedPrice
    
        const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
        setLoading(false)
        toast.success('Listing saved')
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }

    const onMutate = (e) => {
        // handle value when boolean
        let boolean = null
        if (e.target.value === 'true') {
            boolean = true
        } 
        if (e.target.value === 'false') {
            boolean = false
        }

        if(!e.target.files) {
            setFormData(prev => ({
                ...prev,
                [e.target.id]: boolean ?? e.target.value
            }))
        }

        if(e.target.files) {
            setFormData(prev => ({
                ...prev,
                imgUrls: e.target.files
            }))
        }
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <div className="profile">
            <header>
                <p className="pageHeader">Create a Listing</p>
            </header>
            <main>
                <form onSubmit={onSubmit}>
                    <label htmlFor="type" className="formLabel">Sell / Rent</label>
                    <div className="formButtons">
                        <button 
                            type="button" 
                            className={type === "sale" ? "formButtonActive" : "formButton"} 
                            id="type" 
                            value="sale" 
                            onClick={onMutate}
                        >
                            Sell
                        </button>

                        <button 
                            type="button" 
                            className={type === "rent" ? "formButtonActive" : "formButton"} 
                            id="type" 
                            value="rent" 
                            onClick={onMutate}
                        >
                            Rent
                        </button>
                    </div>

                    <label htmlFor="name" className="formLabel">Name</label>
                    <input 
                        type="text" 
                        className="formInputName"
                        id="name"
                        value={name}
                        onChange={onMutate}
                        maxLength="32"
                        minLength="10"
                        required
                    />

                    <div className="formRooms flex">
                        <div>
                            <label htmlFor="bathrooms" className="formLabel">Bathrooms</label>
                            <input 
                                type="number" 
                                className="formInputSmall"
                                id="bathrooms"
                                value={bathrooms}
                                onChange={onMutate}
                                min="1"
                                max="50"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="bedrooms" className="formLabel">Bedrooms</label>
                            <input 
                                type="number" 
                                className="formInputSmall"
                                id="bedrooms"
                                value={bedrooms}
                                onChange={onMutate}
                                min="1"
                                max="50"
                                required
                            />
                        </div>
                    </div>

                    <label htmlFor="parking" className="formLabel">Parking</label>
                    <div className="formButtons">
                        <button 
                            type="button" 
                            className={parking ? "formButtonActive" : "formButton"} 
                            id="parking" 
                            value={true}
                            onClick={onMutate}
                        >
                            Yes
                        </button>

                        <button 
                            type="button" 
                            className={!parking && parking !== null ? "formButtonActive" : "formButton"} 
                            id="parking" 
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label htmlFor="furnished" className="formLabel">furnished</label>
                    <div className="formButtons">
                        <button 
                            type="button" 
                            className={furnished ? "formButtonActive" : "formButton"} 
                            id="furnished" 
                            value={true}
                            onClick={onMutate}
                        >
                            Yes
                        </button>

                        <button 
                            type="button" 
                            className={!furnished && furnished !== null ? "formButtonActive" : "formButton"} 
                            id="furnished" 
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label htmlFor="location" className='formLabel'>Address</label>
                    <textarea
                        className='formInputAddress'
                        type='text'
                        id='location'
                        value={location}
                        onChange={onMutate}
                        required
                    />

                    <label htmlFor="offer" className='formLabel'>Offer</label>
                    <div className='formButtons'>
                        <button
                            className={offer ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='offer'
                            value={true}
                            onClick={onMutate}
                        >
                            Yes
                        </button>
                        <button
                            className={
                                !offer && offer !== null ? 'formButtonActive' : 'formButton'
                            }
                            type='button'
                            id='offer'
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label htmlFor="regularPrice" className='formLabel'>Regular Price</label>
                    <div className='formPriceDiv'>
                        <input
                        className='formInputSmall'
                        type='number'
                        id='regularPrice'
                        value={regularPrice}
                        onChange={onMutate}
                        min='50'
                        max='750000000'
                        required
                        />
                        {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
                    </div>

                    {offer && (
                        <>
                            <label htmlFor="discountedPrice" className='formLabel'>Discounted Price</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='discountedPrice'
                                value={discountedPrice}
                                onChange={onMutate}
                                min='50'
                                max='750000000'
                                required={offer}
                            />
                        </>
                    )}

                    <label htmlFor="imgUrls" className='formLabel'>Images</label>
                    <p className='imagesInfo'>
                        The first image will be the cover (max 6).
                    </p>
                    <input
                        className='formInputFile'
                        type='file'
                        id='imgUrls'
                        onChange={onMutate}
                        max='6'
                        accept='.jpg,.png,.jpeg'
                        multiple
                        required
                    />

                    <button type='submit' className='primaryButton createListingButton'>
                        Create Listing
                    </button>

                </form>
            </main>
        </div>
    )
}

export default CreateListing