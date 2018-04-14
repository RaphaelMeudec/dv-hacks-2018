import React from 'react';
import { Circle, Popup } from 'react-leaflet';

class LeafletMarker extends React.Component {
  render() {
    return (
      this.props.isDisplay && (
        <Circle
          center={this.props.marker}
          color={this.props.color}
          opacity={0.7}
          fillColor={this.props.color}
          fillOpacity={0.7}
          radius={50}>
          <Popup>
            <span>{this.props.popupText}</span>
          </Popup>
        </Circle>
      )
    )
  }
}

export default LeafletMarker;
