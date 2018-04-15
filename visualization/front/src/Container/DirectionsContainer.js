import React from 'react';
import { Circle, Map, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

import LeafletCircle from './LeafletCircle';
import { distance } from '../util';

import './DirectionsContainer.css';

const gmaps = window.google.maps;

const startCoordinates = [41.0976809,-80.6809661];
const endCoordinates = [41.0978156,-80.6790504];

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
			],
			markers: [],
			alongTheRoadMarkers: []
		};
  }

	componentDidMount(){
		this.getDirections([]);
		this.retrieveScores();
	}

	retrieveScores() {
		const coordinates = this.getMapBoundingPoints();

		const url = `http://localhost:5000/score/${coordinates.latitude1}/${coordinates.longitude1}/${coordinates.latitude2}/${coordinates.longitude2}`;
    axios.get(url).then(response => this.setState({markers: response.data}))
									.then(() => this.getAlongTheRoadMarkers());
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

	getAlongTheRoadMarkers() {
		const flattenPositions = flatten(this.state.positions);

		const validMarkers = this.state.markers.filter(marker => {
			var isValid = false;
			flattenPositions.forEach(position => {
				isValid = isValid || this.isMarkerInRange(marker, position);
			})
			return isValid;
		})

		this.setState({alongTheRoadMarkers: validMarkers})
	}

	isMarkerInRange(marker, point) {
		return distance(marker.latitude, marker.longitude, point[0], point[1]) < 0.2;
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

	existsEnoughData() {
		return (this.state.alongTheRoadMarkers) && (this.state.alongTheRoadMarkers.length > 0);
	}

	getRoadQuality() {
		return this.state.alongTheRoadMarkers.filter(marker => marker.score < 0.1).length / this.state.alongTheRoadMarkers.length;
	}

	getColor(score) {
    if (score > 1) {
      return "#ED4337";
    } else if (score > 0) {
      return "orange";
    } else {
      return "#44c767";
    }
  }

  render() {
    const { positions } = this.state;
		const flattenPositions = flatten(positions);

    return (
      <div className="container">
        <div id="map">
          <Map center={centerCoordinates} zoom={18}>
            <TileLayer
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Polyline
    					positions={flattenPositions}
    					color={'black'}
    					weight={15}
    					opacity={0.9}
    				/>
						<Circle
							center={startCoordinates}
							color="blue"
							fillColor="blue"
						 	opacity={0.8}
						 	fillOpacity={0.8}
							radius={10}>
							<Popup>
								<span>Start</span>
							</Popup>
						</Circle>
						<Circle
							center={endCoordinates}
							color="blue"
							fillColor="blue"
						 	opacity={0.8}
							fillOpacity={1}
							radius={10}>
							<Popup>
		            <span>End</span>
		          </Popup>
						</Circle>
						{
              this.state.markers.map((marker, index) => {
								const position = [marker.latitude, marker.longitude];
								const color = this.getColor(marker.score);
                return (
                  <LeafletCircle
										key={index}
                    color={color}
                    isDisplay={true}
                    fillColor={color}
                    marker={position}
										radius={7}
                  />
                )
              })
            }
						/>
          </Map>
        </div>
        <div className='viewer'>
					<div className='directions'>
          	<h2>Road Analysis</h2>
						<div className='direction'>
							<p class='title'>Departure</p>
							<p>220-298 Milton Ave, Youngstown Ohio</p>
						</div>
						<div className='direction'>
							<p class='title'>Arrival</p>
							<p>Calvary Run Dr, Youngstown Ohio</p>
						</div>
					</div>
					<div className='mechanical-prediction'>
						<h2>Road Quality: {
							this.existsEnoughData()
							? this.getRoadQuality()
							: 'Not enough data to assess the road quality.'
						}</h2>
						<div className="mechanical-parts">
							<div className="before">
								<div className="mechanical-part">
									<h3>Tires</h3>
									<span>51</span>
								</div>
								<div className="mechanical-part">
									<h3>Shock Absorber</h3>
									<span>25</span>
								</div>
								<div className="mechanical-part">
									<h3>Engine</h3>
									<span>1</span>
								</div>
								<div className="mechanical-part">
									<h3>Frame</h3>
									<span>4</span>
								</div>
							</div>
							<i class="fas fa-3x fa-arrow-circle-right green"></i>
							<div className="after">
								<div className="mechanical-part maintenance-danger">
									<h3>Tires</h3>
									<span>54</span>
								</div>
								<div className="mechanical-part maintenance-warning">
									<h3>Shock Absorber</h3>
									<span>26</span>
								</div>
								<div className="mechanical-part maintenance-ok">
									<h3>Engine</h3>
									<span>1</span>
								</div>
								<div className="mechanical-part maintenance-ok">
									<h3>Frame</h3>
									<span>4</span>
								</div>
							</div>
						</div>
					</div>
        </div>
      </div>
    )
  }
}

export default DirectionsContainer;
