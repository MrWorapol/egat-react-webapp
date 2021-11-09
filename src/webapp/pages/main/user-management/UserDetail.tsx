import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useParams } from 'react-router';
import { useRecoilState } from 'recoil';
import UserManagementAPI from '../../../api/user/userManagementApi';
import { useLoadingScreen } from '../../../hooks/useLoadingScreen';
import { useNavigationSet } from '../../../hooks/useNavigationSet';
import { useUserDetail } from '../../../hooks/useUserDetail';
// import { getUserDetail } from '../../../hooks/getUserDetail'
import { NavigationCurrentType } from '../../../state/navigation-current-state';
import { session } from '../../../state/user-sessions';


type MeterParams = {
    id: string;
}

interface IFormTextFieldInput {
    userDetail: {
        id: string,
        email: string,
        fullName: string,
        phoneNumber: string,
        role: string,
        registrationDate: string,
        citizenId: string,
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
    }
}

export default function UserDetail() {
    useNavigationSet(NavigationCurrentType.USER_DETAIL);
    const api = new UserManagementAPI();
    const { id } = useParams<MeterParams>();
    const { userDetail, meterDetail, refreshUserDetailData } = useUserDetail(id);
    const { register, handleSubmit, formState: { errors }, control } = useForm<IFormTextFieldInput>();
    const [edit, setEdit] = React.useState(false);
    const [userSession, setUserSessionValue] = useRecoilState(session);
    const { showLoading, hideLoading } = useLoadingScreen();


    const onSetEditable = () => {
        setEdit(!edit);
    }

    const onEditUser = async (data: IFormTextFieldInput) => {

        // if (userSession && data.userDetail && data.meterDetail) {
        // showLoading();
        try {
            await api.editUser({
                // token: userSession,
                meterDetail: data.meterDetail,
                userDetail: data.userDetail,
            });
        } catch (e) {

            // hideLoading();
        }
        console.log(`back from api`);

        // }
    }
    const onSubmit: SubmitHandler<IFormTextFieldInput> = data => {
        console.log(data);
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
                    <Grid item id="sub-title1"><Typography sx={{ fontSize: '1.5em', color: 'secondary.main' }}>ข้อมูลผู้สมัคร</Typography>  </Grid>
                    <Grid item container pt={1} id="line-1">
                        <GridDetailsComponent size={4}>
                            <Typography >ชื่อเจ้าของเครื่องวัด: </Typography>
                            <Controller
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '15em' }}
                                        disabled={!edit}
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
                            <Typography >เลขบัตรประชาชน: </Typography>
                            <Controller
                                render={({ field }) => (
                                    <TextField
                                        variant="standard"
                                        sx={{ ml: 2 }}
                                        disabled={!edit}
                                        {...field}
                                    />
                                )}
                                name="userDetail.citizenId"
                                control={control}
                                defaultValue={userDetail.citizenId}

                            />
                        </GridDetailsComponent>
                    </Grid>
                    <Grid item container pt={1} columns={15} id="line-2">
                        <GridDetailsComponent size={3}>
                            <Typography >บ้านเลขที่: </Typography>
                            <Controller
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '4em' }}
                                        size="small" disabled={!edit}

                                        {...field}
                                    />
                                )}
                                name="userDetail.address.buildingNumber"
                                control={control}
                                defaultValue={userDetail.address.buildingNumber}
                            />

                        </GridDetailsComponent>
                        <GridDetailsComponent size={3}>
                            <Typography >หมู่บ้าน: </Typography>
                            <Controller
                                defaultValue={userDetail.address.village}
                                name="userDetail.address.village"
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
                            <Typography >ซอย: </Typography>
                            <Controller
                                defaultValue={userDetail.address.soi}
                                name="userDetail.address.soi"
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
                            <Typography >ถนน: </Typography>
                            <Controller
                                defaultValue={userDetail.address.road}
                                name="userDetail.address.road"
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
                            <Typography >ตำบล/แขวง: </Typography>
                            <Controller
                                defaultValue={userDetail.address.subDistrict}
                                name="userDetail.address.subDistrict"
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
                            <Typography >อำเภอ/เขต: </Typography>
                            <Controller
                                defaultValue={userDetail.address.district}
                                name="userDetail.address.district"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2 }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />

                        </GridDetailsComponent>
                        <GridDetailsComponent size={3}>
                            <Typography >จังหวัด: </Typography>
                            <Controller
                                defaultValue={userDetail.address.province}
                                name="userDetail.address.province"
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
                            <Typography >รหัสไปรษณีย์: </Typography>
                            <Controller
                                defaultValue={userDetail.address.zipCode}
                                name="userDetail.address.zipCode"
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
                            <Typography >เบอร์โทรศัพท์: </Typography>
                            <Controller
                                defaultValue={userDetail.phoneNumber}
                                name="userDetail.phoneNumber"
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
                    <Grid item pt={1} id="line-4">
                        <GridDetailsComponent size={'auto'}>
                            <Typography >อีเมล: </Typography>
                            <Controller
                                defaultValue={userDetail.email}
                                name="userDetail.email"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '15em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                    </Grid>
                    <Grid item container pt={1} id="line-5">
                        <GridDetailsComponent size={4}>
                            <Typography >ประเภทกิจการ: </Typography>
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
                            <Typography >บัญชีแสดงสัญญา: </Typography>
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
                            <Typography >รหัสเครื่องวัด: </Typography>
                            <Controller
                                defaultValue={meterDetail.meterId}
                                name="meterDetail.meterId"
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
                    <Grid item container pt={1} id="line-6">
                        <GridDetailsComponent size={'auto'}>
                            <Typography >Latitude(ละติจูด),Longitude(ลองจิจูด)ของเครื่องวัด: </Typography>
                            <Controller
                                defaultValue={meterDetail.position.lat}
                                name="meterDetail.position.lat"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '5em' }}
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
                                        sx={{ ml: 2, width: '5em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                    </Grid>
                    <Grid item container pt={1} id="line-7">
                        <GridDetailsComponent size={'auto'}>
                            <Typography >ประเภทผู้ใช้ไฟฟ้า: </Typography>
                            <Controller
                                defaultValue={meterDetail.typeOfUser}
                                name="meterDetail.typeOfUser"
                                control={control}
                                render={({ field }) => (
                                    <TextField variant="standard"
                                        sx={{ ml: 2, width: '30em' }}
                                        size="small"
                                        disabled={!edit}
                                        {...field}
                                    />)}
                            />
                        </GridDetailsComponent>
                    </Grid>
                    <Grid item container pt={1} id="line-8">
                        <GridDetailsComponent size={4}>
                            <Typography >ขนาดเครื่องวัด: </Typography>

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
                            <Typography >แรงดัน: </Typography>
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
                            <Typography >จำนวนเฟส: </Typography>
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
                            <Typography >ผู้ผลิตไฟฟ้า: </Typography>
                            <Controller
                                defaultValue={meterDetail.produceInfo}
                                name="meterDetail.produceInfo"
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
                </Grid>
                <Grid item container id="meter-info" pl={2} pt={2} xs={'auto'} direction="column">
                    <Grid item id="sub-title2">
                        <Typography sx={{ fontSize: '1.5em', color: 'secondary.main' }}>ข้อมูลแผงโฟโตโวลเทอิก</Typography>
                    </Grid>
                    <Grid container pt={1} id="line-2-1">
                        <GridDetailsComponent size={4}>
                            <Typography > ยี่ห้อ: </Typography>
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
                            <Typography >รุ่น: </Typography>
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
                            <Typography >จำนวนแผง: </Typography>
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
                            <Typography > กำลังการผลิตติดตั้งสูงสุด(วัตต์/แผง): </Typography>
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
                            <Typography >ชนิดของอุปกรณ์: </Typography>
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
                            <Typography > ขนาดติดตั้ง(ตารางเมตร/แผง): </Typography>
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
                            <Typography >อินเวอร์เตอร์: </Typography>
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
                            <Typography >วันที่คาดว่าจะเริ่มจ่ายไฟฟ้าเข้าระบบ: </Typography>
                            <Controller
                                defaultValue={meterDetail.expectedDate}
                                name="meterDetail.expectedDate"
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

