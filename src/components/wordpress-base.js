import React, {useState} from "react";
import Layout from "./layout"
import { Modal, Form } from "react-bootstrap";
import SettingsButton from "./settings-button";
import ResponsiveSize from "../hooks/responsive-size";
import ResponsiveHeader from "./responsive-header";
import CloseButton from "./close-button";
import RangeSlider from 'react-bootstrap-range-slider';

  function SettingsWindow(props) {
    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return(
      <>
      <SettingsButton fontButtonSize={ResponsiveSize(0.8, "rem", 0.001, 500)} handleShow={handleShow} />
      <Modal show={show} onHide={handleClose} fullscreen={true} scrollable={true}>
          <Modal.Header className="justify-content-center">
            <Modal.Title style={{color: "#017BFF"}}>
              <ResponsiveHeader level={1} maxSize={2} minScreenSize={500}>Settings</ResponsiveHeader>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <section className="mb-3">
              <div className='align-items-center' style={{textAlign: 'center', color: "#017BFF"}}>
                <ResponsiveHeader level={2} maxSize={1.5} minScreenSize={500}>
                  Language and Dialogue
                </ResponsiveHeader>
              </div>
              <Form.Select style={{color: "#017BFF"}} className="hover-shadow" id="language-selector" onChange={props.changeLanguage} value={props.state.currentLanguage}>
                {props.languageOptions}
              </Form.Select>
            </section>
            <section className="mb-3">
                <div className='align-items-center' style={{textAlign: 'center', color: "#017BFF"}}>
                  <ResponsiveHeader level={2} maxSize={1.5} minScreenSize={500}>
                    Mode
                  </ResponsiveHeader>
                </div>
              <Form.Select style={{color: "#017BFF"}} className="hover-shadow" id="mode-selector" onChange={props.changeMode} value={props.state.currentMode}>
                {props.modeOptions.map((value) => (<option key={value}>{value}</option>))}
              </Form.Select>
            </section>
            <section className="mb-3">
                <div className='align-items-center' style={{textAlign: 'center', color: "#017BFF"}}>
                  <ResponsiveHeader level={2} maxSize={1.5} minScreenSize={500}>
                    Table Background
                  </ResponsiveHeader>
                </div>
              <Form.Select style={{color: "#017BFF"}} className="hover-shadow" id="table-background-selector" onChange={props.changeTableBackground} value={props.state.currentTableBackground}>
                {props.tableBackgroundOptions.map((value) => (<option key={value}>{value}</option>))}
              </Form.Select>
            </section>
            <section className="mb-3">
            <div className='align-items-center pb-3' style={{textAlign: 'center', color: "#017BFF"}}>
              <ResponsiveHeader level={2} maxSize={1.5} minScreenSize={500}>{`Bionic Reading Level`}</ResponsiveHeader>
            </div>
            <RangeSlider className="hover-shadow mt-3" variant="dark" tooltipPlacement='top' tooltip='on' onChange={changeEvent => props.changeBionicReadingFixation(changeEvent.target.value)} min={0} max={5} value={props.state.currentBionicReadingFixationIndex} />
          </section>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <CloseButton handleClose={handleClose} />
          </Modal.Footer>
        </Modal>
      </>
    )
  }

  export default class WordpressBase extends React.Component {
    state = {
      currentLanguage: this.props.defaultLanguage,
      currentMode: this.props.defaultMode,
      currentTableBackground: this.props.defaultTableBackground,
      currentSize: 65,
      currentBionicReadingFixationIndex: 0,
      currentBionicReadingFixation: 0
    }
  
    changeLanguage = () => {
      var language = document.getElementById("language-selector").value;
      this.setState({currentLanguage: language});
    }
  
    changeMode = () => {
      var mode = document.getElementById("mode-selector").value;
      this.setState({currentMode: mode});
    }
  
    changeTableBackground = () => {
      var tableBackground = document.getElementById("table-background-selector").value;
      this.setState({currentTableBackground: tableBackground});
    }
    
    changeBionicReadingFixation = (bionicReadingFixationRaw) => {
      this.setState({currentBionicReadingFixation: parseInt(bionicReadingFixationRaw)})
      this.setState({currentBionicReadingFixationIndex: parseInt(bionicReadingFixationRaw)});
    }
  
    render() {
      var contents = this.props.compile(this.props.data, this.state, this.props.modes)
      console.log(this.props.tableBackgrounds[this.state.currentTableBackground])

      return(
        <Layout menuBarItems={[(<SettingsWindow state={this.state} languageOptions={contents.languageOptions} modeOptions={this.props.modeOptions} tableBackgroundOptions={this.props.tableBackgroundOptions} changeLanguage={this.changeLanguage} changeMode={this.changeMode} changeTableBackground={this.changeTableBackground} changeBionicReadingFixation={this.changeBionicReadingFixation} />)]} showMenuBar={true}>
        <div style={this.props.tableBackgrounds[this.state.currentTableBackground]}>
          <div className={`p-3 ${contents.metadataItems.childMarkdownRemark.frontmatter.format}`}>
          <div style={{textAlign: "center"}}>
            <ResponsiveHeader level={1} maxSize={2} minScreenSize={800}>
              {contents.metadataItems.childMarkdownRemark.frontmatter.title}
            </ResponsiveHeader>
          </div>
          <article lang={contents.currentLanguageCode} className={`m-3`} style={{textAlign: "justify"}}>
            {contents.sections}
          </article>
          </div>
        </div>
        </Layout>
      )
    }
  }