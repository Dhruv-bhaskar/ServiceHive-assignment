import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchMyBids } from '../store/slices/bidSlice'

function MyBids() {
  const dispatch = useDispatch()
  const { myBids, loading } = useSelector((state) => state.bids)

  useEffect(() => {
    dispatch(fetchMyBids())
  }, [dispatch])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Submitted Bids</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : myBids.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You haven't submitted any bids yet</p>
          <Link
            to="/"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Gigs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myBids.map((bid) => (
            <div
              key={bid._id}
              className={`bg-white rounded-lg shadow-md p-6 ${
                bid.status === 'hired' ? 'border-2 border-green-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {bid.gigId?.title || 'Gig Deleted'}
                  </h3>
                  <p className="text-gray-600 mb-3">{bid.message}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-blue-600">₹{bid.price}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    bid.status === 'hired' 
                      ? 'bg-green-100 text-green-800' 
                      : bid.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {bid.status === 'hired' ? '🎉 Hired' : bid.status === 'rejected' ? 'Rejected' : 'Pending'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="text-sm text-gray-500">
                  <p>Gig Budget: ₹{bid.gigId?.budget || 'N/A'}</p>
                  <p>Gig Status: {bid.gigId?.status === 'open' ? 'Open' : 'Assigned'}</p>
                </div>
                {bid.gigId && (
                  <Link
                    to={`/gig/${bid.gigId._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    View Gig
                  </Link>
                )}
              </div>

              {bid.status === 'hired' && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-semibold">
                    🎉 Congratulations! You've been hired for this project.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBids