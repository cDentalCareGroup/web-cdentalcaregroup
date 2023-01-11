import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { logOut } from "../../core/authReducer";
import useSessionStorage from "../../core/sessionStorage";
import Constants from "../../utils/Constants";


const Logout = () => {

    const [session, setSession] = useSessionStorage(Constants.SESSION_AUTH, null);
    const location = useLocation();

    useEffect(() => {
        setSession(null);
        logOut({});
      }, []);

    return (<Navigate to="/" state={{ from: location }} replace />);
}

export default Logout;