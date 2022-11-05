import React from "react";
import badgeIcon from "../../assets/icons/ic_rank_badge.svg";
import loadingGif from "../../assets/images/loading.gif";
import "./profile.scss";
import "../../assets/css/floating-labels.css";
import { Api } from "./../../api/Api";
import GetAPIHeader from "./../../api/ApiCaller";
import ErrorHandling from "./../../api/ErrorHandling";
import { withRouter } from "react-router-dom";
import AboutTab from "./aboutTab";
import BadgesTab from "./badgesTab";
import { PointsFormat } from "../../components/numberFormatter/NumberFormatter";
import { ImageTools } from "../../components/Services/image";
import { FilesService } from "../../components/Services/file";
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore,
} from "react-toasts";
import LogoutDialog from "../../components/Modal/LogoutDialog";
import $ from "jquery";
import { easeQuadInOut } from "d3-ease";
import { Animate } from "react-move";
import { Modal } from "react-bootstrap";
import EditProfile from "./editProfile";
import Loading from "../../components/Loading/loading";
import ImageUtils from "../../components/Utils/ImageUtils/ImageUtils";
import { AllFeatures } from "../../components/Services/core";
import { getIsEnabled } from "../../constants/constants";
import signoutIcon from '../../assets/images/exit_icon.png';
import settingIcon from '../../assets/images/settings_icon.png';
import SettingModal from '../../components/Modal/settingModal';
import { withTranslation } from 'react-i18next';
import { Base64Service } from '../../components/Services/base64';
import EditProfileIcon from './../../assets/images/Edit_profile.png';
import UserContext from '../../components/Context/UserContext';
import SlimLoader from '../../components/SlimLoader/slimLoader';
import BadgeWithAvatarCount from '../../components/BadgeWithAvatharCount/BadgeWithAvatharCount';
import StorageUtils from '../../containers/utils/StorageUtils';
import {connect} from 'react-redux'
import store from "../../redux/store";


const Storage = new StorageUtils();
const UserProfile = Storage.getProfile();
const base64Svc = new Base64Service();
//
const filesSvc = new FilesService();
const TicketType = {
  UserProfileImage: 101,
  Users: 103
};

export class ContentType {
  static JSON = "application/json";
  static JPEG = "image/jpeg";
  static PNG = "image/png";
  static GIF = "image/gif";
  static MP4 = "video/mp4";
}

export class BlobUpload {
  file;
  SASUrl;
  contentType;
}

class Profile extends React.Component {
  static contextType = UserContext;
  UserProfileACL = false;
  UserBadges = false;
  PublicUserBadges = false;
  PublicUserPoints = true;
  _isMounted=false;
  constructor(props) {
    super(props);
    this.setup();
  }

  componentDidMount() {
    this._isMounted=true;
    const { history } = this.props;
    this.getUserProfile();
    this.getAchievement();
    this.getUserProfileAccess();
    if (this.props.match.params.tab) {
      $("#nav-" + this.props.match.params.tab + "-tab").tab("show");
    }

    if(history.location.state==="badges"){
      this.setState({fromrank:true,badgesTab:true,aboutTab:false})
    }

    if (
      history.location &&
      history.location.state &&
      history.location.state.email !== UserProfile.email
    ) {
      this.setState({
        otherProfile: !this.state.otherProfile,
      });
    }
  }

  setup() {
    const { history } = this.props;
    this.state = {
      profileInfo: [],
      achievement: [],
      progress: 0,
      userPoints: 0,
      pointsType: "",
      file: "",
      imagePreviewUrl: "",
      uploading: 0,
      openModal: 0,
      isAnimated: false,
      contactCardClicked: false,
      otherProfile: false,
      loading: 0,
      email:
        (history.location &&
          history.location.state &&
          history.location.state.email) ||
        UserProfile.email,
      openEditProfileModal: 0,
      language: "en",
      showAllPositions: false,
      badgesTab:false,
      aboutTab:true
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps && nextProps.location && nextProps.location.state && nextProps.location.state.email && nextProps.email !== prevState.email) {
      return {
        email: nextProps.location.state.email,
        otherProfile: false,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.email !== this.state.email) {
      this.setState({
        email: this.state.email,
        otherProfile: this.state.otherProfile,
      });
      this.getUserProfile();
      this.getAchievement();
      this.getUserProfileAccess();
    }
  }

  getUserProfileAccess() {
    this.UserProfileACL = getIsEnabled(AllFeatures.FE_USERPROFILE);
    if (this.state.email === UserProfile.email) {
      this.UserBadges = getIsEnabled(AllFeatures.FE_REWARD_BADGES_MYBADGES);
    }
    if (this.state.email !== UserProfile.email) {
      this.PublicUserBadges = getIsEnabled(AllFeatures.FE_REWARD_BADGES_PUBLIC);
      this.PublicUserPoints = getIsEnabled(AllFeatures.FE_REWARD_POINTS_PUBLIC);
    }
  }

  getUserProfile() {

    let UserProfile = JSON.parse(localStorage.getItem("Profile"));
    this.setState({ uploading: 1, loading: 1 });
      new Api(GetAPIHeader(Storage.getAccessToken())).v31
      .getProfile(this.state.email)
      .then((results) => {
        this.setState({ profileInfo: results, uploading: 0, loading: 0 });
        if(UserProfile && UserProfile.email !== null && UserProfile.email !== "" && UserProfile.email !== undefined){
          if(this.state.email === UserProfile.email){
            localStorage.setItem('CUI', base64Svc.encode(JSON.stringify(results)));
          } 
        }
      })
      .catch((err) => {				
        ErrorHandling(err)
        this.setState({loading: 0, uploading: 0});
      });
  }
  
  getAchievement() {

    new Api(GetAPIHeader(Storage.getAccessToken())).v31
      .getAchievement(this.state.email)
      .then((results) => {
        this.setState({
          achievement: results,
          userPoints: results.AccumulativeEligiblePoints,
          isAnimated: true,
          pointsType: results.PointsType.toUpperCase(),
        });
        const percentage =
          (this.state.userPoints * 100) / this.state.achievement.UnlockPoints;
        this.setState({
          progress:
            this.state.achievement.NextLevel !== ""
              ? percentage > 100
                ? 100
                : percentage
              : 100,
        });
      })
      .catch((err) => {				
        ErrorHandling(err)
        console.log(err);
      });
  }

  handleFileInput(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    let img = "";
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
      });
      this.uploadPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  }

  uploadPhoto(blobUrl) {

    const {t}=this.props;
    this.setState({ uploading: 1 });
    var blob = ImageTools.dataURItoBlob(blobUrl);
    new Api(GetAPIHeader(Storage.getAccessToken())).v31
      .issueUploadTicket(TicketType.Users, {
        fileExtension: filesSvc.getTypeExtension(blob.type),
      })
      .then((ticket) => {
        filesSvc
          .uploadBlob(ticket.SASUrl, blob, blob.type)
          .subscribe((responseUrl) => {
            new Api(GetAPIHeader(Storage.getAccessToken())).v31
              .changeProfileImage({ Url: responseUrl })
              .then((res) => {
                ToastsStore.success(t('profile.profileImageUpdateMsg'));
                this.setState({ uploading: 0 });
              })
              .catch((err) => {				
                ErrorHandling(err)
                ToastsStore.warning(t('profile.internalErr'));
                console.log(err);
              });
          });
      });
  }

  openModal() {
    this.setState({ openModal: 1 });
  }

  HideModal() {
    this.setState({ openModal: 0 });
    $("#myModal").modal("hide");
  }

  closeEditProfileModal() {
    this.setState({
      openEditProfileModal: 0,
    });
  }

  showEditProfileModal() {
    this.setState({
      openEditProfileModal: 1,
    });
  }

  handleClose = () => {
    this.setState({ contactCardClicked: false });
  };

  renderContactModal() {
    const {t}=this.props;
    const { contactCardClicked, profileInfo } = this.state;
    return (
      <Modal
        className="my-modal contact-card-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
        animation={true}
        show={contactCardClicked}
        onHide={this.handleClose}
      >
        <Modal.Title className="teamTitle">
          {t('profile.contact')}
        </Modal.Title>
        
      </Modal>
    );
  }

  onContactClick = () => {
    this.setState({
      contactCardClicked: true,
    });
  };

  navigateToMyPoints(screen) {
    this.props.history.push(screen);
  }

  onSettingClick = () => {
    this.setState({
      openSettingModal: true
    })
  }

  onCloseSettingModal = () => {
    this.setState({
      openSettingModal: false
    })
  }
  showAllPositionsClick(e, show, positions){
    e.stopPropagation();
    this.setState({showAllPositions: show});
  }

  renderImage = () => {
    const { imagePreviewUrl, profileInfo } = this.state;
    return (
      <ImageUtils
        src={ imagePreviewUrl ? imagePreviewUrl : profileInfo.ImageUrl }
        name={ profileInfo ? profileInfo.FullName : ""}
        width={110}
        className="rounded-circle"
      />
    )
  }

  render() {
    const {t}=this.props;
    let { imagePreviewUrl } = this.state;
    const profilePicture = store.getState().profileInfo.profileInfo.ImageUrl;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (
        <ImageUtils
          src={this.state.uploading === 0 ? imagePreviewUrl : loadingGif}
          width={110}
          className="rounded-circle"
        />
      );
    } else {
      $imagePreview = (
        <ImageUtils
          src={profilePicture}
          name={this.state.profileInfo.FullName}
          width={110}
          className=" "
        />
      );
    }
    return (
      <div>
        {this.renderContactModal()}
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
          lightBackground
        />
        {this.state.loading ? (
          <>
          <SlimLoader isAnimating={!this._isMounted} />
          <Loading Height="0" />
          </>
        ) : (
            <div className="container">
              <div className="px-2">
                {UserProfile.email === this.state.email ? (
                  <div className="mt-2 d-flex flex-row-reverse">
                    <div className="d-flex flex-row-reverse position-logout-button mt-lg-0 mt-md-0 mt-sm-0">
                    <button
                      className="btn btn-logout py-0"
                      onClick={() => this.openModal()}
                    >
                      {t('common.signOut')}
                    </button>
                  <img alt="" src={signoutIcon} className="pointer mt-1" style={{width:16, height: 16}} />

                    </div>
                    {getIsEnabled(AllFeatures.FE_LOCALIZATION) &&
                    <div className="d-flex flex-row-reverse mt-lg-5 mt-md-5 mt-sm-5 position-logout-button">
                    <button
                      className="btn btn-logout py-0"
                      onClick={this.onSettingClick}
                    >
                      {t('common.settings')}
                    </button>
                  <img alt="" src={settingIcon} className="pointer mt-1" style={{width:16, height: 16}} />
                    </div>}
                  </div>
                ) : null}
                <div className="row justify-content-center">
                  <div className="col-sm-8 p-0">
                    <div className="app-card text-center">
                      <div className="row align-items-center">
                        <div className="col-3"></div>
                        <div className="col-6">{this.renderImage()}</div>
                        <div className="col-3">
                          {UserProfile.email === this.state.email && (
                            <>
                              <div className="contact-div">
                              <img alt="" src={EditProfileIcon} className="pointer" onClick={this.showEditProfileModal.bind(this)}/>
                                <p className="font-weight-bold normal">
                                  {t('profile.editProfile')}
                                </p>
                              </div>{" "}
                            </>
                          )}
                          {this.state.openEditProfileModal === 1 && (
                            <EditProfile
                              show={this.state.openEditProfileModal}
                              ID={this.state.ID}
                              closeEditProfile={this.closeEditProfileModal.bind(
                                this
                              )}
                              profileData={this.state.profileInfo}
                              refreshData={this.getUserProfile.bind(this)}
                            />
                          )}
                        </div>
                      </div>
                      <h5 className=" mt-2 mb-0" style={{ wordBreak: "break-all" }}>
                        {this.state.profileInfo.FullName}
                      </h5>
                      <p className="text-gray">
                      <BadgeWithAvatarCount data={this.state.profileInfo.BusinessUnits} displayMultiple="4"/>
                      </p>
                    </div>
                  </div>
                </div>

                <br />
                <div className="row justify-content-center">
                  <div
                    className="col-sm-8 app-card"
                    style={!this.state.otherProfile && getIsEnabled(AllFeatures.FE_REWARD_POINTS_MYPOINTS) ? { cursor: "pointer" } : { cursor: "default" }}
                    onClick={
                      !this.state.otherProfile && getIsEnabled(AllFeatures.FE_REWARD_POINTS_MYPOINTS)
                        ? () => this.navigateToMyPoints("mypoints")
                        : ""
                    }
                  >
                    <div className="float-left">
                      <p className="font-weight-bold ">
                        {this.state.achievement.LevelName}&nbsp;
                      <img className="achievementIcon" src={badgeIcon} />
                      </p>
                      {getIsEnabled(AllFeatures.FE_REWARD_LEADERBOARD_RANK) && (
                        <p className=" text-gray normal">
                          {t('profile.currentRank')}
                        </p>
                      )}
                    </div>
                    {this.PublicUserPoints && (
                      <>
                        <div className="float-right">
                          <Animate
                            start={() => ({
                              points: 0,
                            })}
                            update={() => ({
                              points: [
                                this.state.isAnimated ? this.state.userPoints : 0,
                              ],
                              timing: {
                                duration: 0.6 * 1000,
                                ease: easeQuadInOut,
                              },
                            })}
                          >
                            {({ points }) => {
                              const roundedPoints = Math.round(points);
                              const pointsType = this.state.pointsType;
                              return (
                                <h6 className="text-primary  text-right">
                                  {`${
                                    PointsFormat(roundedPoints) + " " + pointsType
                                    }`}
                                </h6>
                              );
                            }}
                          </Animate>
                          {getIsEnabled(AllFeatures.FE_REWARD_LEADERBOARD_RANK) && (
                            <h6
                              className="normal text-gray text-right"
                              style={{ textAlign: "right" }}
                            >
                              {this.state.achievement.UnlockPoints
                                ? PointsFormat(this.state.achievement.UnlockPoints)
                                : "Max"}
                            </h6>
                          )}
                        </div>
                        <div className="progress">
                          <div
                            className="progress-bar progress-bar-info"
                            role="progressbar"
                            aria-valuenow={this.state.progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{ width: this.state.progress + "%" }}
                          ></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <br />
                <div className="row justify-content-center">
                  <div className="col-sm-8 p-0">
                    <nav>
                      <div
                        className="nav nav-tabs app-tabs justify-content-center"
                        id="nav-tab"
                        role="tablist"
                      >
                        {this.UserProfileACL &&  (
                         <a
                             className= {this.state.fromrank?  "nav-item nav-link": "nav-item nav-link active"}
                            id="nav-about-tab"
                            data-toggle="tab"
                            href="#nav-about"
                            role="tab"
                            aria-controls="nav-about"
                            aria-selected="true"
                            onClick={()=>this.setState({aboutTab:true})}
                          >
                            {t('profile.about')}
                          </a>
                        )}
                        {(this.PublicUserBadges || this.UserBadges) && (
                          <a
                            className={
                              this.UserProfileACL 
                                ? (this.state.fromrank? "nav-item nav-link active":"nav-item nav-link")
                                :("nav-item nav-link active")
                            }
                            id="nav-badges-tab"
                            data-toggle="tab"
                            href="#nav-badges"
                            role="tab"
                            aria-controls="nav-badges"
                            aria-selected="false"
                            onClick={()=>this.setState({badgesTab:true})}
                          >
                            {t('profile.badges')}
                          </a>
                        )}
                      </div>
                    </nav>

                    <div className="tab-content" id="nav-tabContent">
                      {this.UserProfileACL &&  this.state.aboutTab &&(
                        <div
                          className={this.state.fromrank ? "tab-pane fade show":"tab-pane fade show active"}
                          id="nav-about"
                          role="tabpanel"
                          aria-labelledby="nav-about-tab"
                        >
                          <AboutTab
                            email={this.state.email}
                            profileInfo={this.state.profileInfo}
                          />
                        </div>
                      )}
                      {(this.PublicUserBadges || this.UserBadges) && this.state.badgesTab &&  (
                        <div
                          className={
                            this.UserProfileACL 
                                ? (this.state.fromrank? "nav-item nav-link active":"nav-item nav-link")
                                :(this.state.fromrank? "nav-item nav-link active":"nav-item nav-link")
                          }
                          id="nav-badges"
                          role="tabpanel"
                          aria-labelledby="nav-badges-tab"
                        >
                          <BadgesTab email={this.state.email} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        {this.state.openModal === 1 && (
          <LogoutDialog className="show" onHide={this.HideModal.bind(this)} />
        )}
        {
          this.state.openSettingModal && 
          <SettingModal 
             show={this.state.openSettingModal}
             handleClose={this.onCloseSettingModal}
             btnText={t('common.saveChanges')}
          />
        }
      </div>
    );
  }
}

export default withTranslation('translation')((connect())(withRouter(Profile)));
