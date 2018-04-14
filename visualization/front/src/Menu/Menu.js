import React from 'react';

import './Menu.css';

class MainMenu extends React.Component {
  render() {
    return (
      <div className='main-menu'>
        <button className="switch-view-button" onClick={this.props.handleView}>Switch view</button>
        <h1>Zamohra</h1>
      </div>
    )
  }
}

export default MainMenu;
