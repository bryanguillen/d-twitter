import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { IoHomeSharp } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';
import './NavigationBar.css';

export default function NavigationBar({
  handleClickOnConnect,
  loggedIn
}) {
  const history = useHistory();

  return (
    <div className="navigation-bar">
      <IconContext.Provider value={{ size: '2.5rem' }}>
        <IoHomeSharp  className="navigation-bar-home-button" onClick={() => history.push('/')}/>
      </IconContext.Provider>
      {!loggedIn ? <button className="navigation-bar-connect-button" onClick={handleClickOnConnect}>Connect</button> : null}
    </div>
  );
}

NavigationBar.propType = {
  handleClickOnConnect: PropTypes.func,
  loggedIn: PropTypes.bool
};