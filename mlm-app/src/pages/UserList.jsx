import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get('https://mlm-backend-pi.vercel.app/api/users-with-legs/')
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : res.data.results || [];
                setUsers(data);
            })
            .catch(err => {
                console.error("Error loading users:", err);
                setUsers([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const cardStyle = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '10px',
        width: '400px',
        margin: '10px auto',
        textAlign: 'left',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        position: 'relative',
    };

    const legContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px',
        flexWrap: 'wrap',
        gap: '10px',
    };

    const legCardStyle = {
        backgroundColor: '#f9f9f9',
        padding: '10px',
        borderRadius: '6px',
        width: '100px',
        textAlign: 'center',
        flex: '1 1 100px',
    };

    const spinnerStyle = {
        textAlign: 'center',
        fontSize: '24px',
        marginTop: '20px',
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', marginTop: '40px' }}>
            <h2 style={{ textAlign: 'center' }}>👥 User Tree View</h2>
            {loading ? (
                <div style={spinnerStyle}>⏳ Loading...</div>
            ) : Array.isArray(users) && users.length > 0 ? (
                users.map(user => (
                    <div key={user.id} style={cardStyle} onClick={() => toggleExpand(user.id)}>
                        <strong>{user.name || 'Unnamed User'}</strong> <br />
                        📱 {user.mobile || 'N/A'} <br />
                        🆔 UID: {user.uid_no || 'N/A'}
                        {expanded[user.id] && (
                            <div style={legContainerStyle}>
                                <div style={legCardStyle}>
                                    <strong>Left</strong><br />
                                    {user.left_leg ? `${user.left_leg.name} (${user.left_leg.mobile})` : 'None'}
                                </div>
                                <div style={legCardStyle}>
                                    <strong>Middle</strong><br />
                                    {user.middle_leg ? `${user.middle_leg.name} (${user.middle_leg.mobile})` : 'None'}
                                </div>
                                <div style={legCardStyle}>
                                    <strong>Right</strong><br />
                                    {user.right_leg ? `${user.right_leg.name} (${user.right_leg.mobile})` : 'None'}
                                </div>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p style={{ textAlign: 'center' }}>No users found.</p>
            )}
        </div>
    );
}