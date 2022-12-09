// to make a organisation tree , following changes need to be done 



// install --> prime-flex

// in LazyImports.js , import this statement 

// LazyImports.js --> export const LazyOrgStructure = lazyWithRetry(() => import('../../containers/directory/orgStructure'))


// Add ths file


// OrganizationChart.css -->


/* OrganizationChartDemo.css */

.organizationchart-demo .card {
    overflow-x: auto;
}

.organizationchart-demo .p-organizationchart .p-person {
    padding: 0;
    border: 0 none;
}

.organizationchart-demo .p-organizationchart .node-header, .organizationchart-demo .p-organizationchart .node-content {
    padding: .5em .7rem;
}

.organizationchart-demo .p-organizationchart .node-header {
    background-color: #495ebb;
    color: #ffffff;
}

.organizationchart-demo .p-organizationchart .node-content {
    text-align: center;
    border: 1px solid #495ebb;
}

.organizationchart-demo .p-organizationchart .node-content img {
    border-radius: 50%;
}

.organizationchart-demo .p-organizationchart .department-cfo {
    background-color: #7247bc;
    color: #ffffff;
}

.organizationchart-demo .p-organizationchart .department-coo {
    background-color: #a534b6;
    color: #ffffff;
}

.organizationchart-demo .p-organizationchart .department-cto {
    background-color: #e9286f;
    color: #ffffff;
}
                 


Also add this file -- > orgStructure.js ->


import React, { Component } from 'react';
import { OrganizationChart } from 'primereact/organizationchart';
import './OrganizationChart.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import ImageUtils from '../../components/Utils/ImageUtils/ImageUtils';
import StorageUtils from '../../containers/utils/StorageUtils';


// const Storage = new StorageUtils();

 class orgStructure extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selection: []
        };

        this.data1 = [{
            label: 'CEO',
            type: 'person',
            className: 'p-person',
            expanded: true,
            data: { name: 'Walter White', 'avatar': 'walter.jpg',email:"amrit3@selfdrvn.com" },
            children: [
                {
                    label: 'CFO',
                    type: 'person',
                    className: 'p-person',
                    expanded: true,
                    data: { name: 'Saul Goodman', 'avatar': 'saul.jpg' },
                    children: [{
                        label: 'Tax',
                        type:"person",
                        className: 'p-person',
                        expanded: true,
                        data: { name: 'XYZ', 'avatar': 'saul.jpg' },
                    },
                    {
                        label: 'Legal',
                        type:'person',
                        className: 'p-person',
                        expanded: true,
                    data: { name: 'ABC', 'avatar': 'saul.jpg' },
                    }],
                },
                {
                    label: 'COO',
                    type: 'person',
                    className: 'p-person',
                    expanded: true,
                    data: { name: 'Mike E.', 'avatar': 'mike.jpg' , email:"amrit2@selfdrvn.com"},
                    children: [{
                        label: 'Operations',
                        type:'person',

                        className: 'p-person',
                        expanded:true,
                        data:{name:'Amrit'}
                    }]
                },
                {
                    label: 'CTO',
                    type: 'person',
                    className: 'p-person',
                    expanded: true,
                    data: { name: 'Jesse Pinkman', 'avatar': 'jesse.jpg' },
                    children: [{
                        label: 'Development',
                        className: 'p-person',
                        type:'person',
                        expanded: true,
                        data:{name:'SHASHANK'},
                        children: [{
                            label: 'Analysis',
                            className: 'p-person',
                            type:'person',
                            data:{name:'abcd'}
                        },
                        {
                            label: 'Front End',
                            className: 'p-person',
                            type:'person',
                            data:{name:'abcde'}
                        },
                        {
                            label: 'Back End',
                            className: 'p-person',
                            type:'person',
                            data:{name:'abcdef'}
                        }]
                    },
                    {
                        label: 'QA',
                        className: 'p-person',
                            type:'person',
                            data:{name:'abcdefg'}
                    },
                    {
                        label: 'R&D',
                        className: 'p-person',
                            type:'person',
                            data:{name:'abcdefgh'}
                    }]
                }
            ]
        }];

        this.data2 = [{
            label: 'F.C Barcelona',
            expanded: true,
            children: [
                {
                    label: 'F.C Barcelona',
                    expanded: true,
                    children: [
                        {
                            label: 'Chelsea FC'
                        },
                        {
                            label: 'F.C. Barcelona'
                        }
                    ]
                },
                {
                    label: 'Real Madrid',
                    expanded: true,
                    children: [
                        {
                            label: 'Bayern Munich'
                        },
                        {
                            label: 'Real Madrid'
                        }
                    ]
                }
            ]
        }];

        this.nodeTemplate = this.nodeTemplate.bind(this);
    }

    renderClick=(email)=>{
        // // const UserProfile = Storage.getProfile();
        // this.props.history.push('profile', {
        //     email: email,
        //     otherProfile: UserProfile.email === email ? false : true
        // })
    }

    nodeTemplate(node) {
        if (node.type === "person") {
            return (
                <div>
                    <div onClick={()=>this.renderClick(node.data.email)} className="node-header">{node.label}</div>
                    <div className="node-content">
                        {/* <ImageUtils/> */}
                        
                        <div className="col-3" onClick={()=>this.renderClick(node.data.name)}>
                                                        <ImageUtils
                                                            src={""}
                                                            name={node.data.name}
                                                            width={50}
                                                            height={50}
                                                            className="rounded-circle" /></div>
                        {/* <img alt={node.data.avatar} src={`images/organization/${node.data.avatar}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} style={{ width: '32px' }} /> */}
                        <div onClick={()=>this.renderClick(node.data.name)}>{node.data.name}</div>
                    </div>
                </div>
            );
        }

        return node.label;
    }

    render() {
        return (
            <div className="organizationchart-demo">
                <div className="">
                    
                    <OrganizationChart value={this.data1} nodeTemplate={this.nodeTemplate} selection={this.state.selection} selectionMode="multiple"
                        onSelectionChange={event => this.setState({ selection: event.data })} className="company"></OrganizationChart>

                    
                </div>
            </div>
        )
    }
}
                 
export default orgStructure


Then make changes in Routes.js


Routes.js --> 

import React, { useEffect, useState } from 'react';
import '../ie.polyfills';
import '../App.scss';
import { withOidcSecure, useReactOidc } from '@axa-fr/react-oidc-context';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import SideNavBar from "../components/navigation/sidenavbar";
import DetectAgent from '../components/Services/detectAgent';
import StorageUtils from '../containers/utils/StorageUtils';
import UserSettings from '../userSettings';
import { AllFeatures } from '../components/Services/core';
import { getIsEnabled } from '../constants/constants';
import $ from 'jquery';
import { withTranslation } from 'react-i18next';
import { StorageService } from '../components/Services/storage';
import MIB from '../containers/mib/mib';
import * as microsoftTeams from '@microsoft/teams-js';
import HelpComponent from '../msteams/views/help';
import { useSelector} from 'react-redux';
import {withLazyComponent}  from '../components/LazyLoad/LazyLoading';
import ReportIssue from '../components/ReportIssue/ReportIssue';
import {
    LazyHome,
    LazyOrgStructure,
    LazyReportedFeed,
    LazyDashboard,
    LazyGoalSetting,
    LazyProfile,
    LazyNotification,
    LazyAnnouncement,
    LazyCreateAnnouncement,
    LazyGroups,
    LazyCreateGroup,
    LazyGroupFeed,
    LazyPredictiveSearch,
    LazyQuests,
    LazyEditQuest,
    LazyEditQuestGroup,
    LazyEditSubQuestGroup,
    LazyRedemption,
    LazyMyPoints,
    LazyLeaderboard,
    LazyTeamsLeaderboard,
    LazyQuiz,
    LazyQuizMe,
    LazyAddNewQuiz,
    LazySeeAll,
    LazyFeatureNotFound,
    LazySessionExpired,
    LazyConfigure,
    LazyOrgInfo,
    LazyGigs,
    LazyCreateGig,
    LazyGigDetails,
    LazyLocationList,
    LazyLocationDetails,
    LazyCreateLocation,
    LazyPeople,
    LazyRmDashboard,
    LazyFeedback,
    LazyDirectory,
    LazyTeamList,
    LazyTeamMemProfile,
    LazyRecognise,
    LazyGiveReward,
    LazyPolls,
    LazySurvey,
    LazyCreateSurvey,
    LazySurveyResults,
    LazyCallback,
    LazyMiddleware,
    LazyLogin,
    LazyDirectLogin,
    LazyHomeById
} from '../components/LazyLoad/LazyImports';
import PredectiveSearch from '../components/predictivesearch/PredectiveSearch';

const HomeComponent = withLazyComponent(LazyHome);
const HomeComponentById = withLazyComponent(LazyHomeById);
const ReportedFeedComponent = withLazyComponent(LazyReportedFeed);
const DashboardComponent = withLazyComponent(LazyDashboard);
const GoalSettingComponent = withLazyComponent(LazyGoalSetting);
const ProfileComponent = withLazyComponent(LazyProfile);
const OrgStructureComponent = withLazyComponent(LazyOrgStructure)
const NotificationComponent = withLazyComponent(LazyNotification);
const AnnouncementComponent = withLazyComponent(LazyAnnouncement);
const CreateAnnouncementComponent = withLazyComponent(LazyCreateAnnouncement);
const GroupsComponent = withLazyComponent(LazyGroups);
const CreateGroupComponent = withLazyComponent(LazyCreateGroup);
const GroupFeedComponent = withLazyComponent(LazyGroupFeed);
const PredictiveSearchComponent = withLazyComponent(LazyPredictiveSearch);
const QuestsComponent = withLazyComponent(LazyQuests);
const EditQuestComponent = withLazyComponent(LazyEditQuest);
const EditQuestGroupComponent = withLazyComponent(LazyEditQuestGroup);
const EditSubQuestGroupComponent = withLazyComponent(LazyEditSubQuestGroup);
const RedemptionComponent = withLazyComponent(LazyRedemption);
const MyPointsComponent = withLazyComponent(LazyMyPoints);
const LeaderboardComponent = withLazyComponent(LazyLeaderboard);
const TeamsLeaderboardComponent = withLazyComponent(LazyTeamsLeaderboard);
const QuizComponent = withLazyComponent(LazyQuiz);
const QuizMeComponent = withLazyComponent(LazyQuizMe);
const AddNewQuizComponent = withLazyComponent(LazyAddNewQuiz);
const SeeAllComponent = withLazyComponent(LazySeeAll);
const FeatureNotFoundComponent = withLazyComponent(LazyFeatureNotFound);
const SessionExpiredComponent = withLazyComponent(LazySessionExpired);
const ConfigureComponent = withLazyComponent(LazyConfigure);
const OrgInfoComponent = withLazyComponent(LazyOrgInfo);
const GigsComponent = withLazyComponent(LazyGigs);
const CreateGigComponent = withLazyComponent(LazyCreateGig);
const GigDetailsComponent = withLazyComponent(LazyGigDetails);
const LocationListComponent = withLazyComponent(LazyLocationList);
const LocationDetailsComponent = withLazyComponent(LazyLocationDetails);
const CreateLocationComponent = withLazyComponent(LazyCreateLocation);
const PeopleComponent = withLazyComponent(LazyPeople);
const RmDashboardComponent = withLazyComponent(LazyRmDashboard);
const FeedbackComponent = withLazyComponent(LazyFeedback);
const DirectoryComponent = withLazyComponent(LazyDirectory);
const TeamListComponent = withLazyComponent(LazyTeamList);
const TeamMemProfileComponent = withLazyComponent(LazyTeamMemProfile);
const RecogniseComponent = withLazyComponent(LazyRecognise);
const GiveRewardComponent = withLazyComponent(LazyGiveReward);
const PollsComponent = withLazyComponent(LazyPolls);
const SurveyComponent = withLazyComponent(LazySurvey);
const CreateSurveyComponent = withLazyComponent(LazyCreateSurvey);
const SurveyResultsComponent = withLazyComponent(LazySurveyResults)
const CallbackComponent = withLazyComponent(LazyCallback);
const MidComponent = withLazyComponent(LazyMiddleware);
const LoginComponent = withLazyComponent(LazyLogin);
const DirectLoginComponent = withLazyComponent(LazyDirectLogin);
const Agent = new DetectAgent();
const storageSvc = new StorageService();
const Storage = new StorageUtils();


// TODO create UserManager class & move these to there along with other user details & local storage info's

function App(props) {
    const { oidcUser } = useReactOidc();
    const [isUserSettingsLoaded, setisUserSettingsLoaded] = useState(false);

    var oidcUser1 = localStorage.getItem("oidc.user:" + process.env.REACT_APP_LOGIN + "/common:" + process.env.REACT_APP_CLIENT_ID);
    var parsed_oidcUser = JSON.parse(oidcUser1);
    const isUserLoggedIn = () => {
        if (parsed_oidcUser !== null && parsed_oidcUser !== undefined) {
            return true;
        } else {
            if (oidcUser !== null && oidcUser !== undefined) {
                return true
            } else {
                return false
            }
        }
    }
    const withUserLoggedInSecure = (loadComponent, aclKey, aclKey1, aclKey2, userSettings) => {
        if (isUserLoggedIn()) {
            if (isUserSettingsLoaded) {
                if (aclKey === "" || getIsEnabled(aclKey) || getIsEnabled(aclKey1) || getIsEnabled(aclKey2)) {
                    return loadComponent;
                } else {
                    return FeatureNotFoundComponent
                }
            } else {
                if (userSettings) {
                    return <UserSettings loadUserSettings={LoadUserSettings} newToken={Storage.getAccessToken()} />
                }
            }
        }
        else {
            return LoginComponent;
        }
    }
    useEffect(() => {
        microsoftTeams.initialize();
        console.log(localStorage.getItem('AuthToken'))
        if (localStorage.getItem('AuthToken') !== null && localStorage.getItem('AuthToken') !== undefined) {
            console.log('found authtoken')
            localStorage.clear();
            storageSvc.clearUserList();
            storageSvc.clearGroupUserList();
            storageSvc.clearFeatureList();
            storageSvc.clearNotificationCache();
        }
        window.addEventListener("resize", () => { resize() });
        resize();
    }, [])
    const resize = () => {
        if (!Agent.isShowNav()) {
            $(".page-wrapper").removeClass("toggled");
        } else {
            if (window.innerWidth <= 1024) {
                $(".page-wrapper").removeClass("toggled");
            } else {
                $(".page-wrapper").addClass("toggled");
            }
        }
    }
    const LoadUserSettings = (loaded) => {
        setisUserSettingsLoaded(loaded);
    }
    const UserProfile = Storage.getProfile();
    const returnSessionExpired = () => {
        document.body.style.background = "#3481FC";
        document.body.style.display = "flex";
        document.body.style.justifyContent = "center";
    }
    //Don't remove this
    const reduxState = useSelector((state) => state )
    return (
        <>
            {window.location.href.indexOf("session-lost") > -1 ?
                <>
                    {returnSessionExpired()}
                    <SessionExpiredComponent /> </> :
                    <BrowserRouter>
                        <div className="page-wrapper">
                                <div className="search-wrapper">
                                    <div className="page-content">
                                        <PredectiveSearch />
                                    </div>
                                </div>
                            {withUserLoggedInSecure(<UserSettings loadUserSettings={LoadUserSettings} newToken={Storage.getAccessToken()} />, "", "", "", true)}
                            {isUserLoggedIn() && isUserSettingsLoaded && UserProfile != null && Agent.isShowNav() && <SideNavBar />}
                            
                            <div className="page-content" style={{paddingTop: getIsEnabled(AllFeatures.FE_FEED) ? 24 : 50}}>
                                {<>
                                    <ReportIssue />
                                    <Switch>
                                    <Route exact path="/" name="Home" component={getIsEnabled(AllFeatures.FE_FEED) ? withUserLoggedInSecure(HomeComponent, AllFeatures.FE_FEED)  : withUserLoggedInSecure(DashboardComponent, "")}/>
                                        <Route exact path="/home" name="Home" component={withUserLoggedInSecure(DashboardComponent, "")} />
                                        <Route exact path="/profile" name="Profile" component={withUserLoggedInSecure(ProfileComponent, "")} />
                                        <Route exact path="/organizationStructure" name="OrganizationStructure" component={withUserLoggedInSecure(OrgStructureComponent, "")} />
                                        <Route exact path="/feed" name="feed" component={withUserLoggedInSecure(HomeComponent, AllFeatures.FE_FEED)}/> 
                                        <Route exact path="/feedbyid/:tab?" name="feed" component={withUserLoggedInSecure(HomeComponentById, AllFeatures.FE_FEED)}/> 
                                        <Route exact path="/reportedfeed/:id" name="ReportedFeed" component={withUserLoggedInSecure(ReportedFeedComponent, AllFeatures.FE_FEED)}/> 
                                        <Route exact path="/callback" name="callback" component={withUserLoggedInSecure(CallbackComponent, "")} />
                                        <Route exact path="/middleware" name="middleware" component={withOidcSecure(MidComponent, "")} />
                                        <Route exact path="/login" name="login" component={isUserLoggedIn() ? getIsEnabled(AllFeatures.FE_FEED) ? withUserLoggedInSecure(HomeComponent, AllFeatures.FE_FEED) : withUserLoggedInSecure(DashboardComponent, "") : withOidcSecure(DirectLoginComponent, "")} />
                                        <Route exact path="/mib" name="mib" component={withUserLoggedInSecure(MIB, AllFeatures.FE_MIB_ANSWER)} />
                                        <Route exact path="/notification" name="Notification" component={withUserLoggedInSecure(NotificationComponent, "")} />
                                        <Route exact path="/announcement" name="Announcement" component={withUserLoggedInSecure(AnnouncementComponent, getIsEnabled(AllFeatures.BO_ANNOUNCEMENT) ? AllFeatures.BO_ANNOUNCEMENT : getIsEnabled(AllFeatures.FE_ANNOUNCEMENT_VIEW) ? AllFeatures.FE_ANNOUNCEMENT_VIEW : "")} />
                                        <Route exact path="/createAnnouncement" name="CreateAnnouncement" component={withUserLoggedInSecure(CreateAnnouncementComponent, AllFeatures.BO_ANNOUNCEMENT)} />
                                        <Route exact path="/groups" name="Groups" component={isUserLoggedIn() ? ( (getIsEnabled(AllFeatures.FE_GROUP) || getIsEnabled(AllFeatures.FE_GROUP_VIEW) || getIsEnabled(AllFeatures.BO_GROUP_MANAGE))? withUserLoggedInSecure(GroupsComponent, "") : FeatureNotFoundComponent) : LoginComponent } />
                                        <Route exact path="/createGroup/:tab?" name="CreateGroup" component={isUserLoggedIn()? ((getIsEnabled(AllFeatures.FE_GROUP_VIEW) && ( getIsEnabled(AllFeatures.FE_GROUP_CREATE_PRIVATE) || getIsEnabled(AllFeatures.FE_GROUP_CREATE_PUBLIC) ))?withUserLoggedInSecure(CreateGroupComponent, "") : FeatureNotFoundComponent ):LoginComponent } />
                                        <Route exact path="/groupFeed/:tab?" name="GroupFeed" component={withUserLoggedInSecure(GroupFeedComponent, AllFeatures.FE_GROUP_VIEW)} />
                                        <Route exact path="/search/:tab?" name="PredictiveSearch" component={withUserLoggedInSecure(PredictiveSearchComponent, AllFeatures.FE_FEED)} />
                                        <Route exact path="/quest/:tab?" name="Quests" component={withUserLoggedInSecure(QuestsComponent, AllFeatures.FE_QUEST_VIEW)} />
                                        <Route exact path="/editquest/:tab?" name="EditQuest" component={withUserLoggedInSecure(EditQuestComponent, AllFeatures.FE_QUEST_VIEW)} />
                                        <Route exact path="/editquestgroup/:tab?" name="EditQuestGroup" component={withUserLoggedInSecure(EditQuestGroupComponent, AllFeatures.FE_QUEST_VIEW)} />
                                        <Route exact path="/editsubquestgroup/:tab?" name="EditSubQuestGroup" component={withUserLoggedInSecure(EditSubQuestGroupComponent, AllFeatures.FE_QUEST_VIEW)} />
                                        <Route exact path="/redemption/:tab?" name="Redemption" component={withUserLoggedInSecure(RedemptionComponent, AllFeatures.FE_REDEMPTION)} />
                                        <Route exact path="/mypoints" name="MyPoints" component={withUserLoggedInSecure(MyPointsComponent, AllFeatures.FE_REWARD_POINTS_MYPOINTS)} />
                                        <Route exact path="/leaderboard" name="Leaderboard" component={isUserLoggedIn() ?
                                            (getIsEnabled(AllFeatures.FE_REWARD_LEADERBOARD) &&
                                                ((getIsEnabled(AllFeatures.FE_REWARD_LEADERBOARD_ALLTIME) && getIsEnabled(AllFeatures.FE_REWARD_LEADERBOARD_TEAM)) ||
                                                    (getIsEnabled(AllFeatures.FE_REWARD_LEADERBOARD_ALLTIME) || getIsEnabled(AllFeatures.FE_REWARD_LEADERBOARD_TEAM)) ||

                                                    (getIsEnabled(AllFeatures.FE_REWARD_LEADERBOARD_TEAM) || getIsEnabled(AllFeatures.FE_REWARD_LEADERBOARD_ALLTIME))) ? withUserLoggedInSecure(LeaderboardComponent,"") : FeatureNotFoundComponent) : LoginComponent} />
                                        <Route exact path="/goalSetting/:tab?" name="Goalsetting" component={withUserLoggedInSecure(GoalSettingComponent, AllFeatures.FE_GOAL_CREATE_GOAL)} />
                                        <Route exact path="/quiz" name="Quiz" component={withUserLoggedInSecure(QuizComponent, AllFeatures.BO_QUIZ, AllFeatures.FE_QUIZ, AllFeatures.FE_QUIZ_ANSWER)} />
                                        <Route exact path="/quizMe" name="QuizMe" component={withUserLoggedInSecure(QuizMeComponent, AllFeatures.FE_QUIZ, AllFeatures.FE_QUIZ_ANSWER)} />
                                        <Route exact path="/addNewQuiz" name="AllNewQuiz" component={withUserLoggedInSecure(AddNewQuizComponent, AllFeatures.BO_QUIZ)} />
                                        <Route exact path="/SeeAll" name="SeeAll" component={withUserLoggedInSecure(SeeAllComponent, "")} />
                                        <Route exact path="/configure" name="configure" component={withUserLoggedInSecure(ConfigureComponent, "")} />
                                        <Route exact path="/TeamsLeaderboard" name="TeamsLeaderboard" component={withUserLoggedInSecure(TeamsLeaderboardComponent, "")} />
                                        <Route exact path="/organizationInfo" name="OrganizationInfo" component={withUserLoggedInSecure(OrgInfoComponent, "")} />
                                        <Route exact path="/gigs" name="Gigs" component={withUserLoggedInSecure(GigsComponent, AllFeatures.BO_MANAGE_GIGS)} />
                                        <Route exact path="/creategig" name="CreateGig" component={withUserLoggedInSecure(CreateGigComponent, AllFeatures.BO_MANAGE_GIGS)} />
                                        <Route exact path="/gigdetails" name="GigDetails" component={withUserLoggedInSecure(GigDetailsComponent, AllFeatures.BO_MANAGE_GIGS)} />
                                        <Route exact path="/locations" name="Locations" component={withUserLoggedInSecure(LocationListComponent, AllFeatures.BO_MANAGE_LOCATIONS)} />
                                        <Route exact path="/locationDetails" name="LocationDetails" component={withUserLoggedInSecure(LocationDetailsComponent, AllFeatures.BO_MANAGE_LOCATIONS)} />
                                        <Route exact path="/createLocation" name="CreateLocation" component={withUserLoggedInSecure(CreateLocationComponent, AllFeatures.BO_MANAGE_LOCATIONS)} />
                                        <Route exact path="/people" name="people" component={withUserLoggedInSecure(PeopleComponent, AllFeatures.BO_MANAGE_PEOPLE)} />
                                        <Route exact path="/rmdashboard" name="RMDashboard" component={withUserLoggedInSecure(RmDashboardComponent, AllFeatures.BO_MANAGE_GIGS)} />
                                        <Route exact path="/feedback" name="Feedback" component={withUserLoggedInSecure(FeedbackComponent, AllFeatures.FE_ADHOCFEEDBACK, AllFeatures.FE_ADHOCFEEDBACK_VIEW)} />
                                        <Route exact path="/directory" name="Directory" component={withUserLoggedInSecure(DirectoryComponent, AllFeatures.FE_DIRECTORY)} />
                                        <Route exact path="/teamList" name="TeamList" component={TeamListComponent} />
                                        <Route exact path="/teamMemProfile" name="TeamMemProfile" component={TeamMemProfileComponent} />
                                        <Route exact path="/recognize" name="recognize" component={withUserLoggedInSecure(RecogniseComponent, AllFeatures.FE_POINTALLOCATION_GIVEREWARD)} />
                                        <Route exact path="/giveReward" name="GiveReward" component={withUserLoggedInSecure(GiveRewardComponent, AllFeatures.FE_POINTALLOCATION_GIVEREWARD)} />
                                        <Route exact path="/polls" name="polls" component={withUserLoggedInSecure(PollsComponent, AllFeatures.FE_FEED_POSTPOLL)} />
                                        <Route exact path="/survey" name="Survey" component={withUserLoggedInSecure(SurveyComponent, AllFeatures.FE_SURVEY_GIVE,AllFeatures.BO_SURVEY_REPORT_VIEW)} />
                                        <Route exact path="/createsurvey" name="CreatePolls" component={withUserLoggedInSecure(CreateSurveyComponent, AllFeatures.FE_SURVEY_CREATE_EDIT)} />
                                        <Route exact path="/surveyresults" name="SurveyResults" component={withUserLoggedInSecure(SurveyResultsComponent, "")} />
                                        <Route exact path="/help" name="help" component={HelpComponent} />
                                        <Route path="*" component={isUserLoggedIn() ? FeatureNotFoundComponent : LoginComponent} />
                                    </Switch></>}
                            </div>
                        </div>
                    </BrowserRouter>}
                </>
    );
}
export default withTranslation('translation')(withRouter(App));

