import { Paper, Stack } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'
import { DirectionArrow } from './DirectionArrow';
import "./Stations.css"

let googleNearbyAPI = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
const googleDistanceAPI = "https://maps.googleapis.com/maps/api/distancematrix/json?"

const MAX_STATION_AMOUNT = 10;


class Stations extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            stations: []
        }
    }

    isStationInList(stations, stationName) {
        for (const station of stations) {
            if (station["name"] === stationName)
                return true;
        }
        return false;
    }

    updateStationsFromResponse(response) {
        var stationsCopy = this.state.stations.slice()

        for (const element of response['results']) {
            if (stationsCopy.length >= MAX_STATION_AMOUNT)
                break

            if (!this.isStationInList(stationsCopy, element["name"])){
                stationsCopy.push(
                    {
                        "name": element["name"],
                        "id": element["place_id"],
                        "latitude": element["geometry"]["location"]["lat"],
                        "longitude": element["geometry"]["location"]["lng"],
                        "types": element["types"],
                    }
                )
            }
        }

        this.setState({stations: stationsCopy})
    }

    reloadStationsList() {

        var params = new URLSearchParams({
            key: process.env.REACT_APP_GOOGLE_API_KEY,
            location: this.props.latitude + ", " + this.props.longitude,
            rankby: "distance",
            type: "train_station"
        })
        const apiRequest = googleNearbyAPI + params

        fetch(
            "https://cors-city-navigator.herokuapp.com/".concat(apiRequest), 
            {
                method: 'GET',
                headers: {'Content-Type':'application/json'},
            }
        )
        .then(response => response.json())
        .then(data => this.updateStationsFromResponse(data))
    }

    componentDidMount() {
        this.reloadStationsList()
    }

    render() {
        return <div>
                    <div>Current location: {this.props.latitude} {this.props.longitude}</div>
                    <DirectionArrow></DirectionArrow>
                    {/* <React.StrictMode> */}
                        <StationsList stations={this.state.stations} currentLongitude={this.props.longitude} currentLatitude={this.props.latitude}></StationsList>
                    {/* </React.StrictMode> */}
                </div>;
    }
}


export default Stations;

class StationsList extends React.Component {
    
    constructor(props) {
        super(props)
    }

    getStations() {
        return this.props.stations.map(element => {
            return <Station 
                name={element["name"]} key={element["id"]} 
                station={element}
                currentLatitude={ this.props.currentLatitude } currentLongitude={this.props.currentLongitude}>
            </Station>
        })
    };

    render() {
        return <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}>
                {this.getStations()}
            </Stack>;
    }
}

class Station extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                distance: "",
                duration: ""
            }
            this.requestDistanceAPI()
        }
    
        isBusStation() {
            return this.props.station["types"].includes("bus_station")
        }
    
        isTrainStation() {
            return this.props.station["types"].includes("train_station")
        }
    
        handleDistanceResponse(response) {
            if (response["rows"].length === 0 || response["rows"][0]["elements"].length === 0) {
                return
            }
    
            var firstElement = response["rows"][0]["elements"][0]
    
            var newState = {
                distance: firstElement["distance"]["text"],
                duration: firstElement["duration"]["text"]
            }
    
            this.setState(newState);
        }
    
        requestDistanceAPI() {
            var params = new URLSearchParams({
                key: process.env.REACT_APP_GOOGLE_API_KEY,
                destinations: "place_id:" + this.props.station["id"],
                origins: this.props.currentLatitude + ", " + this.props.currentLongitude,
                mode: "walking"
            })
            const apiRequest = googleDistanceAPI + params

            fetch("https://cors-city-navigator.herokuapp.com/".concat(apiRequest))
            .then(response => response.json())
            .then(data => this.handleDistanceResponse(data))
        }

        componentDidMount() {
            
        }
    
        render() {
            return  <Paper variant="elevation" elevation={4}>
                        <Box sx={{width: 300, height: 100, fontFamily: "Jetbrains Mono, monospace", fontWeight: 600, fontSize: "1.2em", padding: "10px", borderRadius: "10px"}}>
                            <div className="station-box">
                                <div>
                                    <div>
                                        {
                                            this.isTrainStation() &&
                                            <img className="transport-icon" src={"/train-public-transport.png"} />
                                        }
                                        {
                                            this.isBusStation() &&
                                            <img className="transport-icon" src={"/bus-public-transport.png"} />
                                        }
                                    </div>
                                    <div>{this.props.name}</div>
                                    <div className="station-info">
                                        <div>{this.state.distance}</div>
                                        <div>{this.state.duration}</div>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </Paper>
        }
    }


// function getLocation(setLatitude, setLongitude) {
//     if(navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(function(position) {
//           setLatitude(position.coords.latitude)
//           setLongitude(position.coords.longitude)
//         })
//     } else {
//         alert("Sorry, your browser does not support HTML5 geolocation.");
//     }
// }

