import { useState } from "react";

import zsLogo from "/zs.svg";
import "./App.css";

import UploadImage from "./components/UploadImage";
import ImageDisplay from "./components/ImageDisplay";
import ImageGrid from "./components/ImageGrid";

// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

import { RecordIdContext } from "./context/RecordIdContext";

export default function App() {
  const [recordId, setRecordId] = useState("840958894677311");


  return (
    <MantineProvider>
      <RecordIdContext.Provider value={{ recordId, setRecordId }}>
        <div className='test01' style={{ width: '100%' }}>
          <div>
            <a href="#">
              <img src={zsLogo} className="logo" alt="Zero Synth logo" />
            </a>
          </div>
          <h1>Image Tagging App</h1>
          <div>
            <h2>Eduardo García</h2>
            <UploadImage />
            <ImageDisplay recordId={recordId} />
            <ImageGrid />
          </div>
          <p className="thanks-text">
            Thanks for your time!
          </p>
        </div>
        </RecordIdContext.Provider>
    </MantineProvider>
  );
}
