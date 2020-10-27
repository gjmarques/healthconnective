
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
    </Router> 
  );
}

function Home() {
  return (
    <div id="page-wrapper">

      <div id="header">
          <nav id="nav">
            <ul>
              <li class="current"><a href="index.html">Home</a></li>
              <li> <a href="index.html">Home</a></li>
              <li> <a href="index.html">Home</a></li>
              <li> <a href="index.html">Home</a></li>
              <li> <a href="index.html">Home</a></li>
            </ul>
          </nav>

      </div>
      </div>

    );
}

export default App;
