import PropTypes from 'prop-types';
import ProfileImage from '../profile-image/ProfileImage';
import './ProfileCard.css';

export default function ProfileCard({
  userImageUrl,
  username
}) {
  return (
    <div className="profile-card">
      <div className="profile-card-image-container">
        <ProfileImage url={userImageUrl}/>
      </div>
      <div className="profile-card-username">{username}</div>
    </div>
  );
}

ProfileCard.propTypes = {
  userImageUrl: PropTypes.string,
  username: PropTypes.string
};