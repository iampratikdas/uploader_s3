import React, { Component } from "react";
import AWS from "aws-sdk";
import Uppy from "@uppy/core";
import "@uppy/core/dist/style.css";
import Uploader from './Uploader';
import Previewer from './Previewer';
class App extends Component {
  render() {
    return (
      <div>
        <Uploader />
        {/* <Previewer /> */}
      </div>
    );
  }
}

export default App;
