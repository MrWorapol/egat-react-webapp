import { Box, Button, Card, CardContent, Container, Grid, Paper, TextField, Typography } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useRecoilState } from 'recoil';
import { useLoadingScreen } from '../../hooks/useLoadingScreen';
import { useLogin } from '../../hooks/useLogin';
import { userProfile } from '../../state/user-profile';



type LoginForm = {
    username: string;
    password: string;
}

export default function Login() {
    const { register, handleSubmit, } = useForm<LoginForm>();
    const { login, session } = useLogin();
    const history = useHistory();
    const { showLoading, hideLoading } = useLoadingScreen();
    // const  params = useParams();
    // console.log(`params is`);
    // console.log(params);
    const [loadingButton, setLoadingButton] = React.useState(false);

    if (session) {
        console.log(`accessToken : ${session.accessToken}`);
        history.push('/dashboard');
    }

    const onSubmitLogin = async (data: LoginForm) => {
        showLoading(10);
        setLoadingButton(true);
        await login(data.username, data.password);
        setLoadingButton(false);
        console.log(`before check accessToken`);
        hideLoading(10);
        if (session) {
            history.push('/dashboard');
        } else {

            console.log(`after check accessToken`);
        }
    }
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
                        <form onSubmit={(handleSubmit(onSubmitLogin))}>
                            <Grid container item direction="column" style={{ justifyContent: 'flex-start', alignItems: 'start' }} spacing={2}>
                                <Grid container item>
                                    <Box>
                                        <Typography variant="h4" style={{ marginBottom: '0.4em' }}>Login</Typography>
                                        <Typography variant="subtitle1">Sign in to your account.</Typography>
                                    </Box>
                                </Grid>

                                <Grid item container>
                                    <TextField placeholder="Username"
                                        fullWidth
                                        type="username"
                                        {...register("username")}
                                    ></TextField>
                                </Grid>
                                <Grid item container>
                                    <TextField placeholder="Password" fullWidth type="password"
                                        {...register("password")}></TextField>
                                </Grid>
                                <Grid item container style={{ justifyContent: 'flex-end' }}>

                                    <Box style={{ right: '0' }}>
                                        <Button variant="contained" color="primary" type="submit">Login</Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Grid>
                <Grid
                    xs={12}
                    sm={12}
                    md={6}
                    display={{}}
                // style={{ justifyContent: 'center', alignItems: 'center' }}  >
                >
                    <img src={'/assets/images/pea_industry.png'} alt="egat_logo" width="100%" height="100%"></img>
                </Grid>
            </Grid>
        </Grid >


    )

}

