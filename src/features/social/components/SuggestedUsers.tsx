import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useSocialStore } from '../../../store/socialStore';

export function SuggestedUsers() {
  const navigate = useNavigate();
  const { getSuggestedUsers, toggleFollow } = useSocialStore();
  const users = getSuggestedUsers();
  
  if (users.length === 0) return null;
  
  return (
    <div className="suggested-users">
      <div className="suggested-header">
        <h3>✨ Viajantes pra seguir</h3>
        <button>Ver todos</button>
      </div>
      
      <div className="suggested-scroll">
        {users.map((user, i) => (
          <motion.div
            key={user.id}
            className="suggested-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              className="suggested-info"
              onClick={() => navigate(`/u/${user.username}`)}
            >
              <img src={user.avatar} alt={user.name} className="suggested-avatar" />
              <div className="suggested-name">
                {user.name}
                {user.verified && <span className="suggested-verified">✓</span>}
              </div>
              <div className="suggested-username">@{user.username}</div>
              <div className="suggested-meta">
                🌍 {user.countriesCount} países
              </div>
            </button>
            
            <button
              className={`suggested-follow ${user.isFollowing ? 'suggested-following' : ''}`}
              onClick={() => toggleFollow(user.id)}
            >
              {user.isFollowing ? 'Seguindo' : 'Seguir'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
