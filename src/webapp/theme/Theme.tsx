import { Button } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { styled } from "@mui/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: '#FEC908',
        },
        secondary: {
            main: '#1b4dbc',
            light: '#5187FF',
        },
        // text: {
        //     primary: '#000',
        //     secondary: '#FFF',
        // }
        
    },

})


export default theme;