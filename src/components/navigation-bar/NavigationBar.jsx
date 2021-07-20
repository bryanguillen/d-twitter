import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { IoHomeSharp } from 'react-icons/io5';
import './NavigationBar.css';

export default function NavigationBar({
  handleClickOnHome
}) {
  return (
    <div className="navigation-bar">
      <IconContext.Provider value={{ size: '2.5rem' }}>
        <IoHomeSharp  className="navigation-bar-home-button" onClick={handleClickOnHome}/>
      </IconContext.Provider>
    </div>
  );
}

NavigationBar.propType = {
  handleClickOnHome: PropTypes.func
};