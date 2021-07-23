import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Home from './pages/home/Home';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/">
            <Home/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
