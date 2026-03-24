import { Outlet } from 'react-router-dom';

const LoginLayout = () => {
  return (
      <main className='font-outfit overflow-clip'>
        <Outlet />
      </main>
  );
};

export default LoginLayout;
