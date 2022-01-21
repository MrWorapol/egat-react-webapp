import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { newsInfo, NewsInfo } from "../state/news-management/news-info";
import { NewsCreationState, newscreation } from '../state/news-management/news-creation-state';
import NewsManagementAPI from "../api/news/newsManagementApi";
import { ApiTwoTone } from "@mui/icons-material";
import { useAuthGuard } from "./useAuthGuard";
import { NavigationCurrentType } from "../state/navigation-current-state";
import { useNavigationGet } from "./useNavigationGet";
import { useLoadingScreen } from "./useLoadingScreen";
import { useSnackBarNotification } from "./useSnackBarNotification";

interface ISearchField {
    text?: string,
}

export function useAllNews() {
    const api = new NewsManagementAPI();
    const [newsInfoDataValue, setNewsInfoValue] = useRecoilState(newsInfo);
    const [RecentNews, setRecentNews] = useRecoilState(newscreation);
    let { currentState } = useNavigationGet();
    let { session } = useAuthGuard();
    let mocknewsdata: NewsInfo;
    const { showLoading, hideLoading } = useLoadingScreen();
    const { showSnackBar } = useSnackBarNotification();
    mocknewsdata = {
        id: 'IDholder',
        title: 'Titleholder',
        date: 'Dateholder',
        content: 'Contentholder',
        status: 'Statusholder',
    };
    //prototype
    if (typeof (RecentNews?.content) == 'string' && typeof (RecentNews?.title) == 'string') {
        mocknewsdata.title = RecentNews.title;
        mocknewsdata.content = RecentNews.content;
    }

    //const sessionUser = useRecoilValue(userSessionState);
    const putRecentsNews = useCallback(async (recentNews: NewsCreationState) => {
        // api.putNews(recentNews)

        var newInfos: NewsInfo = {
            id: 'IDholder',
            title: recentNews.title,
            date: 'Dateholder',
            content: recentNews.content,
            status: 'DRAFT',

        }
        console.log(`put recents News Data: `);
        console.log(newInfos);
        //this is set
        if (newsInfoDataValue) {
            setNewsInfoValue([
                ...newsInfoDataValue,
                newInfos
            ]);
        }
    }, [])

    const refreshAllNews = useCallback(async (searchField?: ISearchField) => {
        if (session) {
            if (!searchField) {//get without filter
                showLoading(10);
                try {
                    const response = await api.getAllNews({ session });
                    if (response) {
                        setNewsInfoValue(response.newsInfos);
                        hideLoading(10);

                    }
                } catch (e) {
                    hideLoading(10);
                    showSnackBar({ serverity: 'error', message: `${e}` });

                }

            }
            else {
                showLoading(10);
                if (typeof (searchField.text) === 'string') {
                    // console.log(searchField.text)
                    try {

                        const response = await api.getNews({
                            keyword: searchField.text, session
                        });
                        console.log(response);
                        if (response) {
                            setNewsInfoValue(response.newsInfos);
                        } else {
                            setNewsInfoValue([]);
                        }
                    } catch (e) {
                        hideLoading(10);
                        showSnackBar({ serverity: 'error', message: `${e}` });
                    }
                } else {
                    try {
                        const response = await api.getAllNews({ session });
                        //const mocknewdata = [mocknewsdata];
                        if (response) {
                            // console.log(`result from response${response.userInfos}`);
                            setNewsInfoValue(response.newsInfos);
                            console.log(response);
                            // console.log(userInfoDataValue);
                        } else {
                            setNewsInfoValue([]);
                        }
                    } catch (e) {
                        hideLoading(10);
                        showSnackBar({ serverity: 'error', message: `${e}` });
                    }
                }
                hideLoading(10);
            }
        }
    }, [session, setNewsInfoValue]);

    useEffect(() => {
        if (session && currentState === NavigationCurrentType.NEWS_MANAGEMENT) {
            console.log(`Use Effect userInfo  data from ${newsInfoDataValue}`);
            if (!newsInfoDataValue) {
                refreshAllNews();
            }
        }

        // await getUserInfo();
    }, [newsInfoDataValue, refreshAllNews, setRecentNews]
    )
    return {
        NewsInfoData: newsInfoDataValue,
        refreshAllNews,
        RecentNews,
        putRecentsNews
    }
}