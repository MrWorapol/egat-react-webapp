import React from 'react'
import GoogleMapReact, { BootstrapURLKeys } from 'google-map-react';
import { Box } from '@mui/system';

interface IProps {
    address: {
        lat: number,
        lng: number,
    }
    zoom: number
}
export default function GoogleMap(props: IProps) {
    const { address, zoom } = props;
    return (
        <Box>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyBCQSJCd6FCG2bqvt3MEtgXWyGdVMY4xRc" }}
                defaultCenter={{ lat: address.lat, lng: address.lng }}
                zoom={zoom}
            >
            </GoogleMapReact>
        </Box>
    )
}
