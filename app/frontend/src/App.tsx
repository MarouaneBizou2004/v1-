import { Route, Routes } from 'react-router-dom';

import { ChatPage } from './features/chat/ChatPage';
import { ReportWizard } from './features/report/ReportWizard';
import { Layout } from './components/Layout';

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<ChatPage />} />
      <Route path="/report" element={<ReportWizard />} />
    </Routes>
  </Layout>
);

export default App;
