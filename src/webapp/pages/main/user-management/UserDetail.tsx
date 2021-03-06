import { Box, Button, Container, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useParams } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import UserManagementAPI from '../../../api/user/userManagementApi';
import { useLoadingScreen } from '../../../hooks/useLoadingScreen';
import { useNavigationSet } from '../../../hooks/useNavigationSet';
import { useUserDetail } from '../../../hooks/useUserDetail';
// import { getUserDetail } from '../../../hooks/getUserDetail'
import { NavigationCurrentType } from '../../../state/navigation-current-state';
import { userSessionState } from '../../../state/user-sessions';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from '../../../utils/customDayjs';
import { useSnackBarNotification } from '../../../hooks/useSnackBarNotification';
import { DatePicker } from '@mui/lab';



type MeterParams = {
    id: string;
}

type IFormTextFieldInput = {
    userDetail: {
        id: string,
        email: string,
        fullName: string,
        phoneNumber: string,
        role: string,
        registrationDate: string,
        citizenId: string,
        meterId: string,
        displayName: string,
    },
    meterDetail: {
        meterId: string,
        typeOfBusiness: string, // 'home' | 'school' | 'hospital' | 'government' | 'cooperative' | 'business' | 'industry' | 'other' ;
        ca: string,
        position: {
            lat: number,
            lng: number,
        },
        typeOfUser: string, //'house1.1' | 'house1.2' | 'house1.3' | 's-business2.1' | 's-business2.2' | 'm-business3.1' |  'm-business3.2'| 'l-business4.1' | 'l-business4.2' | 'special-business5.1' | 'special-business5.2' ;
        sizeOfMeter: number,
        voltage: number,
        numberOfPhases: number,
        produceInfo: string,
        brand: string,
        model: string,
        numberOfBoard: number,
        powerOfProduce: number,
        typeOfBoard: string,
        sizeOfSetup: number,
        invertor: string,
        expectedDate: string,
        address: {
            buildingNumber: string,
            village: string,
            soi: string,
            road: string,
            subDistrict: string,
            district: string,
            province: string,
            zipCode: string,
            country: string,
        },
    }
}

// const schema = yup.object().shape({
//     "meterDetail.address.buildingNumber": yup.string().required(),
//     "meterDetail.address.village": yup.string().required(),
//     "meterDetail.address.soi": yup.string().required(),
//     "meterDetail.address.subDistrict": yup.string().required(),
//     "meterDetail.address.district": yup.string().required(),
//     "meterDetail.address.province": yup.string().required(),
//     "meterDetail.address.zipCode": yup.string().required(),
//     "meterDetail.typeOfBusiness": yup.string().required(),
//     "meterDetail.ca": yup.string().required(),
//     "meterDetail.position.lat": yup.number().required(),
//     "meterDetail.position.lng": yup.number().required(),
//     "meterDetail.sizeOfMeter": yup.number().required(),
//     "meterDetail.voltage": yup.number().required(),
//     "meterDetail.brand": yup.string().required(),
//     "meterDetail.model": yup.string().required(),
//     "meterDetail.numberOfBoard": yup.number().required(),
//     "meterDetail.powerOfProduce": yup.number().required(),
//     "meterDetail.typeOfBoard": yup.string().required(),
//     "meterDetail.sizeOfSetup": yup.number().required(),
//     "meterDetail.invertor": yup.string().required(),
// })

export default function UserDetail() {
    useNavigationSet(NavigationCurrentType.USER_DETAIL);
    const api = new UserManagementAPI();
    const { id } = useParams<MeterParams>();
    const { userDetail, meterDetail } = useUserDetail(id);
    const { handleSubmit, formState: { errors }, control, watch } = useForm<IFormTextFieldInput>(
        // {
        //     resolver: yupResolver(schema),
        //     defaultValues: {
        //         userDetail: userDetail ? userDetail : undefined,
        //         meterDetail: meterDetail ? meterDetail : undefined
        //     }
        // }
    );
    let watchError = watch();

    useEffect(() => {
        //   console.log(watchError);

        return () => {

        };
    }, []);

    const [edit, setEdit] = React.useState(false);
    let session = useRecoilValue(userSessionState);
    const { showLoading, hideLoading } = useLoadingScreen();
    const { showSnackBar } = useSnackBarNotification();
    const onSetEditable = () => {
        setEdit(!edit);
    }

    const onEditUser = async (data: IFormTextFieldInput) => {
        // console.log(errors);
        // if (userSession && data.userDetail && data.meterDetail) {
        showLoading(10);
        if (session) {
            try {
                let newUserDetail = data.userDetail;
                // console.log(data.meterDetail);
                // console.log(newUserDetail);
                data.meterDetail.expectedDate = dayjs(data.meterDetail.expectedDate).toISOString();
                await api.editUser({
                    session,
                    meterDetail: data.meterDetail,
                    userDetail: {
                        email: data.userDetail.email,
                        fullName: data.userDetail.fullName,
                        phoneNumber: data.userDetail.phoneNumber,
                        citizenId: data.userDetail.citizenId,
                        displayName: data.userDetail.displayName,
                    },
                });
                showSnackBar({ serverity: 'success', message: `updated successful` })
                hideLoading(10);
                setEdit(!edit);
            } catch (e) {

                hideLoading(10);
                showSnackBar({ serverity: 'error', message: `${e}` })
            }
        }
    }
    const onSubmit: SubmitHandler<IFormTextFieldInput> = data => {

        onEditUser(data);

    }
    if (userDetail === null || meterDetail === null) {
        return (<> </>)
    }
    return (
        <Grid container px={3} py={2} style={{ backgroundColor: '#FFFFFF' }} direction="column" justifyContent='space-evenly' >
            <Grid item id="title" xs={'auto'}>
                <Typography sx={{ fontSize: '1.8em', color: 'secondary.main', fontWeight: 'bold' }}>User Detail</Typography>
            </Grid>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid item container id="user-info" pl={2} xs={'auto'} direction="column">
                    <Grid item id="sub-title1"><Typography sx={{ fontSize: '1.5em', color: 'secondary.main' }}>??????????????????????????????????????????</Typography>  </Grid>
                    <Grid item container pt={1} id="line-1">
                        <GridDetailsComponent size={4}>
                            <Typography >???????????????????????????????????????????????????????????????: </Typography>
                            <Controller
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '15em' }}
                                        disabled={true}
                                        {...field}
                                    />)}
                                name="userDetail.fullName"
                                control={control}
                                defaultValue={userDetail.fullName}
                                rules={{
                                    required: true,
                                }}

                            />
                        </GridDetailsComponent>
                        <GridDetailsComponent size={4}>
                            <Typography >??????????????????????????????????????????: </Typography>
                            <Controller
                                render={({ field }) => (
                                    <TextField
                                        variant="standard"
                                        sx={{ ml: 2 }}
                                        disabled={true}
                                        {...field}
                                    />
                                )}
                                name="userDetail.citizenId"
                                control={control}
                                defaultValue={userDetail.citizenId}

                            />
                        </GridDetailsComponent>
                        <GridDetailsComponent size={4}>
                            <Typography >??????????????????????????????????????????: </Typography>
                            <Controller
                                render={({ field }) => (
                                    <TextField
                                        variant="standard"
                                        sx={{ ml: 2 }}
                                        disabled={true}
                                        {...field}
                                    />
                                )}
                                name="userDetail.displayName"
                                control={control}
                                defaultValue={userDetail.displayName}

                            />
                        </GridDetailsComponent>
                    </Grid>
                    <Grid item container pt={1} columns={15} id="line-2">
                        <GridDetailsComponent size={3}>
                            <Typography >??????????????????????????????: </Typography>
                            <Controller
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '13em' }}
                                        size="small" disabled={!edit}

                                        {...field}
                                    />
                                )}
                                name="meterDetail.address.buildingNumber"
                                control={control}
                                defaultValue={meterDetail.address.buildingNumber || 'cannot load Data'}
                            />

                        </GridDetailsComponent>
                        <GridDetailsComponent size={3}>
                            <Typography >????????????????????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.address.village}
                                name="meterDetail.address.village"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                        <GridDetailsComponent size={3}>
                            <Typography >?????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.address.soi}
                                name="meterDetail.address.soi"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                        <GridDetailsComponent size={3}>
                            <Typography >?????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.address.road}
                                name="meterDetail.address.road"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />

                        </GridDetailsComponent>
                        <GridDetailsComponent size={3}>
                            <Typography >????????????/????????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.address.subDistrict}
                                name="meterDetail.address.subDistrict"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '8em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                    </Grid>
                    <Grid container pt={1} columns={15} id="line-3">
                        <GridDetailsComponent size={3}>
                            <Typography >???????????????/?????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.address.district}
                                name="meterDetail.address.district"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />

                        </GridDetailsComponent>
                        <GridDetailsComponent size={3}>
                            <Typography >?????????????????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.address.province}
                                name="meterDetail.address.province"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                        <GridDetailsComponent size={3}>
                            <Typography >????????????????????????????????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.address.zipCode}
                                name="meterDetail.address.zipCode"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                        <GridDetailsComponent size={3}>
                            <Typography >???????????????????????????????????????: </Typography>
                            <Controller
                                defaultValue={userDetail.phoneNumber}
                                name="userDetail.phoneNumber"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={true}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                    </Grid>
                    <Grid item pt={1} id="line-4">
                        <GridDetailsComponent size={'auto'}>
                            <Typography >???????????????: </Typography>
                            <Controller
                                defaultValue={userDetail.email}
                                name="userDetail.email"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '15em' }}
                                        size="small"
                                        disabled={true}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                    </Grid>
                    <Grid item container pt={1} id="line-5">
                        <GridDetailsComponent size={4}>
                            <Typography >????????????????????????????????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.typeOfBusiness}
                                name="meterDetail.typeOfBusiness"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />

                        </GridDetailsComponent>
                        <GridDetailsComponent size={4}>
                            <Typography >??????????????????????????????????????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.ca}
                                name="meterDetail.ca"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />



                        </GridDetailsComponent>
                        <GridDetailsComponent size={4}>
                            <Typography >??????????????????????????????????????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.meterId}
                                name="meterDetail.meterId"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={true}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                    </Grid>
                    <Grid item container pt={1} id="line-6">
                        <GridDetailsComponent size={'auto'}>
                            <Typography >Latitude(?????????????????????),Longitude(????????????????????????)???????????????????????????????????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.position.lat}
                                name="meterDetail.position.lat"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                            ,
                            <Controller
                                defaultValue={meterDetail.position.lng}
                                name="meterDetail.position.lng"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                    </Grid>
                    <Grid item container pt={1} id="line-7">
                        <GridDetailsComponent size={'auto'}>
                            <Typography >???????????????????????????????????????????????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.typeOfUser}
                                name="meterDetail.typeOfUser"
                                control={control}
                                render={({ field }) => (
                                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                        <Select {...field} disabled={!edit}>
                                            <MenuItem value={'2.1 PEA ?????????????????? 22-33 kV, MEA ?????????????????? 12-24 kV'}>{'2.1 PEA ?????????????????? 22-33 kV, MEA ?????????????????? 12-24 kV'}</MenuItem>
                                            <MenuItem value={'2.2 PEA ?????????????????? <22 kV, MEA ?????????????????? <12 kW'}>{'2.2 PEA ?????????????????? <22 kV, MEA ?????????????????? <12 kW'}</MenuItem>

                                        </Select>
                                    </FormControl>
                                    // <TextField variant="standard"
                                    // sx={{ ml: 2, width: '30em' }}
                                    // size="small"
                                    // disabled={!edit}
                                    // {...field}
                                )}
                            />
                        </GridDetailsComponent>
                    </Grid>
                    <Grid item container pt={1} id="line-8">
                        <GridDetailsComponent size={4}>
                            <Typography >??????????????????????????????????????????: </Typography>

                            <Controller
                                defaultValue={meterDetail.sizeOfMeter}
                                name="meterDetail.sizeOfMeter"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                        <GridDetailsComponent size={4}>
                            <Typography >??????????????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.voltage}
                                name="meterDetail.voltage"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                        <GridDetailsComponent size={4}>
                            <Typography >????????????????????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.numberOfPhases}
                                name="meterDetail.numberOfPhases"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '5em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                    </Grid>
                    <Grid item container pt={1} id="line-9">
                        <GridDetailsComponent size={'auto'}>
                            <Typography >????????????????????????????????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.produceInfo}
                                name="meterDetail.produceInfo"
                                control={control}
                                render={({ field }) => (
                                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                        <Select {...field} disabled={!edit}>
                                            <MenuItem value={'????????????????????????????????????????????????????????????????????????(?????????????????????????????????/???????????????????????????)'}>{'????????????????????????????????????????????????????????????????????????(?????????????????????????????????/???????????????????????????)'}</MenuItem>
                                            <MenuItem value={'????????????????????????/????????????????????????'}>{'????????????????????????/????????????????????????'}</MenuItem>

                                        </Select>
                                    </FormControl>
                                )}

                            />
                        </GridDetailsComponent>
                    </Grid>
                </Grid>
                <Grid item container id="meter-info" pl={2} pt={2} xs={'auto'} direction="column">
                    <Grid item id="sub-title2">
                        <Typography sx={{ fontSize: '1.5em', color: 'secondary.main' }}>???????????????????????????????????????????????????????????????</Typography>
                    </Grid>
                    <Grid container pt={1} id="line-2-1">
                        <GridDetailsComponent size={4}>
                            <Typography > ??????????????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.brand}
                                name="meterDetail.brand"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                        <GridDetailsComponent size={4}>
                            <Typography >????????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.model}
                                name="meterDetail.model"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                        <GridDetailsComponent size={4}>
                            <Typography >????????????????????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.numberOfBoard}
                                name="meterDetail.numberOfBoard"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                    </Grid>
                    <Grid container pt={1} id="line-2-2">
                        <GridDetailsComponent size={6}>
                            <Typography > ???????????????????????????????????????????????????????????????????????????(???????????????/?????????): </Typography>
                            <Controller
                                defaultValue={meterDetail.powerOfProduce}
                                name="meterDetail.powerOfProduce"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                        <GridDetailsComponent size={6}>
                            <Typography >??????????????????????????????????????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.typeOfBoard}
                                name="meterDetail.typeOfBoard"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                    </Grid>
                    <Grid container pt={1} id="line-2-3">
                        <GridDetailsComponent size={6}>
                            <Typography > ?????????????????????????????????(???????????????????????????/?????????): </Typography>
                            <Controller
                                defaultValue={meterDetail.sizeOfSetup}
                                name="meterDetail.sizeOfSetup"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                        <GridDetailsComponent size={6}>
                            <Typography >???????????????????????????????????????: </Typography>
                            <Controller
                                defaultValue={meterDetail.invertor}
                                name="meterDetail.invertor"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '10em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>

                    </Grid>
                    <Grid container pt={1} id="line-2-4">
                        <GridDetailsComponent size={'6'}>
                            <Typography >????????????????????????????????????????????????????????????????????????????????????????????????????????????: </Typography>
                            <Controller
                                defaultValue={dayjs(meterDetail.expectedDate).toString()}
                                name="meterDetail.expectedDate"
                                control={control}
                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                    <DatePicker
                                        disabled={!edit}
                                        views={['year', 'month', 'day']}
                                        maxDate={dayjs().add(5, 'year')}
                                        inputFormat='DD/MM/YYYY'
                                        value={value}
                                        onChange={onChange}
                                        renderInput={(params) => (
                                            <TextField
                                                size='small'
                                                {...params}
                                                sx={{ ml: 2, width: '10em', justifyContent: 'flex-end', textAlignLast: 'end', }} />
                                        )}
                                    />
                                )}
                            />
                        </GridDetailsComponent>

                        <GridDetailsComponent size='1' children={<Typography />} />
                    </Grid>
                </Grid>
                <Grid item container id="action-zone" justifyContent="flex-end" xs={'auto'}>
                    {buildActionZone(!edit)}
                </Grid>
            </form>
        </Grid>
    )

    function buildActionZone(edit: boolean): JSX.Element {
        if (edit) {
            return (
                <Button variant="contained" size="small" onClick={onSetEditable}>
                    <Typography variant="button">
                        Edit
                    </Typography>
                </Button>
            )
        } else {
            return (
                <Box >
                    <Button variant="contained" size="small" onClick={onSetEditable} sx={{ mr: 2 }}>
                        <Typography variant="button">
                            Cancel
                        </Typography>
                    </Button>
                    <Button variant="contained" size="small" type="submit">
                        <Typography variant="button">
                            Save
                        </Typography>
                    </Button>
                </Box>
            )
        }
    }

}


interface MyProps {
    size: any;

}

const GridDetailsComponent: React.FunctionComponent<MyProps> = (props) => {
    return (
        <Grid item container xs={props.size} direction="row" alignItems="center">
            {props.children}
        </Grid>
    )
}

