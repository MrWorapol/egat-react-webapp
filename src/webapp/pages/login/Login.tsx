import { Box, Button, Card, CardContent, Container, Grid, Paper, TextField, Typography } from '@mui/material'
import React from 'react'




export default function Login() {
    return (
        <Grid
            container
            direction="column"
            style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: "#E9EDF2", minHeight: "100vh" }}>
            <Grid
                container
                spacing={1}
                direction="row"
                xs={10}
                md={8}
                xl={6}
                // alignItems="stretch"
                style={{
                    backgroundColor: "white",
                    minHeight: "50vh",
                    maxHeight: "80vh"
                }}>
                <Grid item
                    xs={12}
                    sm={12}
                    md={6}
                    style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <div style={{ margin: "1em 2em 1em  2em", width: "100%" }}>
                        <Grid container item direction="column" style={{ justifyContent: 'flex-start', alignItems: 'start' }} spacing={2}>
                            <Grid item>
                                <Box>
                                    <Typography variant="h4" style={{ marginBottom: '0.4em' }}>Login</Typography>
                                    <Typography variant="subtitle1">Sign in to your account.</Typography>
                                </Box>
                            </Grid>
                            <Grid item container>
                                <TextField placeholder="Username" fullWidth ></TextField>
                            </Grid>
                            <Grid item container>
                                <TextField placeholder="Password" fullWidth ></TextField>
                            </Grid>
                            <Grid item container style={{ justifyContent: 'flex-end' }}>
                                <Box style={{ right: '0' }}>
                                    <Button variant="contained" color="primary" >Login</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <Grid item
                    xs={12}
                    sm={12}
                    md={6}

                    display={{}}
                    style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
                    Right Side
                </Grid>
            </Grid>
        </Grid>


    )
}

function Background() {

}
