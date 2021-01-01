import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from './Home'
import './App.css';

function App() {
  return (
    <Router>
    <div className="app">
     <Home />
    </div>
    </Router>
  );
}

export default App;
