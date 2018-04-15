import React from 'react';
import { Circle, Map, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

const gmaps = window.google.maps;

const startCoordinates = [41.0978156,-80.6790504];
const endCoordinates = [41.0974208,-80.6798627];

const centerCoordinates = startCoordinates.map((val, index) => (val + endCoordinates[index])/2);

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
					startCoordinates,
					endCoordinates
				]
			]
		};
  }

	componentDidMount(){
		this.getDirections([]);
		this.retrieveScores();
	}

	retrieveScores() {
		const coordinates = this.getMapBoundingPoints();

		const url = `http://localhost:5000/score/${coordinates.latitude1}/${coordinates.longitude1}/${coordinates.latitude2}/${coordinates.longitude2}`;
    axios.get(url).then(response => console.log(response));
	}

	getMapBoundingPoints() {
		const directionsMap = L.map('map').setView(centerCoordinates, 16)

		const bounds = directionsMap.getBounds();
		const northLatitude = bounds._northEast.lat;
		const eastLongitude = bounds._northEast.lng;
		const southLatitude = bounds._southWest.lat;
		const westLongitude = bounds._southWest.lng;

		return {
			latitude1: southLatitude,
			longitude1: westLongitude,
			latitude2: northLatitude,
			longitude2: eastLongitude
		}
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
          <Map center={centerCoordinates} zoom={16}>
            <TileLayer
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Polyline
    					positions={flattenPositions}
    					color={'black'}
    					weight={10}
    					opacity={0.5}
    				/>
						<Circle
							center={startCoordinates}
							color="blue"
							fillColor="blue"
						 	opacity={0.8}
						 	fillOpacity={0.8}>
							<Popup>
								<span>Start</span>
							</Popup>
						</Circle>
						<Circle
							center={endCoordinates}
							color="blue"
							fillColor="blue"
						 	opacity={0.8}
							fillOpacity={1}>
							<Popup>
		            <span>End</span>
		          </Popup>
						</Circle>
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
