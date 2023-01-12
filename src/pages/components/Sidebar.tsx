import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { adminRoutesToMenuOptions, Route } from "../routes/Routes";

export type MenuItem = Required<MenuProps>['items'][number];

export function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}


interface SidebarProps {
    items: MenuItem[];
    collapsed: boolean;
}
const Sidebar = ({ items, collapsed }: SidebarProps) => {

    const navigate = useNavigate();
    const location = useLocation();
    const [selectedPath, setSelectedPath] = useState('');

    useEffect(() => {
        setSelectedPath(location.pathname);
    }, [location]);

    const handleOnClick = (data: any) => {
        navigate(data.key);
    }

    return (
        <Sider breakpoint="lg"  trigger={null} collapsible collapsed={collapsed}>
            <div className="flex w-full items-center justify-center flex-col mb-6 mt-4 flex-wrap" >
                <img
                    className={`object-cover ${collapsed ? ' w-8' : ' w-20'} transition-all`}
                    alt="login"
                    src='https://firebasestorage.googleapis.com/v0/b/cdentalcaregroup-fcdc9.appspot.com/o/Logos%2Fmain_logo.png?alt=media&token=d70a9685-7b64-4491-aea1-5b59dbda3ac8' />
                {!collapsed && <span className='text-white text-sm mt-2 transition-all'>CDental Care Group</span>}
            </div>
            <Menu
                theme="dark"
                mode="inline"
                onClick={handleOnClick}
                selectedKeys={[selectedPath]}
                items={items}
            />
        </Sider>
    );
}

export default Sidebar;