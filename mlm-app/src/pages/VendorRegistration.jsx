// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';

// const VendorRegistration = () => {
//     const [formData, setFormData] = useState({ name: '', email: '', mobile: '', address: '' });
//     const [vendors, setVendors] = useState([]);
//     const [message, setMessage] = useState('');
//     const [registerLoading, setRegisterLoading] = useState(false);
//     const [approveLoading, setApproveLoading] = useState({});
//     const [page, setPage] = useState(1);
//     // const [totalPages, setTotalPages] = useState(1);
//     const [next, setNext] = useState(null);
//     const [prev, setPrev] = useState(null);


//     const fetchVendors = useCallback(async () => {
//         try {
//             const response = await axios.get('https://mlm-backend-pi.vercel.app/api/ecom-product/vendors/', {
//                 params: { page: page, page_size: 5 }
//             });
//             setVendors(response.data.results || response.data);
//             setNext(response.data.next);
//             setPrev(response.data.previous);
//         } catch (error) {
//             console.error('Error fetching vendors:', error);
//             setMessage('Failed to load vendors.');
//         }
//     }, [page]);


//     useEffect(() => {
//         fetchVendors();
//     }, [fetchVendors]);

//     const goNext = () => next && setPage(prev => prev + 1);
//     const goPrev = () => prev && page > 1 && setPage(prev => prev - 1);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setRegisterLoading(true);
//         try {
//             const response = await axios.post('https://mlm-backend-pi.vercel.app/api/ecom-product/vendors/', formData);
//             setVendors([...vendors, response.data]);
//             setFormData({ name: '', email: '', mobile: '', address: '' });
//             setMessage('Vendor registered successfully! Awaiting admin approval.');
//         } catch (error) {
//             console.error('Error registering vendor:', error);
//             setMessage('Failed to register vendor.');
//         } finally {
//             setRegisterLoading(false);
//         }
//     };

//     const handleApprove = async (id) => {
//         setApproveLoading(prev => ({ ...prev, [id]: true }));
//         try {
//             await axios.post(`https://mlm-backend-pi.vercel.app/api/ecom-product/vendors/${id}/approve/`);
//             const updatedVendors = vendors.map(vendor =>
//                 vendor.id === id ? { ...vendor, is_approved: true } : vendor
//             );
//             setVendors(updatedVendors);
//             setMessage(`Vendor with ID ${id} approved!`);
//         } catch (error) {
//             console.error('Error approving vendor:', error);
//             setMessage('Failed to approve vendor.');
//         } finally {
//             setApproveLoading(prev => ({ ...prev, [id]: false }));
//         }
//     };

//     return (
//         <div>
//             <style>
//                 {`
//                 body {
//                     background-color: #f4f7fa;
//                     min-height: 100vh;
//                    margin: 0;           /* ✅ Removes browser default margins */
//                     padding: 0; 
//                 }
//                 .container {
//                     max-width: 1200px;
//                     margin: 0 auto;
//                     display: flex;
//                     gap: 20px;
//                     align-items: flex-start; /* ✅ Prevents matching height */
//                 }

//                 h1 {
//                     font-size: 2rem;
//                     font-weight: bold;
//                     color: #1a202c;
//                     text-align: center;
//                     margin-bottom: 1.5rem;
//                 }
//                 .form-container {
//                     background-color: #ffffff;
//                     padding: 1.5rem;
//                     border-radius: 8px;
//                     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//                     width: 35%;
//                 }
//                 .vendor-list {
//                     background-color: #ffffff;
//                     padding: 1.5rem;
//                     border-radius: 8px;
//                     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//                     width: 65%;
//                 }
//                 .form-group {
//                     margin-bottom: 1rem;
//                 }
//                 label {
//                     display: block;
//                     font-size: 0.875rem;
//                     color: #4a5568;
//                     margin-bottom: 0.25rem;
//                 }
//                 input, textarea {
//                     width: 100%;
//                     padding: 0.5rem;
//                     border: 1px solid #e2e8f0;
//                     border-radius: 4px;
//                     font-size: 0.875rem;
//                 }
//                 input:focus, textarea:focus {
//                     outline: none;
//                     border-color: #667eea;
//                     box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
//                 }
//                 button {
//                     width: 100%;
//                     padding: 0.75rem;
//                     background-color: #4c51bf;
//                     color: #ffffff;
//                     border: none;
//                     border-radius: 4px;
//                     cursor: pointer;
//                     font-size: 0.875rem;
//                     position: relative;
//                 }
//                 .approve-button {
//                     padding: 6px 14px;
//                     background-color: #4c51bf;
//                     color: white;
//                     font-size: 0.8rem;
//                     border: none;
//                     border-radius: 4px;
//                     cursor: pointer;
//                     white-space: nowrap;
//                     position: relative;
//                     display: inline-flex;
//                     align-items: center;
//                     justify-content: center;
//                     min-width: 80px;
//                 }
//                 .approve-button:disabled {
//                     background-color: #a0aec0;
//                     cursor: not-allowed;
//                 }
//                 .spinner {
//                     border: 4px solid #f3f3f3;
//                     border-top: 4px solid #4c51bf;
//                     border-radius: 50%;
//                     width: 20px;
//                     height: 20px;
//                     animation: spin 1s linear infinite;
//                     position: absolute;
//                     top: 50%;
//                     left: 50%;
//                     transform: translate(-50%, -50%);
//                 }
//                 @keyframes spin {
//                     0% { transform: translate(-50%, -50%) rotate(0deg); }
//                     100% { transform: translate(-50%, -50%) rotate(360deg); }
//                 }
//                 .approve-button .spinner {
//                     width: 16px;
//                     height: 16px;
//                     border-width: 3px;
//                 }
//                 .message {
//                     text-align: center;
//                     color: #48bb78;
//                     margin-top: 1rem;
//                 }
//                 .vendor-list h2 {
//                     font-size: 1.25rem;
//                     font-weight: bold;
//                     color: #1a202c;
//                     margin-bottom: 1rem;
//                 }
//                 table {
//                     width: 100%;
//                     border-collapse: collapse;
//                 }
//                 th, td {
//                     padding: 0.75rem;
//                     text-align: left;
//                     vertical-align: middle;
//                     border-bottom: 1px solid #e2e8f0;
//                     white-space: nowrap;
//                 }
//                 th {
//                     background-color: #edf2f7;
//                     font-size: 0.75rem;
//                     text-transform: uppercase;
//                     color: #718096;
//                 }
//                 th:last-child, td:last-child {
//                     text-align: center;
//                     width: 1%;
//                 }
//                 tr:hover {
//                     background-color: #f7fafc;
//                 }
//                 .no-vendors {
//                     text-align: center;
//                     color: #a0aec0;
//                     padding: 1rem;
//                 }
//                 .pagination {
//                     display: flex;
//                     justify-content: center;
//                     margin-top: 1rem;
//                     flex-wrap: wrap;
//                 }
//                 .pagination button {
//                     padding: 0.5rem 1rem;
//                     margin: 0.25rem;
//                     background-color: #e2e8f0;
//                     border: none;
//                     border-radius: 4px;
//                     cursor: pointer;
//                 }
//                 .pagination button:disabled {
//                     background-color: #cbd5e0;
//                     cursor: not-allowed;
//                 }
//                 .pagination button.active {
//                     background-color: #4c51bf;
//                     color: #ffffff;
//                 }
//                 .initial-spinner {
//                     position: fixed;
//                     top: 50%;
//                     left: 50%;
//                     transform: translate(-50%, -50%);
//                     border: 8px solid #f3f3f3;
//                     border-top: 8px solid #4c51bf;
//                     border-radius: 50%;
//                     width: 60px;
//                     height: 60px;
//                     animation: spin 1s linear infinite;
//                     z-index: 1000;
//                 }
//             `}
//             </style>

//             {vendors.length === 0 && <div className="initial-spinner"></div>}

//             <div className="container">
//                 <div className="form-container">
//                     <h1>Vendor Registration</h1>
//                     <form onSubmit={handleSubmit}>
//                         <div className="form-group">
//                             <label>Name</label>
//                             <input type="text" name="name" value={formData.name} onChange={handleChange} required />
//                         </div>
//                         <div className="form-group">
//                             <label>Email</label>
//                             <input type="email" name="email" value={formData.email} onChange={handleChange} required />
//                         </div>
//                         <div className="form-group">
//                             <label>Mobile</label>
//                             <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />
//                         </div>
//                         <div className="form-group">
//                             <label>Address</label>
//                             <textarea name="address" value={formData.address} onChange={handleChange} required />
//                         </div>
//                         <button type="submit" disabled={registerLoading}>
//                             {registerLoading ? <span className="spinner"></span> : 'Register'}
//                         </button>
//                     </form>
//                     {message && <p className="message">{message}</p>}
//                 </div>

//                 <div className="vendor-list">
//                     <h2 style={{ textAlign: 'center' }}>Vendor List</h2>
//                     {vendors.length === 0 ? (
//                         <p className="no-vendors">No vendors registered yet.</p>
//                     ) : (
//                         <>
//                             <table>
//                                 <thead>
//                                     <tr>
//                                         <th>Name</th>
//                                         <th>Email</th>
//                                         <th>Mobile</th>
//                                         <th>Status</th>
//                                         <th>Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {vendors.map(vendor => (
//                                         <tr key={vendor.id}>
//                                             <td>{vendor.name}</td>
//                                             <td>{vendor.email}</td>
//                                             <td>{vendor.mobile}</td>
//                                             <td>{vendor.is_approved ? 'Approved' : 'Pending'}</td>
//                                             <td>
//                                                 {!vendor.is_approved && (
//                                                     <button
//                                                         className="approve-button"
//                                                         onClick={() => handleApprove(vendor.id)}
//                                                         disabled={approveLoading[vendor.id]}
//                                                     >
//                                                         {approveLoading[vendor.id] ? <span className="spinner"></span> : 'Approve'}
//                                                     </button>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                             <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
//                                 <button onClick={goPrev} disabled={!prev} style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#4c51bf', color: 'white', border: 'none', borderRadius: '4px', cursor: !prev ? 'not-allowed' : 'pointer' }}>
//                                     ◀️ Prev
//                                 </button>
//                                 <button onClick={goNext} disabled={!next} style={{ padding: '8px 16px', backgroundColor: '#4c51bf', color: 'white', border: 'none', borderRadius: '4px', cursor: !next ? 'not-allowed' : 'pointer' }}>
//                                     Next ▶️
//                                 </button>
//                             </div>

//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default VendorRegistration;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const VendorRegistration = () => {
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', address: '', product: '' });
    const [vendors, setVendors] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [approveLoading, setApproveLoading] = useState({});
    const [deleteLoading, setDeleteLoading] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [page, setPage] = useState(1);
    const [next, setNext] = useState(null);
    const [prev, setPrev] = useState(null);

    const fetchVendors = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://mlm-backend-pi.vercel.app/api/ecom-product/vendors/', {
                params: { page: page, page_size: 5 }
            });
            setVendors(response.data.results || response.data);
            setNext(response.data.next);
            setPrev(response.data.previous);
        } catch (error) {
            console.error('Error fetching vendors:', error);
            setMessage('Failed to load vendors.');
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchVendors();
    }, [fetchVendors]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editId) {
                await axios.put(`https://mlm-backend-pi.vercel.app/api/ecom-product/vendors/${editId}/`, formData);
                setVendors(vendors.map(v => v.id === editId ? { ...v, ...formData } : v));
                setMessage('Vendor updated successfully!');
            } else {
                const response = await axios.post('https://mlm-backend-pi.vercel.app/api/ecom-product/vendors/', formData);
                setVendors([...vendors, response.data]);
                setMessage('Vendor registered successfully! Awaiting admin approval.');
            }
            setFormData({ name: '', email: '', mobile: '', address: '', product: '' });
            setEditId(null);
            setShowForm(false);
        } catch (error) {
            console.error('Error saving vendor:', error);
            setMessage('Failed to save vendor.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (vendor) => {
        setFormData(vendor);
        setEditId(vendor.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        setDeleteLoading(prev => ({ ...prev, [id]: true }));
        try {
            await axios.delete(`https://mlm-backend-pi.vercel.app/api/ecom-product/vendors/${id}/`);
            setVendors(vendors.filter(v => v.id !== id));
            setMessage('Vendor deleted successfully.');
        } catch (error) {
            console.error('Error deleting vendor:', error);
            setMessage('Failed to delete vendor.');
        } finally {
            setDeleteLoading(prev => ({ ...prev, [id]: false }));
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
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
            <style>{`
                .spinner, .initial-spinner {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #4c51bf;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    animation: spin 1s linear infinite;
                    display: inline-block;
                }
                .initial-spinner {
                    width: 60px;
                    height: 60px;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 1000;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    margin-bottom: 20px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                    border-radius: 8px;
                    overflow: hidden;
                }
                th, td {
                    padding: 14px 18px;
                    border-bottom: 1px solid #eee;
                    text-align: left;
                }
                th {
                    background-color: #a0522d;
                    color: white;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                }
                tr:hover {
                    // transform: scale(1.01);
                    background-color: #fcfcfc;
                }
                button {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .approve-button { background-color: #4c51bf; color: white; }
                .edit-button { background-color: #ffb84d; color: #333; }
                .delete-button { background-color: #e74c3c; color: white; }
                .modal {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background-color: rgba(0, 0, 0, 0.4);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white; padding: 30px; border-radius: 10px; width: 90%; max-width: 500px; position: relative;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                }
                .modal-content h2 { margin-top: 0; text-align: center; }
                .modal-content input, .modal-content textarea {
                    width: 100%; padding: 10px; margin-bottom: 14px; border: 1px solid #ccc; border-radius: 6px;
                }
                .modal-content button[type="submit"] {
                    width: 100%; background-color: #4c51bf; color: white;
                }
                .close-button {
                    position: absolute; top: 10px; right: 10px; border: none; background: transparent; font-size: 18px;
                }
            `}</style>

            <h1 style={{ textAlign: 'center' }}>Vendor Management</h1>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <button onClick={() => { setShowForm(true); setEditId(null); setFormData({ name: '', email: '', mobile: '', address: '' }); }} style={{ padding: '10px 20px', background: '#4c51bf', color: 'white' }}>
                    Register Vendor
                </button>
            </div>

            {message && <p style={{ textAlign: 'center', color: 'green' }}>{message}</p>}

            {loading && vendors.length === 0 ? (
                <div className="initial-spinner"></div>
            ) : (
                <table>
                    ...
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Address</th>
                            <th>Product</th>
                            <th>Status</th>
                            <th colSpan={3}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map(vendor => (
                            <tr key={vendor.id}>
                                <td>{vendor.name}</td>
                                <td>{vendor.email}</td>
                                <td>{vendor.mobile}</td>
                                <td>{vendor.address}</td>
                                <td>
                                    {vendor.product
                                        ? vendor.product.split(',').map((p, i) => (
                                            <span key={i} style={{
                                                backgroundColor: '#f3e5f5',
                                                color: '#6a1b9a',
                                                padding: '4px 8px',
                                                margin: '2px',
                                                borderRadius: '8px',
                                                display: 'inline-block',
                                                fontSize: '0.75rem'
                                            }}>
                                                {p.trim()}
                                            </span>
                                        ))
                                        : ''}
                                </td>

                                <td>{vendor.is_approved ? 'Approved' : 'Pending'}</td>
                                <td><button className="edit-button" onClick={() => handleEdit(vendor)}>Edit</button></td>
                                <td>
                                    <button className="delete-button" onClick={() => handleDelete(vendor.id)} disabled={deleteLoading[vendor.id]}>
                                        {deleteLoading[vendor.id] ? <span className="spinner" /> : 'Delete'}
                                    </button>
                                </td>
                                <td>
                                    {!vendor.is_approved && (
                                        <button
                                            className="approve-button"
                                            onClick={() => handleApprove(vendor.id)}
                                            disabled={approveLoading[vendor.id]}
                                        >
                                            {approveLoading[vendor.id] ? <span className="spinner" /> : 'Approve'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    ...

                </table>
            )}

            <div className="pagination" style={{ textAlign: 'center', marginTop: '20px' }}>
                <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={!prev}>Prev</button>
                <button onClick={() => setPage(prev => prev + 1)} disabled={!next}>Next</button>
            </div>

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-button" onClick={() => setShowForm(false)}>✖</button>
                        <h2>{editId ? 'Edit Vendor' : 'Register Vendor'}</h2>
                        <form onSubmit={handleSubmit}>
                            <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                            <input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile" required />
                            <input name="product" value={formData.product} onChange={handleChange} placeholder="Product (comma-separated)" />
                            <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
                            <button type="submit" disabled={loading}>
                                {loading ? <span className="spinner" /> : editId ? 'Update Vendor' : 'Register'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorRegistration;


