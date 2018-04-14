import React from 'react';
import Container from './Container/Container';
import DirectionsContainer from './Container/DirectionsContainer';
import MainMenu from './Menu/Menu';

import './App.css';
import 'leaflet/dist/leaflet.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'directions'
    }

    this.handleView = this.handleView.bind(this);
  }

  handleView() {
    const newView = this.state.view === 'directions' ? 'video' : 'directions';
    this.setState({
      view: newView
    })
  }

  render() {
    return (
      <div>
        <MainMenu
          handleView={this.handleView}
        />
        {
          this.state.view === "video" && <Container />
        }
        {
          this.state.view === "directions" && <DirectionsContainer />
        }
      </div>
    );
  }
}


export default App;
