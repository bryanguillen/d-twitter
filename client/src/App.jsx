import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { initializeOrbitDb } from './utils/orbit-db-utils';
import getWeb3 from './utils/get-web-3';
import Home from './pages/home/Home';
import Loading from './pages/loading/Loading';
import './App.css';

function App() {
  const [userDb, setUserDb] = useState(null);
  const [web3, setWeb3] = useState(null);

  /**
   * @description Used to initialize applciation
   */
  useEffect(() => {
    (async function() {
      try {
        setUserDb(await initializeOrbitDb());
        setWeb3(await getWeb3());
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <Router>
      <div className="app">
        {
          userDb && web3 ?
            <Switch>
              <Route path="/">
                <Home/>
              </Route>
            </Switch> :
            <Loading/>
        }
      </div>
    </Router>
  );
}

export default App;
