import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { addNotification, removeNotification } from '../store/slices/notificationSlice'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function Notifications() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { notifications } = useSelector((state) => state.notifications)

  useEffect(() => {
    if (!user) return

    const socket = io(API_URL)

    socket.on('connect', () => {
      console.log('Connected to socket server')
      socket.emit('join', user.id)
    })

    socket.on('hired', (data) => {
      dispatch(addNotification({
        type: 'success',
        message: data.message,
        gigTitle: data.gigTitle
      }))

      // Auto remove after 5 seconds
      setTimeout(() => {
        dispatch(removeNotification(Date.now()))
      }, 5000)
    })

    return () => {
      socket.disconnect()
    }
  }, [user, dispatch])

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-sm animate-slide-in"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold">🎉 Congratulations!</p>
              <p className="text-sm mt-1">{notif.message}</p>
            </div>
            <button
              onClick={() => dispatch(removeNotification(notif.id))}
              className="ml-4 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Notifications