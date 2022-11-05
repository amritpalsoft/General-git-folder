import React from 'react';
import badgeIcon from '../../assets/images/GroupBadge.png';
import {Api} from './../../api/Api';
import GetAPIHeader from './../../api/ApiCaller';
import ErrorHandling from './../../api/ErrorHandling';
import BadgeDetails from '../../components/Modal/BadgeDetails';
import $ from 'jquery';
import { withTranslation } from 'react-i18next';
import StorageUtils from '../../containers/utils/StorageUtils';
import Loading from '../../components/Loading/loading';

const Storage = new StorageUtils();
const UserProfile = Storage.getProfile();
class BadgesTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userBadges: [],
            earnedBadges: [],
            unearnedBadges: [],
            badgeInfo: [],
            openModal: 0,
            loadingBadgeData: 1,
            language: "en",
            loading:0
        }
    }

    getBadges() {
        let email = this.props.email || UserProfile.email;
        this.setState({loading:1})
        new Api(GetAPIHeader(Storage.getAccessToken())).v31.getBadges(email)
            .then(results => {
                this.setState({userBadges: results,loading:0})
                this.setState({earnedBadges: this.state.userBadges.filter((badge) => badge.IsUnlocked === true)});
                this.setState({unearnedBadges: this.state.userBadges.filter((badge) => badge.IsUnlocked === false)});
            }).catch((err) => {				ErrorHandling(err)
            console.log(err)
            this.setState({loading:0})
        });
    }

    getBadgeInfo(code) {
        new Api(GetAPIHeader(Storage.getAccessToken())).v31.getBadge(UserProfile.email, code)
            .then(results => {
                this.setState({badgeInfo: results, loadingBadgeData: 0})
            }).catch((err) => {				ErrorHandling(err)
            console.log(err)
        });
    }

    openModal(badgeCode) {
        if (badgeCode !== '') {
            this.setState({openModal: 1});
            this.getBadgeInfo(badgeCode);
        }
    }

    HideModal() {
        this.setState({openModal: 0});
        $('#myModal').modal('hide');
    }

    componentDidMount() {
        this.getBadges();
    }

    render() {
        const {t}=this.props;
        const earnedBadges = this.state.earnedBadges.map((badge, key) =>
            <div key={badge.Code}>
                <div className="app-card mb-3 d-flex pointer" 
                     data-target="#myModal"
                     onClick={() => this.openModal(badge.Code)}>

                    <div className="mr-3">
                        <img src={badge.ImageUrl ? badge.ImageUrl : badgeIcon} className='active-badge rounded-circle' width={60}
                             height={60} alt=""/>
                    </div>
                    <div className=" align-self-center" style={{wordWrap:"break-word", overflow: 'hidden'}}>
                        <h6 className=" text-primary">{badge.Name}</h6>
                        <p className="normal">{badge.Description}</p>
                    </div>
                </div>

                {this.state.openModal === 1 &&
                <BadgeDetails className="show" header={this.state.badgeInfo.Name} badgeBody={this.state.badgeInfo}
                              onHide={this.HideModal.bind(this)} loading={this.state.loadingBadgeData}/>
                }
            </div>
        );
        const unearnedBadges = this.state.unearnedBadges.map((badge, key) =>
            <div key={badge.Code}>
                <div className="app-card mb-3 d-flex inactive-card pointer" 
                     data-target="#myModal"
                     onClick={() => this.openModal(badge.Code)}>

                    <div className="mr-3">
                        <img src={badge.ImageUrl ? badge.ImageUrl : badgeIcon} className='inactive-badge rounded-circle' width={60}
                             height={60} alt=""/>
                    </div>
                    <div className="align-self-center" style={{wordWrap:"break-word", overflow: 'hidden'}}>
                        <h6 className="text-gray">{badge.Name}</h6>
                        <p className="normal text-gray">{badge.Description}</p>
                    </div>
                </div>

                {this.state.openModal === 1 &&
                <BadgeDetails className="show" header={this.state.badgeInfo.Name} badgeBody={this.state.badgeInfo}
                              onHide={this.HideModal.bind(this)} loading={this.state.loadingBadgeData}/>
                }
            </div>
        );
        return (
            this.state.loading?<Loading/> :<div>
                <br/>
                {earnedBadges}
                <h6 className="background text-center mb-3"><span>{t('profile.lockedBadges')}</span></h6>
                {unearnedBadges}
            </div> 
        )
    }
}

export default withTranslation('translation')(BadgesTab);
