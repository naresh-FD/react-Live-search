import React, { Component } from 'react';
import { render } from 'react-dom';
import SearchFilter from './SearchFilter';
import './style.css';

class App extends Component {
   

  render() {
    return (
      <div classname="container- p-0">
        <SearchFilter />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
