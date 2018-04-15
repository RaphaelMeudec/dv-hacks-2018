import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import LeafletCircle from './LeafletCircle';

import './Container.css';

const bcgDVCoordinates = [33.9008624,-118.394406];

const markersCoordinates = [
  [33.902018,-118.394406],
  [33.902018,-118.384416],
  [33.902018,-118.374426],
  [33.902018,-118.364436],
  [33.902018,-118.354446],
  [33.902018,-118.344456],
  [33.902018,-118.334466],
  [33.902018,-118.324476],
]

class Container extends React.Component {
  constructor(props) {
    super(props);

    const markers = this.getData()
    const scores = this.getScores(markers);
    const colors = this.getColors(scores);
    const popupTexts = this.getPopupTexts(scores);

    this.state = {
      isPlaying: false,
      numberOfPoints: 0,
      markers: markers,
      scores: scores,
      colors: colors,
      popupTexts: popupTexts
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    setInterval(() => {
      if (this.state.isPlaying) {
        this.setState({
          numberOfPoints: this.state.numberOfPoints + 1
        });
      }
    }, 1000);
  }

  getData() {
    // For now, data is hard-coded. Next step is to retrieve data
    // from our geo-score-api.
    return markersCoordinates;
  }

  getColors(scores) {
    return scores.map(isRoadQualityGood => this.getColor(isRoadQualityGood));
  }

  getColor(isRoadQualityGood) {
    if (isRoadQualityGood === true) {
      return "green";
    } else {
      return "red";
    }
  }

  getPopupTexts(scores) {
    return scores.map(isRoadQualityGood => this.getPopupText(isRoadQualityGood));
  }

  getPopupText(isRoadQualityGood) {
    if (isRoadQualityGood === true) {
      return "The quality of the road is good at this point.";
    } else {
      return "The road is damaged at this point. You should avoid this path.";
    }
  }

  getScores(data) {
    return data.map(position => this.getScore());
  }

  getScore() {
    const score = Math.random();
    return score > 0.5;
  }

  handleClick() {
    this.setState(prevState => ({
      isPlaying: !prevState.isPlaying
    }))

    // Pause/Playing the video
    this.state.isPlaying ? this.refs.vidRef.pause() : this.refs.vidRef.play();
    // Start/Stop adding markers to map
  }

  isLeafletCircleDisplayed(index) {
    return index < this.state.numberOfPoints;
  }

  render() {
    return (
      <div className="container">
        <div id="map">
          <Map center={bcgDVCoordinates} zoom={14}>
            <TileLayer
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {
              this.state.markers.map((marker, index) => {
                return (
                  <LeafletCircle
                    key={index}
                    color={this.state.colors[index]}
                    isDisplay={this.isLeafletCircleDisplayed(index)}
                    fillColor={"red"}
                    marker={marker}
                    popupText={"hello"}
                  />
                )
              })
            }
          </Map>
        </div>
        <div className='viewer'>
          <div className='video-container'>
            <video width="100%" ref="vidRef">
              <source src="potholes.mp4" type="video/mp4"/>
            Your browser does not support the video tag.
            </video>
          </div>
          <button onClick={this.handleClick.bind(this)}>
            {this.state.isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    )
  }
}

export default Container;
