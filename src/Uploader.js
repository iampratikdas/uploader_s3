import React, { Component } from "react";
import AWS from "aws-sdk";
import Uppy from "@uppy/core";
import "@uppy/core/dist/style.css";
import { Document, Page } from 'react-pdf';
import Previewer from './Previewer';
import Downloader from './Downloader';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';


const tableStyle = styled.div`
  background: blue;
  color: red;
`

class Uploader extends Component {
  constructor(props) {
    super(props);
    this.state = {key:null,selectedFile: null,download:false,preview:false ,previewList :false , columns:[
      {
          name: 'File Name',
          width:"30%",
          // allowOverflow: true,
          style:tableStyle,
          selector: row => row.title,
      },
      {
          name: 'Key Id',
          // allowOverflow: true,
          selector: row => row.KeyID,
      },
      {
          name: 'Action',
          selector: row => row.action,
      },
  ]};

    // configure AWS SDK
    AWS.config.update({
      region: process.env.REACT_APP_REGION, 
      accessKeyId: process.env.REACT_APP_ACCESS_KEY, 
      secretAccessKey: process.env.REACT_APP_SECREAT_ACCESS_KEY,
    });

    this.s3 = new AWS.S3();
  }

handleRowClick=(key,dopreview)=>{
    console.log(key,dopreview)
    if(dopreview === true){
      this.setState({ preview: true})
    }else{
      let download = new Downloader()
      download.downloadObject(key)
    }
     this.setState({ key: key});
    
}
handleClick=()=>{
  if(this.state.previewList === false){

      this.s3.listObjects({ Bucket: process.env.REACT_APP_BUCKET }, (err, data) => {
          if (err) {
            console.error('Error listing objects:', err);
          } else {
            console.log("data===>", data);
            this.setState({setObjectList: data.Contents, previewList: true})
          }
        });
  }else{
      this.setState({ previewList: false, key:null})
  }
}
  handleFileUpload = () => {
    const file = this.state.selectedFile;

    if (file) {
      // Set the parameters for the S3 upload
      const modifiedFileName = Date.now() + '_' + file.name;
      localStorage.setItem("objName", modifiedFileName);
      const params = {
        Bucket: process.env.REACT_APP_BUCKET,
        Key: modifiedFileName,
        Body: file,
        ContentType: file.type,
      };

      // Upload the file to S3
      this.s3.upload(params, (err, data) => {
        if (err) {
          console.error("Error uploading file:", err);
          alert(err)
        } else {
          alert(data.Location)
          console.log("File uploaded successfully:", data);
          this.s3.listObjects({ Bucket: process.env.REACT_APP_BUCKET }, (err, data) => {
            if (err) {
              console.error('Error listing objects:', err);
            } else {
              console.log("data===>", data);
              this.setState({setObjectList: data.Contents, previewList: true})
            }
          });
          this.setState({selectedFile: null, previewList:true})
          this.fileInput.value = null
        }
      });
    } else {
      console.error("No file selected");
    }
  };

  handleFileChange = (event) => {
    console.log("file===>", event)
    this.setState({ selectedFile: event.target.files[0] });
  };

  render() {
    
    let data=[];
    if(this.state.previewList && this.state.setObjectList !== undefined){
       
        let setObjectList= this.state.setObjectList
        console.log(setObjectList)
        setObjectList.forEach(items=>{
            let obj ={};
            obj.title=items.Key;
            obj.KeyID=items.Owner.ID;
            obj.action=<div><button onClick={(e)=>this.handleRowClick(items.Key,true)}>Preview</button><button onClick={(e)=>this.handleRowClick(items.Key,false)}>Download</button></div>
            data.push(obj);
        })
        console.log("this.state.setObjectList",this.state.previewList, data)
    }
    return (
      <div>
        <h1>AWS S3 File Uploader</h1>
        <input type="file" onChange={this.handleFileChange}  ref={(input) => (this.fileInput = input)}  />
        <button onClick={this.handleFileUpload}>Upload</button>
        <button onClick={this.handleClick}>Preview List</button>
        {
            (()=>{
                if(this.state.previewList){
                    return(
                        <DataTable
                            columns={this.state.columns}
                            data={data}
                            
                        />
                    )
                }
            })()
        }
         {
            (()=>{
                if(this.state.preview === true && this.state.previewList === true && this.state.key != null){
                  console.log("this.state.download", this.state.key)
                    return(
                        <Previewer
                            keysObject={this.state.key}
                        />
                    )
                }
            })()
        }
        
        
      </div>
    );
  }
}

export default Uploader;
