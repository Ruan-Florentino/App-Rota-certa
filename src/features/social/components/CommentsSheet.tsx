import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Post } from '../../../types/social';
import { useSocialStore } from '../../../store/socialStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

export function CommentsSheet({ isOpen, onClose, post }: Props) {
  const { addComment, toggleCommentLike } = useSocialStore();
  const [text, setText] = useState('');
  
  const handleSubmit = () => {
    if (!text.trim()) return;
    addComment(post.id, text.trim());
    setText('');
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="comments-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="comments-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
          >
            <div className="comments-header">
              <div className="comments-drag" />
              <h3>Comentários</h3>
              <button onClick={onClose} className="comments-close">✕</button>
            </div>
            
            <div className="comments-list">
              {post.comments.length === 0 ? (
                <div className="comments-empty">
                  <div className="comments-empty-emoji">💬</div>
                  <p>Seja o primeiro a comentar</p>
                </div>
              ) : (
                post.comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    className="comment-item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <img src={comment.user.avatar} alt="" className="comment-avatar" />
                    <div className="comment-body">
                      <div className="comment-content">
                        <span className="comment-user">{comment.user.username}</span>
                        <span className="comment-text">{comment.text}</span>
                      </div>
                      <div className="comment-meta">
                        <span>{timeAgo(comment.createdAt)}</span>
                        {comment.likes > 0 && <span>{comment.likes} curtidas</span>}
                        <button>Responder</button>
                      </div>
                    </div>
                    <button
                      className="comment-like"
                      onClick={() => toggleCommentLike(post.id, comment.id)}
                    >
                      {comment.liked ? '❤️' : '🤍'}
                    </button>
                  </motion.div>
                ))
              )}
            </div>
            
            <div className="comments-input-wrap">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=you"
                alt=""
                className="comments-input-avatar"
              />
              <input
                type="text"
                className="comments-input"
                placeholder="Adicione um comentário..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              {text.trim() && (
                <motion.button
                  className="comments-send"
                  onClick={handleSubmit}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  Enviar
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}
