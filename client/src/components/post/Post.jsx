import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { IoHeartOutline, IoHeartSharp } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';
import ProfileImage from '../profile-image/ProfileImage';
import './Post.css';

/**
 * UI Component for post
 */
export default function Post({
  numLikes,
  postLiked,
  text,
  userId,
  userImageUrl,
  username,
}) {
  const history = useHistory(); // this should be moved to parent

  return (
    <div className="post">
      <div className="post-content-container">
        <div className="post-profile-image-container">
          <ProfileImage url={userImageUrl}/>
        </div>
        <div className="post-username-and-content-container">
          <div className="post-username" onClick={() => history.push(`/profile/${userId}`)}>{username}</div>
          <div className="post-text-and-image-container">
            {text ? <div className="post-text">{text}</div> : null}
          </div>
        </div>
      </div>
      <div className="post-like-button-container">
        <IconContext.Provider value={{ size: '2rem', color: 'red' }}>
          {postLiked ? <IoHeartSharp className="post-like-button"/> : <IoHeartOutline className="post-like-button"/>}
        </IconContext.Provider>
        <div className="post-num-likes">{numLikes}</div>
      </div>
    </div>
  )
}

Post.propTypes = {
  imageUrl: PropTypes.string,
  numLikes: PropTypes.number,
  text: PropTypes.string,
  userImageUrl: PropTypes.string,
  username: PropTypes.string
};