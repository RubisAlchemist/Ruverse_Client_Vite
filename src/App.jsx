import {
  AiConsultChannelPage,
  AiConsultEntryPage,
  LandingPage,
  PermissionsPage,
  RealTimeConsultChannelPage,
  RealTimeConsultEntryPage,
  KlleonAvatar,
  HomePage,
  AvatarChoosePage,
  SeamlessVideoStreamer,
  SeamlessVideoPlayer,
  AiConsultEntryPageRe,
} from "@pages/index.js";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./app.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route path="/test" element={<SeamlessVideoPlayer />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/permissions" element={<PermissionsPage />} />
        <Route path="/consultEntry" element={<RealTimeConsultEntryPage />} />
        <Route path="/consult/" element={<RealTimeConsultChannelPage />} />
        <Route path="/ai-consultEntry" element={<AiConsultEntryPage />} />
        <Route path="/ai-consult/:uname" element={<AiConsultChannelPage />} />
        <Route path="/klleonAvatar" element={<KlleonAvatar />} />
        <Route path="/AvatarChoosePage" element={<AvatarChoosePage />} />
        <Route path="/ai-consultEntryRe" element={<AiConsultEntryPageRe />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
