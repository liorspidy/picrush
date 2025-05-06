import { Routes, Route } from 'react-router-dom';
import './App.css';
import Main from './pages/main/Main';
import Gallery from './pages/gallery/Gallery';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </>
  );
}

export default App;
