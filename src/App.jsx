import React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import SearchResult from './pages/SearchResult';
import './App.css';

const App = () => (
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/search" component={SearchResult} />
    </Switch>
  </BrowserRouter>
);

export default hot(module)(App);
