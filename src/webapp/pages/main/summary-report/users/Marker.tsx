import React from 'react';
import RoomIcon from '@mui/icons-material/Room';
const Marker = (props: any) => {
    return (
        <RoomIcon
            className="marker"
            style={{ color: "red", cursor: 'pointer', width: '1em', height: '1em' }}
        />
    );
};

export default Marker;