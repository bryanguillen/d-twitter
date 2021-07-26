import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import DecentralizedTwitter from './contracts/DecentralizedTwitter.json';
import getWeb3 from './utils/get-web-3';
import Home from './pages/home/Home';
import initializeAppStores from './utils/initialize-app-stores';
import Loading from './pages/loading/Loading';
import './App.css';

function App() {
  const [decentralizedTwitterContract, setDecentralizedTwitterContract] = useState(null);
  const [stores, setStores] = useState({ user: null, post: null, initialized: false });
  const [web3, setWeb3] = useState(null);

  /**
   * @description Used to initialize application; NOTE: THIS ASSUMES USER
   * HAS PROPER SETUP
   */
  useEffect(() => {
    (async function() {
      try {
        const { post, user } = await initializeAppStores('http://localhost:5002');
        setStores({ post, user, initialized: true });

        const web3 = await getWeb3();
        setWeb3(web3);

        const networkId = await web3.eth.net.getId();
        const networkData = DecentralizedTwitter.networks[networkId];
        const dTwitter = new web3.eth.Contract(DecentralizedTwitter.abi, networkData.address)
        setDecentralizedTwitterContract(dTwitter);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <Router>
      <div className="app">
        {
          web3 && stores.initialized ?
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
