import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Home from './pages/home/Home';
import Loading from './pages/loading/Loading';
import getWeb3 from './utils/get-web-3';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);

  /**
   * @description Used to load web3 and account data from web3
   */
  useEffect(() => {
    (async function() {
      setWeb3(await getWeb3());
    })();
  }, []);

  /**
   * @description Used to set connection error value
   */
  useEffect(() => {
    (async function() {
      if (web3) {
        const [web3Account] = await web3.eth.getAccounts();
        setAccount(web3Account); // perhaps there is an easier way of identifying account or not
      }
    })();
  }, [web3]);

  return (
    <Router>
      <div className="app">
        {
          web3 ?
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
