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
import NavigationBar from './components/navigation-bar/NavigationBar';
import Profile from './pages/profile/Profile';
import './App.css';

function App() {
  const [account, setAccount] = useState({ address: '', id: -1 });
  const [appDependencies, setAppDependencies] = useState({ initialized: false, decentralizedTwitterContract: null, stores: null, web3: null });

  /**
   * @description Used to initialize application; NOTE: THIS ASSUMES USER
   * HAS PROPER SETUP
   */
  useEffect(() => {
    (async function() {
      try {
        setAppDependencies(await getAppDependencies());
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  /**
   * @description Function used to create an account, if none exists
   */
  useEffect(() => {
    (async function() {
      const { initialized, web3 } = appDependencies;
      if (initialized) {
        const [address] = await web3.eth.getAccounts();
        if (address) {
          const { decentralizedTwitterContract, stores } = appDependencies;
          const userOnBlockchain = await decentralizedTwitterContract.methods.getUser().call({ from: address });
          if (userOnBlockchain.exists) {
            setAccount(() => ({ address, id: userOnBlockchain.userId}));
          } else {
            const userId = await getNewUserId();
            setupUserCreatedListener();
            await stores.user.put({ _id: userId, username: address });
            await decentralizedTwitterContract.methods.createUser(userId).send({ from: address });
            setAccount(previousState => ({...previousState, id: userId}))
          }
        }
      }
    })();
  }, [appDependencies]);

  /**
   * @description Abstraction for connecting user to application
   * @returns {undefined}
   */
  async function connect() {
    await window.ethereum.send('eth_requestAccounts');
    const { web3 } = appDependencies;
    const [address] = await web3.eth.getAccounts();
    setAccount(previousState => ({...previousState, address}));
  }

  /**
   * @description Abstraction for getting all of the dependencies needed before
   * starting app
   * @returns {Object}
   */
  async function getAppDependencies() {
    const { post, user } = await initializeAppStores('http://localhost:5002');
    const web3 = await getWeb3();
    const networkId = await web3.eth.net.getId();
    const networkData = DecentralizedTwitter.networks[networkId];
    const dTwitter = new web3.eth.Contract(DecentralizedTwitter.abi, networkData.address)
    
    return { initialized: true, web3, decentralizedTwitterContract: dTwitter, stores: { post, user } };
  }

  /**
   * @description Function used to get a new user id
   * @returns {Object}
   */
  async function getNewUserId() {
    const { user } = appDependencies.stores;
    const users = await user.get('');
    return users.length > 0 ? users[users.length - 1]._id + 1 : 1;
  }

  /**
   * @description Function used to setup user created event
   * @returns {undefined}
   */
  function setupUserCreatedListener() {
    const { decentralizedTwitterContract } = appDependencies;
    decentralizedTwitterContract.events.UserCreated({}, () => console.log('user created'));
  }

  return (
    <Router>
      <div className="app">
        <NavigationBar
          handleClickOnConnect={connect}
          loggedIn={account.address}
        />
        {
          appDependencies.initialized ?
            <Switch>
              <Route path="/profile/:userId">
                <Profile
                  decentralizedTwitterContract={appDependencies.decentralizedTwitterContract}
                  stores={appDependencies.stores}
                />
              </Route>
              <Route path="/">
                <Home
                  account={account}
                  decentralizedTwitterContract={appDependencies.decentralizedTwitterContract}
                  stores={appDependencies.stores}
                />
              </Route>
            </Switch> :
            <Loading/>
        }
      </div>
    </Router>
  );
}

export default App;
