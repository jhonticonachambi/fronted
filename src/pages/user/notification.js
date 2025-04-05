// // pages/user/Notifications
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import API_URL from '../../config/apiConfig';

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const userId = localStorage.getItem('userId');  // Obtenemos el ID de usuario desde el localStorage

//   // Fetch notifications cuando el componente se monta
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       if (!userId) {
//         console.error('User ID is missing');
//         return;
//       }

//       try {
//         const response = await axios.post(`${API_URL}/notification/notifications`, {
//           userId: userId  // Enviar el userId en el cuerpo de la solicitud
//         });
//         setNotifications(response.data.notifications);
//       } catch (error) {
//         console.error('Error fetching notifications:', error);
//       }
//     };

//     fetchNotifications();
//   }, [userId]);  // Dependencia en userId para ejecutar el efecto

//   // Función para marcar una notificación como leída
//   const markAsRead = async (notificationId) => {
//     if (!userId) {
//       console.error('User ID is missing');
//       return;
//     }

//     try {
//       // Enviar tanto notificationId como userId al backend
//       const response = await axios.post('http://localhost:5000/api/notification/notifications/mark-as-read', {
//         notificationId: notificationId,
//         userId: userId  // Aquí pasamos el userId
//       });
      
//       setNotifications(prevNotifications =>
//         prevNotifications.map(notification =>
//           notification._id === notificationId ? { ...notification, read: true } : notification
//         )
//       );
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   return (
//     <div className="notifications">
//       <h2>Notificaciones</h2>
//       {notifications.length === 0 ? (
//         <p>No tienes notificaciones</p>
//       ) : (
//         <ul>
//           {notifications.map(notification => (
//             <li key={notification._id} style={{ backgroundColor: notification.read ? '#f0f0f0' : '#d3ffd3' }}>
//               <p>{notification.message}</p>
//               {!notification.read && (
//                 <button onClick={() => markAsRead(notification._id)}>Marcar como leída</button>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Notifications;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/apiConfig';
import './Notifications.css'; // Archivo CSS específico para estilos

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  // Fetch notifications cuando el componente se monta
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) {
        setError('Usuario no identificado');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${API_URL}/notification/notifications`, {
          userId
        });
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Error al cargar notificaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  // Función para marcar una notificación como leída
  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`${API_URL}/notification/notifications/mark-as-read`, {
        notificationId,
        userId
      });
      
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setError('Error al marcar como leída');
    }
  };

  // Función para marcar todas como leídas
  const markAllAsRead = async () => {
    try {
      await axios.post(`${API_URL}/notification/notifications/mark-all-read`, {
        userId
      });
      
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      setError('Error al marcar todas como leídas');
    }
  };

  if (loading) {
    return <div className="notifications-loading">Cargando notificaciones...</div>;
  }

  if (error) {
    return <div className="notifications-error">{error}</div>;
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Notificaciones</h2>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={markAllAsRead}
            className="mark-all-read-btn"
          >
            Marcar todas como leídas
          </button>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <p className="no-notifications">No tienes notificaciones</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map(notification => (
            <li 
              key={notification._id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <p>{notification.message}</p>
                <span className="notification-date">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>
              {!notification.read && (
                <button 
                  onClick={() => markAsRead(notification._id)}
                  className="mark-read-btn"
                >
                  Marcar como leída
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;