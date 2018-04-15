import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import LeafletCircle from './LeafletCircle';

import './Container.css';

const startCoordinates = [41.0978156,-80.6790504];
const endCoordinates = [41.0974208,-80.6798627];

const centerCoordinates = startCoordinates.map((val, index) => (val + endCoordinates[index])/2);

const markersCoordinates = [
  [41.097913,-80.681065,0.0],
  [41.09803,-80.681063,0.0],
  [41.098122,-80.681072,0.0],
  [41.098147,-80.681044,1.0499475026248686],
  [41.098149,-80.681011,0.0],
  [41.098147999999995,-80.68096800000001,0.0],
  [41.098146,-80.680921,1.4489348370927317],
  [41.09814,-80.680853,0.0],
  [41.098134,-80.680771,0.7865916379258184],
  [41.098133000000004,-80.680702,2.098385944216962],
  [41.098122,-80.680643,2.0376522702104096],
  [41.098110999999996,-80.680543,0.9641262236417946],
  [41.098099,-80.680456,1.2469111903162258],
  [41.098045,-80.680089,0.0],
  [41.098024,-80.679898,1.2402772237734343],
  [41.097982,-80.679671,3.5357827754532773],
  [41.097937,-80.679473,0.7556999067434158],
  [41.097895,-80.679275,1.4738393515106853],
  [41.097828,-80.679068,0.8322929671244278],
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
    return scores.map(score => this.getColor(score));
  }

  getColor(score) {
    if (score > 1) {
      return "red";
    } else if (score > 0) {
      return "orange";
    } else {
      return "green";
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
    return data.map(marker => marker[2]);
  }

  // getScore() {
  //   const score = Math.random();
  //   return score > 0.5;
  // }

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
          <Map center={centerCoordinates} zoom={16}>
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
          <button className="play-button" onClick={this.handleClick.bind(this)}>
            {this.state.isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    )
  }
}

export default Container;
