import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Home from './pages/home/Home';
import Loading from './pages/loading/Loading';
import getWeb3 from './utils/get-web-3';
import DecentralizedTwitter from './contracts/DecentralizedTwitter.json';
import './App.css';

function App() {
  const [accountData, setAccountData] = useState({ loginAttempted: false, address: '' });
  const [decentralizedTwitter, setDecentralizedTwitter] = useState(null);
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
   * @description Used to set account data
   */
  useEffect(() => {
    (async function() {
      if (web3) {
        const [address] = await web3.eth.getAccounts();
        setAccountData({ loginAttempted: true, address }); // perhaps there is an easier way of identifying account or not
      }
    })();
  }, [web3]);

  /**
   * @description Used to load blockchain data
   */
  useEffect(() => {
    (async function() {
      const { address, loginAttempted } = accountData;
  
      if (loginAttempted && address) {
        const networkId = await web3.eth.net.getId();
        const networkData = DecentralizedTwitter.networks[networkId];
        if(networkData) {
          const dTwitter = new web3.eth.Contract(DecentralizedTwitter.abi, networkData.address);
          setDecentralizedTwitter(() => dTwitter);
        }
      }
    })();
  }, [accountData]);

  /**
   * @description Used to now interact with block chain and load application data
   */
  useEffect(() => {
    (async function() {
      if (decentralizedTwitter) {
        const userData = await decentralizedTwitter.methods.getUser().call();
        if (!userData.exists) {
          // @TODO create user
        } else {
          // @TODO set user
        }
      }
    })();
  }, [decentralizedTwitter]);

  return (
    <Router>
      <div className="app">
        {
          accountData.loginAttempted ?
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
