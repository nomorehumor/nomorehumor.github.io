import React, { useState } from "react"

export function DirectionArrow(props) {

    var [compass, setCompass] = useState(null)

    var startCompass = () => {
        const isIOS = (
            navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
            navigator.userAgent.match(/AppleWebKit/)
        );
    
        if (isIOS) {
        DeviceOrientationEvent.requestPermission()
            .then((response) => {
            if (response === "granted") {
                window.addEventListener("deviceorientation", compassHandler, true);
            } else {
                alert("has to be allowed!");
            }
            })
            .catch(() => alert("Compass not supported"));
        } else {
            window.addEventListener("deviceorientationabsolute", compassHandler, true);
        }
    }

    var compassHandler = (e) => {
        let compassValue = e.webkitCompassHeading || Math.abs(e.alpha - 360);
        console.log(compassValue)
        setCompass(compassValue)
        // compassCircle.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;
    }

    startCompass();

    return <div>
        compass {compass}
    </div>
}
