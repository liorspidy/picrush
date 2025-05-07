import { Routes, Route } from 'react-router-dom';
import './App.css';
import Main from './pages/main/Main';
import Gallery from './pages/gallery/Gallery';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster 
      position="bottom-center" 
      toastOptions={{ 
        duration: 2500, 
        position: 'top-center',
        style: { 
          fontFamily: 'sans-serif', 
          marginTop: '86px',
          direction: 'rtl'
        } 
      }} 
      />
      <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </>
  );
}

export default App;
