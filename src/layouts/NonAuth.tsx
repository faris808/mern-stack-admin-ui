import { Outlet } from "react-router-dom";

const NonAuth = () => {
  return (
    <div>
      <h1>NonAuth component</h1>
      <Outlet />
    </div>
  );
};

export default NonAuth;
