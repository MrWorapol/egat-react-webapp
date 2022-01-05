import { Button, Container, Grid, Typography , TextField,Box} from '@mui/material'
import React,{ useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigationSet } from '../../../hooks/useNavigationSet'
import { NavigationCurrentType } from '../../../state/navigation-current-state'
import CreateNewsDialog from './CreateNewsDialog';
import { useDialog } from '../../../hooks/useDialog';
import { NewsCreationState } from '../../../state/news-management/news-creation-state';
import NewsTableData from './NewsTableData';
import { useNavigationGet } from '../../../hooks/useNavigationGet';
import { useAllNews } from '../../../hooks/useAllNews';
import { useDebouncedCallback } from 'use-debounce/lib';

export default function NewManagement() {
    useNavigationSet(NavigationCurrentType.NEWS_MANAGEMENT);
    const { showDialog } = useDialog();
    const { currentState } = useNavigationGet();
    const [searchText, setSearchText] = useState('');
    const { refreshAllNews } = useAllNews();

    const searchTextDebounce = useDebouncedCallback(
        () => {
            console.log(`search text string : ${searchText}`)
            if (searchText === '') {
                refreshAllNews();
            }
            refreshAllNews({ text: searchText });
        }, 2000
    )

    

    const onTypingText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value)
        searchTextDebounce();
    }

    return (
        <Container sx={{ backgroundColor: "#fff" }}>
            <Grid container direction="row" pt={3}  spacing={0} xs={12}>
                <Grid item container id="title">
                    <Typography sx={{ fontSize: '1.5em', color: 'secondary.main' }}>
                        All News
                    </Typography>
                </Grid>
                <Grid item container id="actionzone" direction="row" justifyContent='space-between' mt={2}>
                    <Grid item container direction='row' xs={12} md={10} alignItems='center' justifyContent='space-between' >
                        <Grid item >
                            {buildCreateNewsButton()}
                        </Grid>
                    </Grid>
                    <Grid xs={12} md={2} alignItems="end" sx={{ my: 2 }}>
                        <TextField
                            autoFocus
                            margin="none"
                            id="password"
                            label="Search"
                            type="text"
                            fullWidth
                            variant="outlined"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTypingText(e)}
                            value={searchText}
                            InputProps={{
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    <SearchIcon />
                                  </InputAdornment>
                                ),
                              }}
                        >
                        </TextField>
                    </Grid>

                        <Grid item container mt={2} >
                            {currentState === NavigationCurrentType.NEWS_MANAGEMENT && <NewsTableData />}
                        </Grid>
                </Grid>
            </Grid>
        </Container>
    )

    function buildCreateNewsButton() {
        return <>
            <Button variant="contained" endIcon={<AddCircleOutlineIcon />} onClick={CreateNewsOnClicked}>
                Create News
            </Button>
        </>

    }

    function CreateNewsOnClicked() {
         showDialog({
             content: <CreateNewsDialog />,
             onClose: () => false,
             width: 'sm',
         });
    }

    
}

