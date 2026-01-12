import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchGigs } from '../store/slices/gigSlice'

function Home() {
  const dispatch = useDispatch()
  const { gigs, loading } = useSelector((state) => state.gigs)
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(fetchGigs())
  }, [dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(fetchGigs(search))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Available Gigs</h1>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search gigs by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setSearch('')
              dispatch(fetchGigs())
            }}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Clear
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No gigs found. Be the first to post one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <Link
              key={gig._id}
              to={`/gig/${gig._id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{gig.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{gig.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">₹{gig.budget}</span>
                <span className="text-sm text-gray-500">By {gig.ownerId?.name}</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Open</span>
                <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home