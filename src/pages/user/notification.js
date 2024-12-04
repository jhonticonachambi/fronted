// pages/user/Notifications
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem('userId');  // Obtenemos el ID de usuario desde el localStorage

  // Fetch notifications cuando el componente se monta
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) {
        console.error('User ID is missing');
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/notification/notifications', {
          userId: userId  // Enviar el userId en el cuerpo de la solicitud
        });
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [userId]);  // Dependencia en userId para ejecutar el efecto

  // Función para marcar una notificación como leída
  const markAsRead = async (notificationId) => {
    if (!userId) {
      console.error('User ID is missing');
      return;
    }

    try {
      // Enviar tanto notificationId como userId al backend
      const response = await axios.post('http://localhost:5000/api/notification/notifications/mark-as-read', {
        notificationId: notificationId,
        userId: userId  // Aquí pasamos el userId
      });
      
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="notifications">
      <h2>Notificaciones</h2>
      {notifications.length === 0 ? (
        <p>No tienes notificaciones</p>
      ) : (
        <ul>
          {notifications.map(notification => (
            <li key={notification._id} style={{ backgroundColor: notification.read ? '#f0f0f0' : '#d3ffd3' }}>
              <p>{notification.message}</p>
              {!notification.read && (
                <button onClick={() => markAsRead(notification._id)}>Marcar como leída</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
