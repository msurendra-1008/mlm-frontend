import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const VendorRegistration = () => {
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', address: '' });
    const [vendors, setVendors] = useState([]);
    const [message, setMessage] = useState('');
    const [registerLoading, setRegisterLoading] = useState(false);
    const [approveLoading, setApproveLoading] = useState({});
    const [page, setPage] = useState(1);
    // const [totalPages, setTotalPages] = useState(1);
    const [next, setNext] = useState(null);
    const [prev, setPrev] = useState(null);


    const fetchVendors = useCallback(async () => {
        try {
            const response = await axios.get('https://mlm-backend-pi.vercel.app/api/ecom-product/vendors/', {
                params: { page: page, page_size: 5 }
            });
            setVendors(response.data.results || response.data);
            setNext(response.data.next);
            setPrev(response.data.previous);
        } catch (error) {
            console.error('Error fetching vendors:', error);
            setMessage('Failed to load vendors.');
        }
    }, [page]);


    useEffect(() => {
        fetchVendors();
    }, [fetchVendors]);

    const goNext = () => next && setPage(prev => prev + 1);
    const goPrev = () => prev && page > 1 && setPage(prev => prev - 1);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setRegisterLoading(true);
        try {
            const response = await axios.post('https://mlm-backend-pi.vercel.app/api/ecom-product/vendors/', formData);
            setVendors([...vendors, response.data]);
            setFormData({ name: '', email: '', mobile: '', address: '' });
            setMessage('Vendor registered successfully! Awaiting admin approval.');
        } catch (error) {
            console.error('Error registering vendor:', error);
            setMessage('Failed to register vendor.');
        } finally {
            setRegisterLoading(false);
        }
    };

    const handleApprove = async (id) => {
        setApproveLoading(prev => ({ ...prev, [id]: true }));
        try {
            await axios.post(`https://mlm-backend-pi.vercel.app/api/ecom-product/vendors/${id}/approve/`);
            const updatedVendors = vendors.map(vendor =>
                vendor.id === id ? { ...vendor, is_approved: true } : vendor
            );
            setVendors(updatedVendors);
            setMessage(`Vendor with ID ${id} approved!`);
        } catch (error) {
            console.error('Error approving vendor:', error);
            setMessage('Failed to approve vendor.');
        } finally {
            setApproveLoading(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div>
            <style>
                {`
                body {
                    background-color: #f4f7fa;
                    min-height: 100vh;
                    padding: 20px;
                }
                .container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    gap: 20px;
    align-items: flex-start; /* ✅ Prevents matching height */
}

                h1 {
                    font-size: 2rem;
                    font-weight: bold;
                    color: #1a202c;
                    text-align: center;
                    margin-bottom: 1.5rem;
                }
                .form-container {
                    background-color: #ffffff;
                    padding: 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    width: 35%;
                }
                .vendor-list {
                    background-color: #ffffff;
                    padding: 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    width: 65%;
                }
                .form-group {
                    margin-bottom: 1rem;
                }
                label {
                    display: block;
                    font-size: 0.875rem;
                    color: #4a5568;
                    margin-bottom: 0.25rem;
                }
                input, textarea {
                    width: 100%;
                    padding: 0.5rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    font-size: 0.875rem;
                }
                input:focus, textarea:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
                }
                button {
                    width: 100%;
                    padding: 0.75rem;
                    background-color: #4c51bf;
                    color: #ffffff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.875rem;
                    position: relative;
                }
                .approve-button {
                    padding: 6px 14px;
                    background-color: #4c51bf;
                    color: white;
                    font-size: 0.8rem;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    white-space: nowrap;
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 80px;
                }
                .approve-button:disabled {
                    background-color: #a0aec0;
                    cursor: not-allowed;
                }
                .spinner {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #4c51bf;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    animation: spin 1s linear infinite;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
                @keyframes spin {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(360deg); }
                }
                .approve-button .spinner {
                    width: 16px;
                    height: 16px;
                    border-width: 3px;
                }
                .message {
                    text-align: center;
                    color: #48bb78;
                    margin-top: 1rem;
                }
                .vendor-list h2 {
                    font-size: 1.25rem;
                    font-weight: bold;
                    color: #1a202c;
                    margin-bottom: 1rem;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    padding: 0.75rem;
                    text-align: left;
                    vertical-align: middle;
                    border-bottom: 1px solid #e2e8f0;
                    white-space: nowrap;
                }
                th {
                    background-color: #edf2f7;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    color: #718096;
                }
                th:last-child, td:last-child {
                    text-align: center;
                    width: 1%;
                }
                tr:hover {
                    background-color: #f7fafc;
                }
                .no-vendors {
                    text-align: center;
                    color: #a0aec0;
                    padding: 1rem;
                }
                .pagination {
                    display: flex;
                    justify-content: center;
                    margin-top: 1rem;
                    flex-wrap: wrap;
                }
                .pagination button {
                    padding: 0.5rem 1rem;
                    margin: 0.25rem;
                    background-color: #e2e8f0;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .pagination button:disabled {
                    background-color: #cbd5e0;
                    cursor: not-allowed;
                }
                .pagination button.active {
                    background-color: #4c51bf;
                    color: #ffffff;
                }
                .initial-spinner {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    border: 8px solid #f3f3f3;
                    border-top: 8px solid #4c51bf;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    animation: spin 1s linear infinite;
                    z-index: 1000;
                }
            `}
            </style>

            {vendors.length === 0 && <div className="initial-spinner"></div>}

            <div className="container">
                <div className="form-container">
                    <h1>Vendor Registration</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Mobile</label>
                            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} required />
                        </div>
                        <button type="submit" disabled={registerLoading}>
                            {registerLoading ? <span className="spinner"></span> : 'Register'}
                        </button>
                    </form>
                    {message && <p className="message">{message}</p>}
                </div>

                <div className="vendor-list">
                    <h2 style={{ textAlign: 'center' }}>Vendor List</h2>
                    {vendors.length === 0 ? (
                        <p className="no-vendors">No vendors registered yet.</p>
                    ) : (
                        <>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Mobile</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vendors.map(vendor => (
                                        <tr key={vendor.id}>
                                            <td>{vendor.name}</td>
                                            <td>{vendor.email}</td>
                                            <td>{vendor.mobile}</td>
                                            <td>{vendor.is_approved ? 'Approved' : 'Pending'}</td>
                                            <td>
                                                {!vendor.is_approved && (
                                                    <button
                                                        className="approve-button"
                                                        onClick={() => handleApprove(vendor.id)}
                                                        disabled={approveLoading[vendor.id]}
                                                    >
                                                        {approveLoading[vendor.id] ? <span className="spinner"></span> : 'Approve'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                <button onClick={goPrev} disabled={!prev} style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#4c51bf', color: 'white', border: 'none', borderRadius: '4px', cursor: !prev ? 'not-allowed' : 'pointer' }}>
                                    ◀️ Prev
                                </button>
                                <button onClick={goNext} disabled={!next} style={{ padding: '8px 16px', backgroundColor: '#4c51bf', color: 'white', border: 'none', borderRadius: '4px', cursor: !next ? 'not-allowed' : 'pointer' }}>
                                    Next ▶️
                                </button>
                            </div>

                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorRegistration;
