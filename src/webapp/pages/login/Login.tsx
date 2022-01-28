import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLogin } from '../../hooks/useLogin';
import { useNavigationSet } from '../../hooks/useNavigationSet';
import { NavigationCurrentType } from '../../state/navigation-current-state';

type LoginForm = {
    email: string;
    password: string;
}

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required()
})
export default function Login() {
    useNavigationSet(NavigationCurrentType.LOGIN);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({ resolver: yupResolver(schema) });
    const { login } = useLogin();

    const onSubmitLogin = async (data: LoginForm) => {
        await login(data.email, data.password);
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
                                            type="email"
                                            error={!!errors.email}
                                            helperText={errors.email && errors.email.message ? errors.email.message : ''}
                                            {...register("email", { required: "Please Filled" })}
                                        ></TextField>
                                    </Grid>
                                    <Grid item container>
                                        <TextField placeholder="Password"
                                            fullWidth
                                            type="password"
                                            error={!!errors.password}
                                            helperText={errors.password && errors.password.message ? errors.password.message : ''}
                                            {...register("password", { required: "Please Filled" })}>

                                        </TextField>
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

