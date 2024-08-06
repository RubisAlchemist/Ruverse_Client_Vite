import {
  AgoraRecordPage,
  AiConsultChannelPage,
  AiConsultEntryPage,
  LandingPage,
  PermissionsPage,
  RealTimeConsultChannelPage,
  RealTimeConsultEntryPage,
} from "@pages/index.js";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./app.css";
import { EyetrackingLogger } from "@components/logger";

function App() {
  return (
    <EyetrackingLogger>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/permissions" element={<PermissionsPage />} />
          {/* Agora Ruverse */}
          <Route path="/consultEntry" element={<RealTimeConsultEntryPage />} />
          <Route
            path="/consult/:cname/:uid"
            element={<RealTimeConsultChannelPage />}
          />
          <Route
            path="/consult/:cname/:uid/record"
            element={<AgoraRecordPage />}
          />

          {/* AI Ruverse */}
          <Route path="/ai-consultEntry" element={<AiConsultEntryPage />} />
          <Route path="/ai-consult/:uname" element={<AiConsultChannelPage />} />
        </Routes>
      </BrowserRouter>
    </EyetrackingLogger>
  );
}

export default App;
