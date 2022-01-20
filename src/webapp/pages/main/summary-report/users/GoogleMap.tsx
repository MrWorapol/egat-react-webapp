import React from 'react'
import GoogleMapReact, { BootstrapURLKeys, Maps } from 'google-map-react';
import { Box } from '@mui/system';
import RoomIcon from '@mui/icons-material/Room';


interface IProps {
    address: {
        lat: number,
        lng: number,
    }
    zoom: number
}

const Marker = (props: any) => {
    return (
        <RoomIcon
            className="marker"
            style={{ color: "red", cursor: 'pointer', width: '1em', height: '1em' }}
        />
    );
};

export default function GoogleMap(props: IProps) {
    const { address, zoom } = props;

    const mapOption = (maps: Maps) => {
        return {
            streetViewControl: false,
            scaleControl: true,
            styles: [{
                featureType: "poi.business",
                elementType: "labels",
                stylers: [{
                    visibility: "off"
                }]
            }],
            gestureHandling: "greedy",
            disableDoubleClickZoom: true,
            minZoom: 11,
            maxZoom: 18,

            mapTypeControl: false, //true for enable to  option to change map views
            mapTypeId: maps.MapTypeId.HYBRID, //use hybrid for view info + sattilie
            mapTypeControlOptions: {
                style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: maps.ControlPosition.BOTTOM_CENTER, //position display option map views
            },
            zoomControl: true, //enable zoom control button
            clickableIcons: false 
        };
    }

    return (
        <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyBCQSJCd6FCG2bqvt3MEtgXWyGdVMY4xRc" }}
            defaultCenter={{ lat: address.lat, lng: address.lng }}
            zoom={zoom}
            // yesIWantToUseGoogleMapApiInternals
            options={mapOption}
        >
            <Marker
                lat={address.lat}
                lng={address.lng}
            />
        </GoogleMapReact>

    )
}
