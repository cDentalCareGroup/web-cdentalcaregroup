import { Button, Form, Input, Layout } from "antd"
import { RiUser3Line, RiLockLine } from "react-icons/ri";
import Strings from "../../utils/Strings";
import { LoginRequest } from "../../data/user/user.request";
import { useLoginMutation } from "../../services/authService";
import { handleErrorNotification } from "../../utils/Notifications";
import useSessionStorage from "../../core/sessionStorage";
import Constants from "../../utils/Constants";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInitRoute, getUserRol, UserRoles } from '../../utils/Extensions';
import User from "../../data/user/user";
import { useAppDispatch } from "../../core/store";
import { setCredentials } from "../../core/authReducer";
import { detect } from 'detect-browser';
import { initFirebaseRemoteConfig } from "../../services/firebase";

const Login = () => {
    const [login, { isLoading }] = useLoginMutation();
    const navigate = useNavigate();
    const [session, setSession] = useSessionStorage(
        Constants.SESSION_AUTH,
        null
    );
    const [branchId, setBranchId] = useSessionStorage(
        Constants.BRANCH_ID,
        0
    );
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (session != null) {
            const data = session as User;
            dispatch(setCredentials({ ...data }));
            navigate(getInitRoute(data));
        }
        initFirebaseRemoteConfig()
    }, []);


    const handleGetLoginInfo = async () => {
        try {
            const browser = detect();

            const response = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=bf92e52952144618a1f20a33d9682430')
                .then((data) => data.json())
                .catch((e) => console.log(`Error `, e));
            return {
                login: response,
                browser: browser
            };
        } catch (error) {
            const browser = detect();
            return {
                login: error,
                browser: browser
            }
        }
    }

    const onFinish = async (values: any) => {
        try {
            const loginInfo = await handleGetLoginInfo()
            const data = await login(new LoginRequest(values.username, values.password, loginInfo)).unwrap();

            const role = getUserRol(data);
            if (role == UserRoles.RECEPTIONIST) {
                setBranchId(data.branchId);
            }
            setSession(data);
            dispatch(setCredentials({ ...data }));
            navigate(getInitRoute(data));
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                {/* Login containter */}
                <div className="bg-white flex rounded-2xl shadow-lg max-w-3xl p-5">
                    {/* Form */}
                    <div className="sm:w-1/2 px-8 flex flex-col">
                        <div className="text-left font-bold">
                            <span className="text-action text-secondary">{Strings.cDentalCare}</span> {Strings.group}
                        </div>
                        <div className="flex flex-col items-center justify-center text-center mb-12 mt-4">
                            <h2 className="text-2xl font-bold text-secondary mb-2 w-full mt-4">
                                {Strings.login}
                            </h2>
                            <div className="border-2 w-10 border-blue-800 inline-block mb-4"></div>
                        </div>

                        <Form className="flex flex-col gap-4" onFinish={onFinish}>
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: Strings.requiredUsername }]}
                            >
                                <Input size="large" prefix={<RiUser3Line className="site-form-item-icon text-gray-600" />} placeholder={Strings.username} />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: Strings.requiredPassword }]}
                            >
                                <Input.Password
                                    size="large"
                                    prefix={<RiLockLine className="site-form-item-icon text-gray-600" />}
                                    type="password"
                                    placeholder={Strings.password}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button loading={isLoading} ghost={false} size="large" block type="default" htmlType="submit" >
                                    {Strings.login}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>


                    {/* Image */}
                    <div className="sm:block hidden w-1/2">
                        <img
                            className="rounded-2xl object-cover w-full h-full"
                            alt="login"
                            src="https://firebasestorage.googleapis.com/v0/b/cdentalcaregroup-fcdc9.appspot.com/o/Logos%2Fmain.jpeg?alt=media&token=95b1855f-6a04-402d-a555-dba983467112"
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Login;