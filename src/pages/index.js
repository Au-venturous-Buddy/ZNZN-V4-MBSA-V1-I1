import React from "react"
import { graphql } from "gatsby"
import { textVide } from 'text-vide';
import WordpressBase from "../components/wordpress-base"
import allModes from "../assets/modes.json";
import tableBackgrounds from "../assets/table-backgrounds.json";

function generateSections(images, texts, imagesAlt, callAt, state) {
  var sections = [];
  callAt.forEach((sceneID) => {
    var subImages = images[sceneID]
    var subTexts = texts[sceneID.split("-")[0]]
    var subImagesAlt = imagesAlt[sceneID.split("-")[0]]

    var sectionNum = 0;
    var maxSectionNum = Math.max(parseInt(subImages[subImages.length - 1].name), parseInt(subTexts[subTexts.length - 1].name));
    var currentImage = (<section aria-hidden={true}></section>);
    var currentText = null;
    var nextTextID = 0;
    var nextImageID = 0;

    while(sectionNum <= maxSectionNum) {
      if(nextTextID < subTexts.length && parseInt(subTexts[nextTextID].name) === sectionNum) {
        var currentTextHTML = subTexts[nextTextID].childMarkdownRemark.html;
        if(state.currentBionicReadingFixation > 0) {
          currentTextHTML = textVide(currentTextHTML, { sep: ['<span class="fixation-reading">', '</span>'], fixationPoint: state.currentBionicReadingFixation });
        }
        currentText = (<section className="my-2" dangerouslySetInnerHTML={{ __html: currentTextHTML }}></section>);
        nextTextID++;
      }
  
      if(nextImageID < subImages.length && parseInt(subImages[nextImageID].name) === sectionNum) {
        currentImage = (
          <section className="my-2 center-image">
            <img style={{maxWidth: "60%"}} alt={subImagesAlt[sectionNum]} src={subImages[nextImageID].publicURL} />
          </section>
        );
        nextImageID++;
      }
  
      sections.push(currentImage)
      sections.push(currentText)
      sectionNum++;
    }
  })

  return sections;
}

function compileWordpress(data, state, modes) {
  var callAt = modes[state.currentMode]
  
  var metadataItems = null;
  var images = {};
  var texts = {};
  var imagesAlt = {};
  var currentLanguageCode = `en`;
  var languages = new Set();
  for(var i = 0; i < data.allFile.edges.length; i++) {
    var nodeItem = data.allFile.edges[i].node
    var parentFolder = nodeItem.relativeDirectory.split("/")[nodeItem.relativeDirectory.split("/").length - 1]
    if(nodeItem.relativeDirectory.includes("images") && nodeItem.ext === ".png") {
      if(!(parentFolder in images)) {
        images[parentFolder] = [];
      }
      images[parentFolder].push(nodeItem);
    }
    else if(nodeItem.relativeDirectory.includes("text") && nodeItem.ext === ".md" && nodeItem.name === "lang-info") {
      languages.add(parentFolder)
      if(nodeItem.relativeDirectory.includes("text/" + state.currentLanguage)) {
        currentLanguageCode = nodeItem.childMarkdownRemark.frontmatter.language_code
      }
    }
    else if(nodeItem.relativeDirectory.includes("text") && nodeItem.ext === ".md" && nodeItem.name === "image-alt" && nodeItem.relativeDirectory.includes("text/" + state.currentLanguage)) {
      if(!(parentFolder in imagesAlt)) {
        imagesAlt[parentFolder] = [];
      }
      imagesAlt[parentFolder] = nodeItem.childMarkdownRemark.frontmatter.image_alt
    }
    else if(nodeItem.relativeDirectory.includes("text") && nodeItem.ext === ".md") {
      if(nodeItem.relativeDirectory.includes("text/" + state.currentLanguage.split("-")[0])) {
        if(!(parentFolder in texts)) {
          texts[parentFolder] = [];
        }
        texts[parentFolder].push(nodeItem);
      }
    }
    else if(nodeItem.ext === ".md" && nodeItem.name === "index") {
      metadataItems = nodeItem;
    }
  }

  var languageOptions = []
  languages.forEach((value) => {
    languageOptions.push(<option key={value}>{value}</option>)
  })

  var sections = generateSections(images, texts, imagesAlt, callAt, state);

  return {
    metadataItems,
    languageOptions,
    currentLanguageCode,
    sections
  }
}

export default function WordpressBlogv2022_3(props) {
  const modeOptions = Object.keys(allModes);
  const tableBackgroundOptions = Object.keys(tableBackgrounds);

  return(
    <WordpressBase 
      data={props.data}
      modeOptions={modeOptions}
      defaultMode={modeOptions[Math.floor(Math.random() * modeOptions.length)]}
      modes={allModes}
      tableBackgroundOptions={tableBackgroundOptions}
      defaultTableBackground={tableBackgroundOptions[Math.floor(Math.random() * tableBackgroundOptions.length)]}
      tableBackgrounds={tableBackgrounds}
      defaultLanguage="English"
      compile={compileWordpress}
    />
  )
}

export const query = graphql`
query {
  allFile(
    filter: {relativeDirectory: {regex: "/assets/*/"}}
    sort: {relativePath: ASC}
  ) {
    edges {
      node {
        name
        ext
        relativeDirectory
        publicURL
        childMarkdownRemark {
          html
          frontmatter {
            title
            image_alt
            language_code
            format
            version
          }
        }
      }
    }
  }
}
`