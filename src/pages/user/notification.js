import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/apiConfig';
import { FiBell, FiCheck, FiCheckCircle, FiX, FiClock } from 'react-icons/fi';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('unread'); // 'unread' or 'all'
  const userId = localStorage.getItem('userId');

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

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return !notification.read;
    return true;
  });

  if (loading) {
    return (
      <div className="notifications-loading">
        <div className="spinner"></div>
        <p>Cargando notificaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-error">
        <FiX className="error-icon" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="notifications-container premium">
      <div className="notifications-header">
        <div className="header-title">
          <FiBell className="bell-icon" />
          <h2>Notificaciones</h2>
        </div>
        
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            No leídas
          </button>
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Todas
          </button>
        </div>
        
        {notifications.some(n => !n.read) && (
          <button 
            onClick={markAllAsRead}
            className="mark-all-read-btn"
          >
            <FiCheckCircle className="btn-icon" />
            Marcar todas como leídas
          </button>
        )}
      </div>
      
      {filteredNotifications.length === 0 ? (
        <div className="no-notifications">
          <FiCheck className="check-icon" />
          <p>No hay notificaciones {activeTab === 'unread' ? 'no leídas' : ''}</p>
        </div>
      ) : (
        <ul className="notifications-list">
          {filteredNotifications.map(notification => (
            <li 
              key={notification._id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <div className={`status-indicator ${notification.read ? 'read' : 'unread'}`}></div>
                <div className="message-container">
                  <p className="message">{notification.message}</p>
                  <div className="notification-footer">
                    <span className="notification-date">
                      <FiClock className="clock-icon" />
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification._id)}
                        className="mark-read-btn"
                      >
                        <FiCheck className="btn-icon" />
                        Marcar como leída
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;