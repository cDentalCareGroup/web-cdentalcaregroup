import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import useSessionStorage from "../../core/sessionStorage";
import Constants from "../../utils/Constants";
import User from "../../data/user/user";
import { logOut, setCredentials } from "../../core/authReducer";

const RequireAuth = () => {
  const [session, setSession] = useSessionStorage(Constants.SESSION_AUTH, null);
  const location = useLocation();
  const dispatch = useDispatch();
    
  useEffect(() => {
      if (session != null && session != "null") {
         const storedUser = session as User
         dispatch(setCredentials({...storedUser}));
      } else {
        setSession(null);
        logOut({});
      }
    }, []);


  return session ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default RequireAuth;