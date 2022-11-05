import React, { Component } from 'react';
import HeaderBanner from '../../components/Banner/headerBanner';
import { withTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import bannerIcon from '../../assets/images/Surveybanner.svg';
import './surveyStyles.scss';
import { withRouter } from "react-router-dom";
import {getIsEnabled} from '../../constants/constants';
import {AllFeatures} from '../../components/Services/core';
import SurveyList  from './SurveyList';
import {connect} from 'react-redux';
import {setWarningPopupStatus} from '../../redux/actions/commonActions';
import AdminSurvey from './AdminSurvey';

class Survey extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         activeTab:"",
      }
    }
    componentDidMount(){    
        const {dispatch} = this.props;
        dispatch(setWarningPopupStatus(false));
        let myActivetab=localStorage.getItem("activeSurveyTab")
        console.log('tab',myActivetab);
        myActivetab==="survey" || myActivetab===null ? this.setState({activeTab:"survey"}) : this.setState({activeTab:"survey-admin"})
    }

    surveyTab(){
        this.setState({activeTab:"survey"})
        localStorage.setItem("activeSurveyTab","survey")
    }

    surveyAdminTab(){
        this.setState({activeTab:"survey-admin"})
        localStorage.setItem("activeSurveyTab","survey-admin")
    }

    render() {
        console.log(this.state.activeTab);
        const {t}=this.props;
        return (
            <div className="container">
                <div className="pt-4">
                <nav>
                    <div className={(this.state.activeTab==="survey" || localStorage.getItem("activeSurveyTab")==="survey") ?"nav nav-tabs app-tabs":"nav nav-tabs app-tabs ml-n3"} id="nav-tab" role="tablist">
                        {getIsEnabled(AllFeatures.FE_ANNOUNCEMENT_VIEW) &&
                            <a className={this.state.activeTab === "survey" ? "nav-item nav-link active" : "nav-item nav-link"} id="nav-survey-tab" onClick={()=>this.surveyTab()}
                                data-toggle="tab" href="#nav-survey" role="tab" aria-controls="nav-announcement"
                                aria-selected="false" >{t('survey.surveys')}</a>}
                        {getIsEnabled(AllFeatures.BO_ANNOUNCEMENT) &&
                            <a className={this.state.activeTab === "survey-admin" ? "nav-item nav-link active" : "nav-item nav-link"} id="nav-admin-survey-tab" onClick={()=>this.surveyAdminTab()}
                                data-toggle="tab" href="#nav-admin-survey" role="tab" aria-controls="nav-admin-survey"
                                aria-selected={this.state.activeTab === "survey-admin" ? true : false}  >{t('sideNavBar.admin')}</a>}
                    </div>
                </nav>
                    {this.state.activeTab==="survey" && <HeaderBanner 
                        bannerImg={bannerIcon} 
                        bannerHeader={t("survey.bannerHeader")}
                        bannerDesc={t("survey.bannerDesc")}
                        bannerBackground={'#FFF6D8'} bannerH4Color={'#ECB50A'} />}
                <div className="row">
                    {(this.state.activeTab==="survey" || localStorage.getItem("activeSurveyTab")==="survey") ?<div className="col-md-8 mt-4">
                        <SurveyList />
                    </div>: <AdminSurvey /> }
                    {this.state.activeTab==="survey" && getIsEnabled(AllFeatures.FE_SURVEY_CREATE_EDIT) &&
                        <div className="col-md-4">
                            <Button className="w-100 mt-4" onClick={() => this.props.history.push('/createsurvey')}>
                                {t("survey.startNewSurvey")}
                            </Button>
                        </div>}
                </div>
                </div>
            </div>
        );
    }
}

export default withTranslation('translation')((connect())(withRouter(Survey)));