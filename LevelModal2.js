import React, { Component, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import './alertdialog.scss'
import { Api } from '../../api/Api';
import GetAPIHeader from '../../api/ApiCaller';
import ErrorHandling from '../../api/ErrorHandling';
import { withTranslation } from 'react-i18next';
import StorageUtils from '../../containers/utils/StorageUtils';
import { PointsFormat } from '../../components/numberFormatter/NumberFormatter';
import LevelIcon from '../../assets/icons/levelIcon.png'
import LevelIconBlue from '../../assets/icons/leveliconBlue.png'
// import { ProgressBar, Step } from "react-step-progress-bar";
// import Box from '@mui/material/Box';
// import Stepper from '@mui/material/Stepper';
// import Step from '@mui/material/Step';
// import StepLabel from '@mui/material/StepLabel';
// import Box from '@mui/material/Box';
// import "react-step-progress-bar/styles.css";
import Modal3 from './Modal3'
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import '../../index.css';

import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';
const Storage = new StorageUtils();

class LevelModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      updating: 0,
      language: 'en',
      arr: ['Newbie', 'Up & Coming', 'Wannabe', 'On The Fast Lane', "Rockstar", "Millionare", "Angel Investor", "Godzillionare"],
      arr2: [{LevelName:'Newbie',UnlockPoints:0},{LevelName:'Wannabe',UnlockPoints:40000} ],
      selected: "second",
      totalPoints:this.props.allLevels[this.props.allLevels.length-1].UnlockPoints,
      steps:[
        'Select master blaster campaign settings',
        'Create an ad group',
        'Create an ad',
      ]
    }
  }

  closeModal() {
    this.props.closeDeleteModal();
  }



  renderBar = () => {
    console.log(this.props.allLevels);
    return (
      <div style={{ "marginTop": "5rem", "margin-left": "2rem", "margin-right": "2rem" }}>
       {/* <Modal3 allLevels={this.props.allLevels}/> */}
       {/* <Box sx={{ width: '100%' }}>
      <Stepper activeStep={this.props.allLevels.length} alternativeLabel>
        {this.props.allLevels.map(item => (
          <Step key={item.LevelName}>
            <StepLabel icon={LevelIcon}> <div className='d-flex flex-column'> <div>{item.LevelName}</div><div>{item.UnlockPoints}</div></div></StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box> */}
     <Steps model={this.props.allLevels} />
      </div>
    );
  }

  render() {
    const { t } = this.props;
    return (
      <div style={{ padding: '0px' }}>
        <Modal
          dialogClassName={"cancelbutton"}
          show={true}
          onHide={() => { this.closeModal() }}
          centered
          size="xl">
          <div className={"maincontainer container2"}>
            <Modal.Header>
              <div style={{ "fontWeight": "600", "fontSize": "20px", "color": "#252631", "marginTop": "-2rem","position":"fixed" }}>
                {t("profile.progressLevel")}
              </div>

            </Modal.Header>

            <Modal.Body >
              <div className={this.props.allLevels.length==2 ? "bodyClass2" : 'bodyClass'}>
                <hr style={{ "marginTop": "0rem", "marginBottom": "1rem" }} />
                <p style={{ "fontSize": "14px", "fontWeight": "400", "color": "#000000" }}>{t("profile.profileMsg")}</p>
                {this.renderBar()}
                <br />
                <br />
                <br />
              </div>
            </Modal.Body>
            <Modal.Footer className={this.props.allLevels.length==2 ? "footerClass2" : 'footerClass'} style={{ border: '0px', height: '75px', padding: '25px 20px 0px 10px !important', marginBottom: "-2rem" }}>
              <Button className="confirmbutton" style={{ marginRight: '2em' }} onClick={() => { this.closeModal(); }}>{t('common.cancel')}</Button>

            </Modal.Footer>
          </div>
        </Modal>
      </div>
    )
  }

}

export default withTranslation('translation')(LevelModal);
