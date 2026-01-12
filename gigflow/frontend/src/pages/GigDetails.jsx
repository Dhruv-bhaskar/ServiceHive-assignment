import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchGigById } from '../store/slices/gigSlice'
import { submitBid, fetchBidsForGig, hireFreelancer, clearSuccess } from '../store/slices/bidSlice'

function GigDetails() {
  const dispatch = useDispatch()
  const { id } = useParams()
  const { currentGig, loading: gigLoading } = useSelector((state) => state.gigs)
  const { bids, loading: bidLoading, success } = useSelector((state) => state.bids)
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  const [bidForm, setBidForm] = useState({
    message: '',
    price: ''
  })
  const [showBidForm, setShowBidForm] = useState(false)

  useEffect(() => {
    dispatch(fetchGigById(id))
  }, [dispatch, id])

  useEffect(() => {
    if (currentGig && user && currentGig.ownerId._id === user.id) {
      dispatch(fetchBidsForGig(id))
    }
  }, [currentGig, user, dispatch, id])

  useEffect(() => {
    if (success) {
      setBidForm({ message: '', price: '' })
      setShowBidForm(false)
      setTimeout(() => dispatch(clearSuccess()), 3000)
    }
  }, [success, dispatch])

  const handleBidSubmit = (e) => {
    e.preventDefault()
    dispatch(submitBid({
      gigId: id,
      message: bidForm.message,
      price: Number(bidForm.price)
    }))
  }

  const handleHire = (bidId) => {
    if (window.confirm('Are you sure you want to hire this freelancer?')) {
      dispatch(hireFreelancer(bidId))
    }
  }

  if (gigLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!currentGig) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Gig not found</p>
      </div>
    )
  }

  const isOwner = user && currentGig.ownerId._id === user.id
  const canBid = isAuthenticated && !isOwner && currentGig.status === 'open'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{currentGig.title}</h1>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            currentGig.status === 'open' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {currentGig.status === 'open' ? 'Open' : 'Assigned'}
          </span>
        </div>

        <p className="text-gray-600 mb-6 whitespace-pre-wrap">{currentGig.description}</p>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div>
            <p className="text-sm text-gray-500">Budget</p>
            <p className="text-3xl font-bold text-blue-600">₹{currentGig.budget}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Posted by</p>
            <p className="text-lg font-semibold">{currentGig.ownerId.name}</p>
            <p className="text-sm text-gray-500">{new Date(currentGig.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {canBid && (
          <div className="mt-6">
            {!showBidForm ? (
              <button
                onClick={() => setShowBidForm(true)}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                Submit a Bid
              </button>
            ) : (
              <form onSubmit={handleBidSubmit} className="space-y-4 border-t pt-6">
                <h3 className="text-xl font-semibold">Submit Your Bid</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Proposal
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={bidForm.message}
                    onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
                    placeholder="Explain why you're the best fit for this project..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={bidForm.price}
                    onChange={(e) => setBidForm({ ...bidForm, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={bidLoading}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {bidLoading ? 'Submitting...' : 'Submit Bid'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBidForm(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {isOwner && (
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Received Bids ({bids.length})</h2>
          
          {bids.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No bids yet</p>
          ) : (
            <div className="space-y-4">
              {bids.map((bid) => (
                <div
                  key={bid._id}
                  className={`border rounded-lg p-6 ${
                    bid.status === 'hired' 
                      ? 'border-green-500 bg-green-50' 
                      : bid.status === 'rejected'
                      ? 'border-gray-300 bg-gray-50 opacity-60'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-lg">{bid.freelancerId.name}</p>
                      <p className="text-sm text-gray-500">{bid.freelancerId.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">₹{bid.price}</p>
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        bid.status === 'hired' 
                          ? 'bg-green-200 text-green-800' 
                          : bid.status === 'rejected'
                          ? 'bg-red-200 text-red-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {bid.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{bid.message}</p>
                  
                  {bid.status === 'pending' && currentGig.status === 'open' && (
                    <button
                      onClick={() => handleHire(bid._id)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
                    >
                      Hire This Freelancer
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default GigDetails