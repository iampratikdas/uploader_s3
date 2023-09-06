import React, { Component } from 'react';
import AWS from "aws-sdk";
import Uppy from "@uppy/core";
import "@uppy/core/dist/style.css";
import { Document, Page } from 'react-pdf';

export default class Downloader extends Component {
    constructor(props) {
        super(props);
        // configure AWS SDK
        AWS.config.update({
          region: "us-east-2", 
          accessKeyId: "AKIAVHM4SGP54NEC2S5O", 
          secretAccessKey: "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",
        });
        this.s3 = new AWS.S3();
      }
      async downloadObject(objectKey){
            const s3 = new AWS.S3();
            const bucketName = 'oslm-s3-bucket';
            
            console.log("objectKey",objectKey)
            // Get the object data
            const objectData = await s3.getObject({ Bucket: bucketName, Key: objectKey }).promise();
    
            // Create a blob from the object data
            const blob = new Blob([objectData.Body]);
    
            // Create a temporary URL for the blob
            const url = URL.createObjectURL(blob);
            console.log(url)
    
            // Create a link element and trigger a download
            const link = document.createElement('a');
            link.href = url;
            link.download = objectKey;
            link.click();
    
            // Clean up the URL object
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading object:', error);
        }
      
    
}
