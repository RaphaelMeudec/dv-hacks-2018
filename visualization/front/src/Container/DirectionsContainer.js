import React from 'react';
import { Map, Polyline, TileLayer } from 'react-leaflet';
import L from 'leaflet';

const gmaps = window.google.maps;
const bcgDVCoordinates = [33.9008624,-118.394406];
const laxCoordinates = [33.943574, -118.408165];
const centerCoordinates = bcgDVCoordinates.map((val, index) => (val + laxCoordinates[index])/2);

const flatten = array =>
	Array.prototype.concat.apply([], array);

const last = array =>
	array[array.length-1];

const toObjLatLng = latLng =>
	L.latLng(latLng[0], latLng[1]);

const toArrayLatLng = latLng =>
	[latLng.lat, latLng.lng];

const getPositions = response =>
	response.routes[0].legs.map(leg =>
		flatten(
			leg.steps.map(step =>
				gmaps.geometry.encoding.decodePath(step.polyline.points).map(
					gLocation => toArrayLatLng(gLocation.toJSON())
				)
			)
		)
	);

const getWaypoints = response =>
	response.routes[0].legs.slice(1).map(
		leg => toArrayLatLng(leg.start_location.toJSON())
	);

class DirectionsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.onWaypointsChange = this.onWaypointsChange.bind(this);

		this.state = {
			waypoints: [],
			positions: [
				[
					bcgDVCoordinates,
					laxCoordinates
				]
			]
		};
  }

	componentDidMount(){
		this.getDirections([]);
	}

	onWaypointsChange(waypoints, index){
		const zoom = this.map.leafletElement.getZoom();
		this.getDirections(waypoints, index, zoom);
	}

	getDirections(waypoints, snapIndex, zoom){
		const positions = this.state.positions;
		const request = {
			travelMode: window.google.maps.TravelMode.DRIVING,
			origin: toObjLatLng(positions[0][0]),
			destination: toObjLatLng(last(last(positions))),
			waypoints: waypoints.map(waypoint => ({
				location: toObjLatLng(waypoint),
				stopover: true
			})),
			...(snapIndex !== undefined) && {
				lf: 3,
				Rb: snapIndex+1,
				ue: zoom
				//This is an undocumented feature of DirectionsService.
				//It snaps the new waypoint to the nearest biggest road.
				//those keys are linked to gmaps api v3.28.19. You can reverse-engineer any version by using a DirectionsRenderer
			}
		};
		const directionsService = new gmaps.DirectionsService();
		directionsService.route(request, (response, status) => {
			if (status === gmaps.DirectionsStatus.OK) {
				this.setState({
					waypoints: getWaypoints(response),
					positions: getPositions(response)
				});
			}
		});
	}

  render() {
    const { waypoints, positions } = this.state;
		const flattenPositions = flatten(positions);
		const bounds = L.latLngBounds(flattenPositions);

    return (
      <div className="container">
        <div id="map">
          <Map center={centerCoordinates} zoom={14}>
            <TileLayer
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Polyline
    					positions={flattenPositions}
    					color={'black'}
    					weight={14}
    					opacity={0.5}
    				/>
          </Map>
        </div>
        <div className='viewer'>
          <h2>Road Analysis</h2>
          <p>Departure: BCG Digital Ventures</p>
          <p>Arrival: LAX International Airport</p>
        </div>
      </div>
    )
  }
}

export default DirectionsContainer;
