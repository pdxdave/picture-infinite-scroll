import React, {useState, useEffect, useRef} from 'react'
import Image from './Image'

const Search = () => {

    const wrapper = {
        margin: '0 auto',
        width: '80%'
    }

    const header = {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    }

    const [photos, setPhotos] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [loading, setLoading] = useState(false)

    const [search, setSearch] = useState('')
    const [query, setQuery] = useState('')
    
    const handleChange = (e) => {
        setSearch(e.target.value)
    }

    const handleSubmit = (e) => {
        setPhotos([])
        e.preventDefault()
        setQuery(search)
        setSearch('')
    }

    // #1
    useEffect(() => {
        fetchPhotos(pageNumber)
        //eslint-disable-next-line
    }, [query, pageNumber])



    const pageEnd = useRef()
    let num = 1;

    const loadMore = () => {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
    }

    // #2
    useEffect(() => {
        if(loading){
            const observer = new IntersectionObserver(entries =>{
                if(entries[0].isIntersecting){
                    num++;
                    loadMore();
                }
            }, {threshold: .5})
                observer.observe(pageEnd.current)
        }
    }, [loading, num])


    const fetchPhotos = async(pageNumber) => {

        const Key = process.env.REACT_APP_ACCESSKEY
        
        const res = await fetch(`https://api.unsplash.com/search/photos?client_id=${Key}&page=${pageNumber}&per_page=20&query=${query}`)
    
        const data = await res.json()
        
        setPhotos(pic => [...pic, ...data.results])
        setLoading(true)
    }


    return (
        
        <div style={wrapper}>
            <div style={header}>
            <h1>Unsplash - Infinite Scrolling</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    name="query"
                    value={search}
                    onChange={handleChange}
                    placeholder="Enter search query"
                />
                <button>Submit</button>
            </form>
            </div>
            <div className="cards">
                {photos.map((photo, index) => (
                    <Image photo={photo.urls.small} key={index} />
                ))}
                <p ref={pageEnd} />  
            </div>
        </div>
    )
}

export default Search
