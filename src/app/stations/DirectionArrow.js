import React from "react"

export class DirectionArrow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            compass: null
        }
    }

    componentDidMount() {
        this.startCompass()
    }

    startCompass() {
        const isIOS = (
            navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
            navigator.userAgent.match(/AppleWebKit/)
        );
    
        console.log("ios: " + isIOS)
        if (isIOS) {
          DeviceOrientationEvent.requestPermission()
            .then((response) => {
              if (response === "granted") {
                window.addEventListener("deviceorientation", this.compassHandler, true);
              } else {
                alert("has to be allowed!");
              }
            })
            .catch(() => alert("not supported"));
        } else {
          window.addEventListener("deviceorientationabsolute", this.compassHandler, true);
        }
    }

    compassHandler(e) {
        let compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
        console.log(compass)
        this.setState({compass: compass})
        // compassCircle.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;
    }

    render() {
        return <div>
            compass {this.state.compass}
        </div>
    }
}
