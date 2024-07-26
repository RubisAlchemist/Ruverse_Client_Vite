import {
  AiConsultChannelPage,
  AiConsultEntryPage,
  LandingPage,
  PermissionsPage,
  RealTimeConsultChannelPage,
  RealTimeConsultEntryPage,
} from "@pages/index.js";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./app.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/permissions" element={<PermissionsPage />} />
        <Route path="/consultEntry" element={<RealTimeConsultEntryPage />} />
        <Route path="/consult/" element={<RealTimeConsultChannelPage />} />
        <Route path="/ai-consultEntry" element={<AiConsultEntryPage />} />
        <Route path="/ai-consult/:uname" element={<AiConsultChannelPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
