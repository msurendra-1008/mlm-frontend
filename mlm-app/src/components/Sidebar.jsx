import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaBars, FaUser, FaBox, FaHome, FaCog, FaMoneyBill } from 'react-icons/fa';
import './Sidebar.css';

const sidebarItems = [
    {
        title: 'Home',
        path: '/',
        icon: <FaHome />,
    },
    {
        title: 'Users',
        icon: <FaUser />,
        submenu: [
            { title: 'Admins', path: '/users/admins' },
            { title: 'Customers', path: '/users/customers' },
        ],
    },
    {
        title: 'Income Setting',
        icon: <FaMoneyBill />,
        submenu: [
            { title: 'General Income', path: '/income/general' },
            { title: 'Women Income', path: '/income/women' },
        ],
    },
    {
        title: 'Inventory',
        path: '/inventory',
        icon: <FaBox />,
        submenu: [
            { title: 'Vendor', path: '/vendors' },
            { title: 'Tender', path: '/tenders' },
            { title: 'Fill Tender Bid', path: '/fill-tender-bids' },
            { title: 'Review Tender Bid', path: '/review-tender-bids' },
            { title: 'Stock List', path: '/inventory/stock' },
            { title: 'Order List', path: '/inventory/orders' },
            { title: 'Returns', path: '/inventory/returns' },
        ],
    },
    { title: 'Settings', path: '/settings', icon: <FaCog /> },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [openMenus, setOpenMenus] = useState({});
    const location = useLocation();

    const toggleMenu = (title) => {
        setOpenMenus((prev) => {
            const isOpening = !prev[title];
            const newState = {};
            if (isOpening) newState[title] = true;
            return newState;
        });
    };

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <button onClick={() => setCollapsed(!collapsed)} className="collapse-btn">
                    <FaBars />
                </button>
                {!collapsed && <span className="sidebar-title">Business Bazar</span>}
            </div>

            <ul className="sidebar-list">
                {sidebarItems.map((item) => (
                    <li key={item.title}>
                        {item.submenu ? (
                            <>
                                <Link
                                    to={item.path || '#'}
                                    className={`menu-item ${location.pathname === item.path || (item.submenu && item.submenu.some(sub => location.pathname === sub.path))
                                            ? 'active'
                                            : ''
                                        }`}

                                    onClick={() => toggleMenu(item.title)}
                                >
                                    <span className="icon">{item.icon}</span>
                                    {!collapsed && (
                                        <>
                                            <span className="label">{item.title}</span>
                                            <span className="arrow">
                                                {openMenus[item.title] ? <FaChevronUp /> : <FaChevronDown />}
                                            </span>
                                        </>
                                    )}
                                </Link>

                                {!collapsed && openMenus[item.title] && (
                                    <ul className="submenu">
                                        {item.submenu.map((sub) => (
                                            <li key={sub.title}>
                                                <Link
                                                    to={sub.path}
                                                    className={`submenu-item ${location.pathname === sub.path ? 'active-sub' : ''
                                                        }`}
                                                >
                                                    {sub.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        ) : (
                            <Link
                                to={item.path}
                                className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <span className="icon">{item.icon}</span>
                                {!collapsed && <span className="label">{item.title}</span>}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
