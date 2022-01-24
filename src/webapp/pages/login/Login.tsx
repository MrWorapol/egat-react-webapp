import { Box, Button, Card, CardContent, Container, Grid, Paper, TextField, Typography } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useLoadingScreen } from '../../hooks/useLoadingScreen';
import { useLogin } from '../../hooks/useLogin';
import { useSnackBarNotification } from '../../hooks/useSnackBarNotification';
import { userProfile } from '../../state/user-profile';
import { userSessionState } from '../../state/user-sessions';



type LoginForm = {
    username: string;
    password: string;
}

export default function Login() {
    const { register, handleSubmit, } = useForm<LoginForm>();
    const { login } = useLogin();
    let session = useRecoilValue(userSessionState);
    const history = useHistory();

    if (session) {

        history.push('/');
    }

    const onSubmitLogin = async (data: LoginForm) => {
        await login(data.username, data.password);

    }
    return (
        <>
            <Grid
                container
                direction="column"
                style={{ backgroundColor: "#E9EDF2", minHeight: "100vh" }}>
                <Grid
                    container
                    spacing={1}
                    direction="row"
                    xs={10}
                    md={8}
                    xl={6}
                    mx='auto'
                    mt='auto'
                    mb='auto'
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
                                        <TextField placeholder="Email"
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
                        container
                        xs={12}
                        sm={12}
                        md={6}
                        direction='column'
                        style={{
                            backgroundColor: "white",
                            minHeight: "50vh",
                            maxHeight: "80vh"
                        }}
                    >

                        <Grid item container justifyContent="flex-end" >
                            <img src={'/assets/images/egat_logo.png'} alt="egat_logo" ></img>
                        </Grid>
                        <Grid item container justifyContent="center" alignItems="center" sx={{ height: '90%', width: '100%' }}>

                            <img src={'/assets/images/egat_mascot.png'} alt="egat_mascot" ></img>

                        </Grid>

                    </Grid>
                </Grid>
                <Grid container direction='column' justifyContent='center' alignItems='center' bgcolor="#E9EDF2" mb={2}>
                    <Grid item>
                        <Typography sx={{ fontWeight: 'light' }}>
                            ผู้รับผิดชอบข้อมูลและผู้ดูแลเว็บไซต์ : นายนครินทร์  ราชจริต
                        </Typography>
                    </Grid>
                    <Grid item >
                        <Typography sx={{ fontWeight: 'light' }}>
                            แผนกบริหารสัญญาซื้อขายไฟฟ้าพลังความร้อนต่างประเทศ (หบรต-ส.) อาคาร ท.102 ชั้น 5 โทร.62877
                        </Typography>
                    </Grid>
                </Grid>
            </Grid >

        </>
    )

}

