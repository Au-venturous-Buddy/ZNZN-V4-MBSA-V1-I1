import React, {useState} from "react";
import Layout from "./layout"
import { Button, ButtonGroup, Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import Slider from "react-slick";
import NextArrow from "../components/next-arrow";
import PrevArrow from "../components/prev-arrow";
import SettingsButton from "./settings-button";
import ResponsiveSize from "../hooks/responsive-size";
import ResponsiveHeader from "./responsive-header";
import CloseButton from "./close-button";
import RangeSlider from 'react-bootstrap-range-slider';
import { FaRegSquare } from "react-icons/fa";
import { FaCheckSquare } from "react-icons/fa";

const helpTooltip = (message, props) => (
  <Tooltip {...props}>
    {message}
  </Tooltip>
);

function SlideThumbnail({image, caption, currentIndex, index, goToPage, closeFunction}) {
  const changeSlide = () => {
    goToPage(index)
    closeFunction()
  }

  return(
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 330,
        paddingTop: `5%`,
        paddingBottom: `5%`
      }}
    >
      <Button aria-label={`Page ${index + 1}`} className={`p-2 view img-button comic-strip-page-thumbnail ${(currentIndex === index) ? "comic-strip-page-thumbnail-current" : ""}`} onClick={changeSlide}>
        <div aria-hidden={true}>
          {image}
          <div className="comic-strip-page-number">
            {caption}
          </div>
        </div>
      </Button>
    </div>
  )
}

function PreviousButton({goToPage, slideIndex, numPages}) {
  const previousSlide = () => {
    goToPage((slideIndex > 0) ? (slideIndex - 1) : (numPages - 1));
  }
  
  return(
    <PrevArrow onClick={previousSlide} />
  )
}

function NextButton({goToPage, slideIndex, numPages}) {
  const nextSlide = () => {
    goToPage((slideIndex + 1) % numPages);
  }
  
  return(
    <NextArrow onClick={nextSlide} />
  )
}

function CaptionSlideshowToggle(props) { 
  const [show, setShow] = useState(false);
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <ButtonGroup aria-label="Page Navigator">
        <PreviousButton goToPage={props.goToPage} slideIndex={props.state.slideIndex} numPages={props.children.length} />
        <OverlayTrigger
          placement="top"
          delay={{ show: 250, hide: 250 }}
          overlay={helpTooltip("Toggle Page")}
        >
          <Button aria-label={`Toggle Page - Page ${props.state.slideIndex + 1} of ${props.children.length}`} style={{fontSize: ResponsiveSize(0.8, "rem", 0.001, 500)}} onClick={handleShow}>
            <span aria-hidden={true}>{props.state.slideIndex + 1} of {props.children.length}</span>
          </Button>
        </OverlayTrigger>
        <NextButton goToPage={props.goToPage} slideIndex={props.state.slideIndex} numPages={props.children.length} />
      </ButtonGroup>
      <Modal show={show} onHide={handleClose} fullscreen={true} scrollable={true}>
      <Modal.Header className="justify-content-center">
        <Modal.Title style={{textAlign: "center", color: "#017BFF"}}>
          <ResponsiveHeader level={1} maxSize={2} minScreenSize={500}>Toggle Page</ResponsiveHeader>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-0">
        <div className={"my-2 table-background-" + props.state.currentTableBackground.toLowerCase().replace(/ /g, "-")}>
          <ol className="wordpress-v2022_2">
            {props.children.map((currentValue, index) => (
              <li key={index}>
                <SlideThumbnail image={currentValue["image"]} caption={currentValue["text"]} currentIndex={props.state.slideIndex} index={index} goToPage={props.goToPage} closeFunction={handleClose} />
              </li>
            ))}
          </ol>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <CloseButton handleClose={handleClose} />
      </Modal.Footer>
      </Modal>
    </>
  );
}

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
              {props.modeOptions.map((mode) => (
                <option key={mode}>{mode}</option>
              ))}
            </Form.Select>
          </section>
          <section className="mb-3">
              <div className='align-items-center' style={{textAlign: 'center', color: "#017BFF"}}>
                <ResponsiveHeader level={2} maxSize={1.5} minScreenSize={500}>
                  Table Background
                </ResponsiveHeader>
              </div>
            <Form.Select style={{color: "#017BFF"}} className="hover-shadow" id="table-background-selector" onChange={props.changeTableBackground} value={props.state.currentTableBackground}>
              {['Zene', 'Zeanne', 'Classroom Table'].map((value) => (<option key={value}>{value}</option>))}
            </Form.Select>
          </section>
          <section className="mb-3">
            <div className='align-items-center pb-3' style={{textAlign: 'center', color: "#017BFF"}}>
              <ResponsiveHeader level={2} maxSize={1.5} minScreenSize={500}>{`Page Size`}</ResponsiveHeader>
            </div>
            <RangeSlider className="hover-shadow mt-3" variant="dark" tooltipLabel={currentValue => `${currentValue}%`} tooltipPlacement='top' tooltip='on' onChange={changeEvent => props.changePageSize(changeEvent.target.value)} value={props.state.currentSize} />
          </section>
          <section className="mb-3">
            <div className='align-items-center pb-3' style={{textAlign: 'center', color: "#017BFF"}}>
              <ResponsiveHeader level={2} maxSize={1.5} minScreenSize={500}>{`Bionic Reading Level`}</ResponsiveHeader>
            </div>
            <RangeSlider className="hover-shadow mt-3" variant="dark" tooltipPlacement='top' tooltip='on' onChange={changeEvent => props.changeBionicReadingFixation(changeEvent.target.value)} min={0} max={5} value={props.state.currentBionicReadingFixationIndex} />
          </section>
          <section>
            <Button onClick={props.changeOrientation}>
              {
                props.state.currentOrientation ?
                <FaCheckSquare /> :
                <FaRegSquare />
              } Easy Reading Mode
            </Button>
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
      currentBionicReadingFixation: 0,
      currentOrientation: false,
      slideIndex: 0,
      updateCount: 0
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

    changeOrientation = () => {
      var orientation = !this.state.currentOrientation;
      this.setState({currentOrientation: orientation});
      this.setState({slideIndex: 0})
    }

    goToPage = (page) => {
      this.slider.slickGoTo(page);
    }
  
    render() {
      var contents = this.props.compile(this.props.data, this.state, this.props.modes)

      const settings = {
        dots: false,
        infinite: true,
        speed: 1500,
        fade: true,
        centerPadding: "60px",
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        beforeChange: (current, next) => this.setState({ slideIndex: next })
      };

      console.log(this.props.modeOptions)

      return(
        <Layout menuBarItems={(this.state.currentOrientation ? [(<CaptionSlideshowToggle state={this.state} goToPage={this.goToPage}>{contents.sections}</CaptionSlideshowToggle>)] : []).concat([(<SettingsWindow state={this.state} version={contents.metadataItems.childMarkdownRemark.frontmatter.version} languageOptions={contents.languageOptions} modeOptions={this.props.modeOptions} changeLanguage={this.changeLanguage} changeMode={this.changeMode} changeTableBackground={this.changeTableBackground} changeBionicReadingFixation={this.changeBionicReadingFixation} changeOrientation={this.changeOrientation} />)])} showMenuBar={true}>
        <div style={this.props.tableBackgrounds[this.state.currentTableBackground]}>
          <div className={`p-3 ${contents.metadataItems.childMarkdownRemark.frontmatter.format}`}>
          <div style={{textAlign: "center"}}>
            <ResponsiveHeader level={1} maxSize={2} minScreenSize={800}>
              {contents.metadataItems.childMarkdownRemark.frontmatter.title}
            </ResponsiveHeader>
          </div>
          {
        this.state.currentOrientation ?
        <Slider ref={slider => (this.slider = slider)} {...settings}>
          {contents.sections.map((page, index) => (
            <div className="view comic-strip-page">
              {page["image"]}
              {page["text"]}
            </div>
          ))}
        </Slider> :
        <article lang={contents.currentLanguageCode} className={`m-3`}>
          {contents.sections.map((page, index) => (
            <div className="view comic-strip-page">
              {page["image"]}
              {page["text"]}
            </div>
          ))}
        </article>
        }
          </div>
        </div>
        </Layout>
      )
    }
  }