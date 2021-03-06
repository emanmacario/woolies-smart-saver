import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import AuthNavbar from './components/AuthNavbar';
import UnauthNavbar from './components/UnauthNavbar';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ViewProducts from './components/ViewProducts';


function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    console.log(`User authenticated: ${isAuth}`);

    axios.get('/users', { 
      withCredentials: true 
    })
    .then((res) => {
      if (res.data.user) {
        console.log("User session found");
        setIsAuth(true);
      } else {
        console.log("User session not found");
      }
    })
    .catch((err) => {
      console.log(err);

    });
  }, [isAuth]);
  

  return (
    <Router>
      {/* Navbar */}
      {isAuth ? <AuthNavbar setIsAuth={setIsAuth} /> : <UnauthNavbar />}

      {/* Routes and respective components */}
      <Route exact path="/" component={Home} />
      <Route exact path='/signup'>
        {isAuth ? <Redirect to='/products' /> : <SignUp />}
      </Route>
      <Route exact path='/login'>
        {isAuth ? <Redirect to='/products' /> : <Login setIsAuth={setIsAuth} />}
      </Route>
      <Route exact path='/products'>
        {isAuth ? <ViewProducts /> : <Redirect to='/login' />}
      </Route>
    </Router>
  );
}

export default App;