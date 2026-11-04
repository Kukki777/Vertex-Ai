

import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData } from './redux/userSlice';
import { me } from './features/me';
import ProjectPage from './pages/ProjectPage';



function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await me();
        dispatch(setUserData(data));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
         <Route path="/project/:id" element={<ProjectPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App