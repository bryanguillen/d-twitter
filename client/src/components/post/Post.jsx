import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import ProfileImage from '../profile-image/ProfileImage';
import './Post.css';

/**
 * UI Component for post
 */
export default function Post({
  text,
  userId,
  userImageUrl,
  username
}) {
  const history = useHistory(); // this should be moved to parent

  return (
    <div className="post">
      <div className="post-content-container">
        <div className="post-profile-image-container">
          <div className="profile-image" style={{ backgroundImage: `url("${userImageUrl}")` }}></div>
        </div>
        <div className="post-username-and-content-container">
          <div className="post-username" onClick={() => history.push(`/profile/${userId}`)}>{username}</div>
          <div className="post-text-and-image-container">
            {text ? <div className="post-text">{text}</div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

Post.propTypes = {
  imageUrl: PropTypes.string,
  text: PropTypes.string,
  userImageUrl: PropTypes.string,
  username: PropTypes.string
};