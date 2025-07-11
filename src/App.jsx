import React from 'react';
import './index.css';
import Sidebar from './components/sidebar/Sidebar.jsx';
import Main from './components/Main/Main.jsx';
import StudyMode from './components/StudyMode/StudyMode.jsx';

const App = () => {
  return (
    <>
      <Sidebar />
      <Main />
      <StudyMode />
    </>
  );
};

export default App;
