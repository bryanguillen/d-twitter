import PropTypes from 'prop-types';
import './ProfileImage.css';

export default function ProfileImage({
  url
}) {
  return (
    <div className="profile-image" style={{ backgroundImage: `url("${url}")` }}></div>
  );
}

ProfileImage.propTypes = {
  url: PropTypes.string
};