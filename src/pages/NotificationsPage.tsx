import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useSocialStore } from '../store/socialStore';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, markAllNotificationsRead } = useSocialStore();
  
  const handleMarkAll = () => {
    markAllNotificationsRead();
  };
  
  if (notifications.length === 0) {
    return (
      <div className="notifications-empty">
        <div className="notifications-empty-emoji">🔔</div>
        <h3>Tudo quieto por aqui</h3>
        <p>Quando alguém interagir com você, as notificações aparecerão neste espaço.</p>
        <button onClick={() => navigate('/social')}>Explorar Feed</button>
      </div>
    );
  }
  
  return (
    <div className="notifications-page">
      <header className="notifications-header">
        <h1>Notificações</h1>
        <button onClick={handleMarkAll}>Marcar todas como lidas</button>
      </header>
      
      <div className="notifications-list">
        {notifications.map((notif, i) => (
          <motion.div
            key={notif.id}
            className={`notification-item ${notif.read ? 'notif-read' : 'notif-unread'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {notif.user ? (
              <img src={notif.user.avatar} alt="" className="notif-avatar" />
            ) : (
              <div className="notif-icon-wrap">🚀</div>
            )}
            
            <div className="notif-content">
              <p>
                {notif.user && <strong>{notif.user.username} </strong>}
                {notif.text}
              </p>
              <span className="notif-time">{timeAgo(notif.createdAt)}</span>
            </div>
            
            {!notif.read && <div className="notif-dot" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}
