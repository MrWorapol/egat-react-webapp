import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { newsInfo,NewsInfo } from "../state/news-management/news-info";
import { NewsCreationState,newscreation } from '../state/news-management/news-creation-state';
import NewsManagementAPI from "../api/news/newsManagementApi";
import { ApiTwoTone } from "@mui/icons-material";

interface ISearchField {
    text?: string,
    roles?: string[],
}

export function useAllNews() {
    const api = new NewsManagementAPI();
    const [newsInfoDataValue, setNewsInfoValue] = useRecoilState(newsInfo);
    const [RecentNews, setRecentNews] = useRecoilState(newscreation);
    
    let mocknewsdata : NewsInfo;
    //preload
    mocknewsdata = {
        id : 'IDholder',
        title: 'Titleholder',
        date : 'Dateholder',
        content : 'Contentholder',
        status : 'Statusholder',
        };
    //prototype
    if (typeof(RecentNews?.content)=='string' && typeof(RecentNews?.title)=='string'){
        mocknewsdata.title = RecentNews.title;
        mocknewsdata.content = RecentNews.content;
    }
    
    //const sessionUser = useRecoilValue(userSessionState);
    const putRecentsNews = useCallback( async(recentNews:NewsCreationState)=>{
        // api.putNews(recentNews)
        var newInfos : NewsInfo = {    
            id : 'IDholder',
            title: recentNews.title,
            date : 'Dateholder',
            content : recentNews.content,
            status : 'Statusholder',
            
        }
        console.log(`put recents News Data: `);
        console.log(newInfos);
        //this is set
        if(newsInfoDataValue ){
            setNewsInfoValue([
                ...newsInfoDataValue,
                newInfos
            ]);
        }
    },[])

    const refreshAllNews = useCallback(async (searchField?: ISearchField) => {
        // console.log(`call get All User`);
        // if (sessionUser) {
            console.log("callback");
            if (!searchField) {//get without filter
                const response = await api.getAllNews();
                //const mocknewdata = [mocknewsdata];
                if (response) {
                    // console.log(`result from response${response.userInfos}`);
                    setNewsInfoValue(response.newsInfos);
                    console.log(response);
                    // console.log(userInfoDataValue);
                } else {
                    setNewsInfoValue([]);
                }

            }
             else{
                const mocknewdata = [mocknewsdata];
                console.log(newsInfoDataValue);
                console.log(mocknewdata[0].id);
                
                if (mocknewdata) {
                    setNewsInfoValue(mocknewdata);
                } else {
                    setNewsInfoValue([]);
                }
             }
                // else { //get with filter
                //     if (searchField.text) { //case search by text
                //         const response = await api.getUserByFilter({  text: searchField.text });
                //         if (mocknewdata) {
                //             setNewsInfoValue(mocknewdata);
                //         } else {
                //             setNewsInfoValue([]);
                //         }
                //         return;
                //     }
                //     if (searchField.roles) { //case search by roles
                //         const response = await api.getUsersByRoles({ roles: searchField.roles });
                //         if (response) {
                //             setNewsInfoValue(response.newsInfo);
                //         } else {
                //             setNewsInfoValue([]);
                //         }
                //         return;
                //     }
                // }
        // }
    }, [setNewsInfoValue]);

    useEffect(() => {

        console.log(`Use Effect userInfo  data from ${newsInfoDataValue}`);
        if (!newsInfoDataValue) {
            refreshAllNews();
        }

        // await getUserInfo();
    }, [newsInfoDataValue, refreshAllNews,setRecentNews]
    )
    return {
        NewsInfoData: newsInfoDataValue,
        refreshAllNews,
        RecentNews, 
        putRecentsNews
    }
}