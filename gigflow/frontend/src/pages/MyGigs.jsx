import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchMyGigs, deleteGig } from '../store/slices/gigSlice'

function MyGigs() {
  const dispatch = useDispatch()
  const { myGigs, loading } = useSelector((state) => state.gigs)

  useEffect(() => {
    dispatch(fetchMyGigs())
  }, [dispatch])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
      dispatch(deleteGig(id))
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Posted Gigs</h1>
        <Link
          to="/create-gig"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Post New Gig
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : myGigs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You haven't posted any gigs yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myGigs.map((gig) => (
            <div key={gig._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{gig.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      gig.status === 'open' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {gig.status === 'open' ? 'Open' : 'Assigned'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">{gig.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-semibold text-blue-600 text-lg">₹{gig.budget}</span>
                    <span>Posted {new Date(gig.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    to={`/gig/${gig._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDelete(gig._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyGigs