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
import './App.css';

function App() {
  const [account, setAccount] = useState({ address: '', id: -1 });
  const [decentralizedTwitterContract, setDecentralizedTwitterContract] = useState(null);
  const [stores, setStores] = useState({ user: null, post: null, initialized: false });
  const [userExistsInSystem, setUserExistsInSystem] = useState(false);
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

        const [account] = await web3.eth.getAccounts();
        if (account) {
          setAccount(previousState => ({ ...previousState, address: account }));
        }
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
      if (account.address && decentralizedTwitterContract && stores.initialized && !userExistsInSystem) {
        const userOnBlockchain = await decentralizedTwitterContract.methods.getUser().call({ from: account.address });
        if (userOnBlockchain.exists) {
          setAccount(previousState => ({...previousState, id: userOnBlockchain.userId}));
        } else {
          const userId = await getNewUserId();
          setupUserCreatedListener();
          await stores.user.put({ _id: userId, username: account });
          await decentralizedTwitterContract.methods.createUser(userId).send({ from: account.address });
          setAccount(previousState => ({...previousState, id: userId}))
        }
      }
    })();
  }, [account, decentralizedTwitterContract, userExistsInSystem, stores]);

  /**
   * @description Abstraction for connecting user to application
   * @returns {undefined}
   */
  async function connect() {
    await window.ethereum.send('eth_requestAccounts');
    const [account] = await web3.eth.getAccounts();
    setAccount(previousState => ({...previousState, address: account}));
  }

  /**
   * @description Function used to get a new user id
   * @returns {Object}
   */
  async function getNewUserId() {
    const { user } = stores;
    const users = await user.get('');
    return users.length > 0 ? users[users.length - 1]._id + 1 : 1;
  }

  /**
   * @description Function used to setup user created event
   * @returns {undefined}
   */
  function setupUserCreatedListener() {
    decentralizedTwitterContract.events.UserCreated({}, () => setUserExistsInSystem(true));
  }

  return (
    <Router>
      <div className="app">
        <NavigationBar
          handleClickOnConnect={connect}
          handleClickOnHome={undefined}
          loggedIn={account.address}
        />
        {
          web3 && stores.initialized && decentralizedTwitterContract ?
            <Switch>
              <Route path="/">
                <Home
                  account={account}
                  decentralizedTwitterContract={decentralizedTwitterContract}
                  stores={stores}
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
