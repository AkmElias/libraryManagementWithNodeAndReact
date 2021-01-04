import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from './Home'
import Header from './Header'
import Login from "./Login";
import Signup from "./Signup";
import Books from "./Books";
import ViewBook from './ViewBook'
import './App.css';

function App() {
  return (
    <Router>
    <div className="app">
      <Switch>
      <Route path='/sign-up'>
          <Header />
          <Signup />
       </Route>
       <Route path='/sign-in'>
          <Header />
          <Login />
       </Route>
       <Route path='/books'>
          <Header />
          <Books />
       </Route>
       <Route path='/book/:bookId'>
          <Header />
          <ViewBook />
       </Route>
       <Route path='/'>
          <Header />
          <Home />
       </Route>
      </Switch>
     
    </div>
    </Router>
  );
}

export default App;
