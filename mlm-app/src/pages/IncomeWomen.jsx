import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function WomenIncomeSetting() {
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [entries, setEntries] = useState([]);
    const [formData, setFormData] = useState({ category: '', income: '' });
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [page, setPage] = useState(1);
    const [next, setNext] = useState(null);
    const [prev, setPrev] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [count, setCount] = useState(0); // total count for pagination

    const apiBase = 'https://mlm-backend-pi.vercel.app/api/women-income/';

    const thStyle = { padding: '12px 15px', textAlign: 'left', fontWeight: 'bold' };
    const tdStyle = { padding: '12px 15px', textAlign: 'left' };
    const editBtn = { padding: '5px 10px', marginRight: '8px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' };
    const deleteBtn = { padding: '5px 10px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' };
    const inputStyle = { width: '100%', padding: '8px 10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '14px' };
    const modalBtn = { padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' };

    useEffect(() => {
        setLoading(true);
        axios.get(`${apiBase}?page=${page}`)
            .then(res => {
                setEntries(res.data.results || []);
                setNext(res.data.next);
                setPrev(res.data.previous);
                setCount(res.data.count || 0);
            })
            .catch(err => console.error("Error fetching data", err))
            .finally(() => setLoading(false));
    }, [page]);

    const goNext = () => next && setPage(prev => prev + 1);
    const goPrev = () => prev && page > 1 && setPage(prev => prev - 1);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCreate = () => {
        const errors = {};
        if (!formData.category) errors.category = 'Category is required.';
        if (!formData.income) errors.income = 'Income is required.';
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setSubmitLoading(true);
        const data = { category: formData.category, income: formData.income };

        const request = isEditMode
            ? axios.put(`${apiBase}${editId}/`, data)
            : axios.post(apiBase, data);

        request
            .then(res => {
                if (isEditMode) {
                    setEntries(prev => prev.map(entry => entry.id === editId ? res.data : entry));
                } else {
                    setEntries(prev => [...prev, res.data]);
                }
                resetModal();
            })
            .catch(err => console.error("Error saving", err))
            .finally(() => setSubmitLoading(false));
    };

    const handleDelete = (id) => {
        setDeleting(true);
        axios.delete(`${apiBase}${id}/`)
            .then(() => setEntries(prev => prev.filter(entry => entry.id !== id)))
            .catch(err => console.error("Error deleting", err))
            .finally(() => setDeleting(false));
    };

    const openEditModal = (entry) => {
        setFormData({
            category: entry.category,
            income: entry.income,
            previous_income_for_women_old: entry.previous_income_for_women_old ?? entry.income,
        });
        setEditId(entry.id);
        setIsEditMode(true);
        setShowModal(true);
    };

    const resetModal = () => {
        setFormData({ category: '', income: '' });
        setEditId(null);
        setIsEditMode(false);
        setShowModal(false);
    };

    if (loading) return <div style={{ textAlign: 'center', paddingTop: '50px' }}>⏳ Loading data...</div>;

    // Pagination logic
    const PAGE_SIZE = 10;
    const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div style={{ maxWidth: '900px', margin: '50px auto', textAlign: 'center' }}>
            <h2>👩‍🦳 Women Income Settings</h2>
            <p>This is the income setting for the Child Below 18, Mature Female & Senior Citizen</p>
            <button onClick={() => setShowModal(true)} style={{ marginBottom: '20px', padding: '10px 15px', fontSize: '16px', cursor: 'pointer' }}>
                ➕ Create Income For Women & Old
            </button>

            <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                <thead style={{ backgroundColor: '#8e7e7e', color: '#fff' }}>
                    <tr>
                        <th style={thStyle}>S.No</th>
                        <th style={thStyle}>Category</th>
                        <th style={thStyle}>Previous Income</th>
                        <th style={thStyle}>Current Income</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, index) => (
                        <tr key={entry.id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff', borderBottom: '1px solid #ddd' }}>
                            <td style={tdStyle}>{index + 1}</td>
                            <td style={tdStyle}>{entry.category}</td>
                            <td style={tdStyle}>₹{entry.previous_income_for_women_old ?? entry.income}</td>
                            <td style={tdStyle}>₹{entry.income}</td>
                            <td style={tdStyle}>
                                <button style={editBtn} onClick={() => openEditModal(entry)}>Edit</button>
                                <button style={deleteBtn} onClick={() => handleDelete(entry.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{
                marginTop: '0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#fff',
                color: '#333',
                borderRadius: '0 0 8px 8px',
                padding: '12px 20px',
                minHeight: '56px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button onClick={goPrev} disabled={!prev || page === 1} style={{
                        marginRight: '10px',
                        background: '#e0e7ff',
                        color: '#2563eb',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        opacity: (!prev || page === 1) ? 0.5 : 1,
                    }}>
                        ◀️ Prev
                    </button>
                    {pageNumbers.map(num => (
                        <button
                            key={num}
                            onClick={() => setPage(num)}
                            style={{
                                margin: '0 3px',
                                padding: '6px 12px',
                                backgroundColor: num === page ? '#2563eb' : '#e0e7ff',
                                color: num === page ? '#fff' : '#2563eb',
                                border: 'none',
                                borderRadius: '4px',
                                fontWeight: num === page ? 'bold' : 'normal',
                                cursor: 'pointer',
                                opacity: 1,
                            }}
                        >
                            {num}
                        </button>
                    ))}
                    <button onClick={goNext} disabled={!next} style={{
                        marginLeft: '10px',
                        background: '#e0e7ff',
                        color: '#2563eb',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        opacity: !next ? 0.5 : 1,
                    }}>
                        Next ▶️
                    </button>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#2563eb' }}>{page} of {totalPages}</div>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
                    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '10px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>{isEditMode ? 'Edit' : 'Create'} Income For Women & Old</h3>

                        <div style={{ marginBottom: '15px' }}>
                            <label>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
                                <option value="">Select</option>
                                <option value="BPL">BPL</option>
                                <option value="Handicap">Handicap</option>
                                <option value="Child Below 18">Child Below 18</option>
                                <option value="Mature Female">Mature Female</option>
                                <option value="Senior Citizen">Senior Citizen</option>
                            </select>
                            {formErrors.category && (
                                <div style={{ color: 'red', fontSize: '12px', marginTop: '2px', textAlign: 'left' }}>{formErrors.category}</div>
                            )}
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label>Income</label>
                            <input type="number" name="income" value={formData.income} onChange={handleChange} style={inputStyle} />
                            {formErrors.income && (
                                <div style={{ color: 'red', fontSize: '12px', marginTop: '2px', textAlign: 'left' }}>{formErrors.income}</div>
                            )}
                        </div>

                        {isEditMode && (
                            <div style={{ marginBottom: '15px' }}>
                                <label>Previous Income</label>
                                <input
                                    type="number"
                                    name="previous_income_for_women_old"
                                    value={formData.previous_income_for_women_old ?? formData.income}
                                    readOnly
                                    style={{ ...inputStyle, backgroundColor: '#f3f3f3' }}
                                />
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={resetModal} style={{ ...modalBtn, backgroundColor: '#e5e7eb', color: '#333', marginRight: '10px' }}>Cancel</button>
                            <button onClick={handleCreate} style={{ ...modalBtn, backgroundColor: '#4f46e5', color: '#fff' }} disabled={submitLoading}>
                                {submitLoading ? '⏳ Saving...' : isEditMode ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleting && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #3498db',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <style>
                        {`@keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }`}
                    </style>
                </div>
            )}
        </div>
    );
}
