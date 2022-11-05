import Modal from 'react-bootstrap/Modal'
import React, {Component} from 'react';
import '../../../containers/collaborate/goalsetting/goalsettings.scss';
import {Col, Container, Row} from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { each } from 'jquery';
import Iframe from 'react-iframe'  

class RedemptionInfo extends Component {

    // TODO - move the api call & loading to this component inside the modal
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {       
        const {t} = this.props;
        return (
            <Modal
                dialogClassName=" "
                {...this.props}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                size="lg">
                <p className="redemptionInfoStyle">{t("redemption.redemptionInfo")}</p>    
                {
                    this.props.redemptioninfo.map((eachItem, index) => {
                        return (<div>                            
                            <Container style={{padding: '0', margin: '0'}}>
                                <div className="row mt-4">                                                                        
                                    <div className="col-5 col-xs-5 col-sm-5 col-md-4 col-lg-4 col-xl-4">                                        
                                        <div className='d-flex align-items-start'>
                                            <div>                                                
                                                <span className="redemptionInfoStyle">{index + 1}.</span>
                                            </div>                                             
                                            <div className='w-100'>
                                                <img src={this.props.item.ImageUrl} style={{backgroundSize: 'cover', height: 110, width: '100%'}} className="ml-1"/>
                                            </div>
                                        </div>                                                                   
                                    </div>
                                    <div className="col-7 col-xs-7 col-sm-7 col-md-5 col-lg-5 col-xl-5" style={{height: 'auto !important'}}>
                                        <div className="row"  style={{height: 'auto !important'}}>
                                            <div className="col-12 col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                                <p className="redemptionInfoStyle text_black">{this.props.item.Name}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                                <p className="redemptionInfoItemCode text_grey">{eachItem.Code}</p>
                                            </div>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-12 col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                                <p className="redemptionInfoItemStatus text_grey">{t("redemption.status")} <span
                                                    className="redemptionInfoItemStatus text_black">{eachItem.Status}</span>
                                                </p>
                                            </div>
                                            <div className="col-12 col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                                <p className="redemptionInfoExpiringDate text_black">
                                                    {this.props.item.Vendor === "Wogi" ? t("redemption.activateBefore") : t("redemption.expiringOn")}
                                                    {" "}
                                                    {eachItem.ExpiryDate}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 d-flex justify-content-center align-items-center">
                                            <button type="button" className="btn btn-primary btn-block btn-sm uppendMargin redemptionInfoRedeemButtonFontStyle" onClick={() => { this.redeem(eachItem.Link) }}>
                                                    {t("redemption.Redeem")}
                                            </button>
                                            <a href="mailto:?subject=www&body=https://stg.wogi.dev/redeem/ELHaGn2z1A">
                                             <button id="btnOutlook">Go to Outlook</button>
                                            </a>
                                            
                                    </div>
                                    <div className='w-100'>
                                    <div className="embed-responsive"> 
                                    <Iframe url={eachItem.Link}
                                        width="850px"
                                        height="550px"  
                                        className="embed-responsive-item"/>  
                                </div>
                                               </div>
                                </div>
                            </Container>
                        </div>)
                    })
                }                
            </Modal>
        )
    }

    closeModal() {
        this.props.onHide();
    }

    redeem(redeemLink) {
        window.open(redeemLink);
    }
}

export default withTranslation('translation')(RedemptionInfo);
