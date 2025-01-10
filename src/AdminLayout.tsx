import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import Sidebar from './components/Sidebar/Sidebar';
import { useSelector } from 'react-redux';
import { RootState } from './store';



const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const isAdmin = useSelector((state: RootState) => state.auth.isLoggedIn);
console.log(isAdmin,'isAdmin')
  // Mock admin authentication check
//   const isAdmin = true; // Replace with actual admin auth logic

useEffect(() => {
    if (!isAdmin) {
      navigate('/login'); // Redirect to login page if not authenticated
    }
  }, [isAdmin, navigate]);

  return (
    <div className='flex h-full'>
      <div className="">

      <Sidebar/>
      </div>
    
      <main className='flex-1 p-4' >
        <Outlet/>
      </main>
    
    </div>
  );
};

export default AdminLayout;
