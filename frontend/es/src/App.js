
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Login from './Login';
import Home from './Home';
import Farm from './Farm';
import Consultas from './Consultas';
import Profile from './Profile';
import Register from './Register';
function App() {


  return (
    <Router>
        <Switch>
        <Route path="/Farm">
            <Farm />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/consultas">
            <Consultas />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/Register">
            <Register />
          </Route>
          <Route path="/"  exact>
            <Home />
          </Route>
          <Route component={NotFoundPage} />
        </Switch>
    </Router> 
  );
}

const NotFoundPage = () => {
  return ( <div class="container">
            <div class="row">
              <div class="col-lg-6 col-lg-offset-3 p404 centered">
                <img src="img/404.png" alt=""/>
                <h1>DON'T PANIC!!</h1>
                <h3>The page you are looking for doesn't exist.</h3>
                <br/>
                <h1><a href="/">Home</a> </h1>
              </div>
            </div>
          </div>
);
}

export default App;
