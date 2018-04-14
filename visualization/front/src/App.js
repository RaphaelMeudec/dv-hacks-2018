import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import MainMenu from './Menu/Menu';

import './App.css';
import 'leaflet/dist/leaflet.css';

const bcgDVCoordinates = [33.9008624,-118.394406];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isPlaying: !prevState.isPlaying
    }))


    this.state.isPlaying ? this.refs.vidRef.pause() : this.refs.vidRef.play();
  }

  render() {
    return (
      <div>
        <MainMenu />
        <div className="container">
          <div id="map">
            <Map center={bcgDVCoordinates} zoom={15}>
              <TileLayer
                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
            </Map>
          </div>
          <div className='video-container'>
            <video
              width="300"
              ref="vidRef"
              src="https://fpdl.vimeocdn.com/vimeo-prod-skyfire-std-us/01/751/10/253758104/925178540.mp4?token=1523699231-0x446da598502696ab76abbc2eb5c927921faf22b2"
              type="video/mp4"
            >
            Your browser does not support the video tag.
            </video>
            <h1>Hello !</h1>
          </div>
          <div className='play-button'>
            <button onClick={this.handleClick.bind(this)}>
              {this.state.isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}


export default App;
