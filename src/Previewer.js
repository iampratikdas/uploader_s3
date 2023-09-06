import React, { Component } from 'react';
// import axios from 'axios';
import AWS from "aws-sdk";
import Uppy from "@uppy/core";
import "@uppy/core/dist/style.css";
import { Viewer } from '@react-pdf-viewer/core';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

class Previewer extends Component {
  state = {
    url: null,
    type: null
  };

  componentDidMount() {
    this.fetchPdf();
  }
  // componentDidUpdate() {
  //   this.fetchPdf();
  // }
  componentDidUpdate(prevProps) {
    if (prevProps.keysObject !== this.props.keysObject) {
      this.fetchPdf();
    }
  }
  fetchPdf = async () => {
    let bucketName = 'oslm-s3-bucket';
    let fileKey = this.props.keysObject;
    if (fileKey.endsWith(".jpg") || fileKey.endsWith(".jpeg") || fileKey.endsWith(".pdf") || fileKey.endsWith(".doc") || fileKey.endsWith(".docx")|| fileKey.endsWith(".png")) {
    let serverBaseUrl = 'http://localhost:4000';
    console.log("fileKey==>",fileKey)
    const endpoint = `${serverBaseUrl}/preview/${bucketName}/${fileKey}`;
    fetch(endpoint)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob(); // Convert the response to a Blob
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        this.setState({ url, type: fileKey.split(".")[1]});
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
    }else{
      window.confirm("Not Previewable Plz Upload something else");
      return;
    }
  }
  render() {
    const { url } = this.state;
    const { type } = this.state;
    console.log("type==>", type)
      if(type === null){
        return(<div></div>)
      }
      switch(type){
        case "pdf":
          return (<div
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                height: '750px',
            }}>
              <Viewer fileUrl={url} />
          </div>);
        case "jpg":
          return (<div
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                height: '750px',
            }}>
              <img src={url}  alt="" />
          </div>);
        case "jpeg":
          return (<div
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                height: '750px',
            }}>
              <img src={url}  alt="" />
          </div>);
        case "png":
          return (<div
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                height: '750px',
            }}>
              <img src={url} alt="" />
          </div>);
      
         default: 
            return(<><h1>Not Previewable Plz Upload something else</h1></>)
        
      }
      
  
  }
}

export default Previewer;
