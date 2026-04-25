import { useState } from 'react';
import ConfigScreen from './components/ConfigScreen';
import ChatScreen from './components/ChatScreen';
import ReportScreen from './components/ReportScreen';

function App() {
  const [config, setConfig] = useState(null);
  const [reportMessages, setReportMessages] = useState(null);

  const startInterview = (interviewConfig) => {
    setConfig(interviewConfig);
  };

  const finishInterview = (messages) => {
    setReportMessages(messages);
  };

  const resetAll = () => {
    setConfig(null);
    setReportMessages(null);
  };

  if (!config) {
    return <ConfigScreen onStart={startInterview} />;
  }

  if (reportMessages) {
    return <ReportScreen config={config} messages={reportMessages} onRestart={resetAll} />;
  }

  return (
    <ChatScreen config={config} onFinish={finishInterview} />
  );
}

export default App;
