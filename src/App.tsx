import { Routes, Route } from 'react-router-dom';
import './App.css';
import Main from './pages/main/Main';
import Gallery from './pages/gallery/Gallery';
import { Toaster, type DefaultToastOptions } from 'react-hot-toast';
import { useEffect, useMemo } from 'react';
import { useFirebaseContext } from './hooks/useFirebase';

function App() {
  const { setUserId, setVal} = useFirebaseContext();

  useEffect(() => {
    // setting up userId
    const lsId = localStorage.getItem('id');
    const randId = Math.floor((Math.random()* 999999999999)).toString();
    const id = lsId ? lsId : randId;
    setUserId(id);
    if(!lsId) {
      localStorage.setItem('id', id);
    }

    // setting up uploads left
    const lsval = localStorage.getItem('val');
    const val = lsval ? +lsval : 0;
    setVal(val);
    if(!lsval){
      localStorage.setItem('val', '0');
    }
  },[])

  const toastOptions: DefaultToastOptions = useMemo(() => ({
    duration: 2500,
    position: 'top-center',
    style: {
      fontFamily: 'sans-serif',
      position: 'relative' as React.CSSProperties['position'],
      top: '150px'
    }
  }), []);

  return (
    <>
      <Toaster 
      position="bottom-center" 
      toastOptions={toastOptions} 
      />
      <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </>
  );
}

export default App;
