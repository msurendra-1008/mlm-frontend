import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function IncomeGeneral() {
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [entries, setEntries] = useState([]);
    const [formData, setFormData] = useState({
        child_one: '',
        child_two: '',
        child_three: '',
        income: '',
    });
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false); // ✅ Spinner for delete
    const [submitLoading, setSubmitLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [next, setNext] = useState(null);
    const [prev, setPrev] = useState(null);
    const [count, setCount] = useState(0); // total count for pagination
    const [formErrors, setFormErrors] = useState({});

    const goNext = () => {
        if (next) setPage(prev => prev + 1);
    };
    const goPrev = () => {
        if (prev && page > 1) setPage(prev => prev - 1);
    };

    const apiBase = 'https://mlm-backend-pi.vercel.app/api/general-income/';

    useEffect(() => {
        setLoading(true);
        axios.get(`${apiBase}?page=${page}`)
            .then(res => {
                if (res.data.results) {
                    setEntries(res.data.results);
                    setNext(res.data.next);
                    setPrev(res.data.previous);
                    setCount(res.data.count || 0); // set total count if available
                } else {
                    console.error("Unexpected pagination format", res.data);
                }
            })
            .catch(err => console.error("Error fetching data", err))
            .finally(() => setLoading(false));
    }, [page]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCreate = () => {
        const errors = {};
        if (!formData.child_one) errors.child_one = 'Child 1 is required.';
        if (!formData.child_two) errors.child_two = 'Child 2 is required.';
        if (!formData.child_three) errors.child_three = 'Child 3 is required.';
        if (!formData.income) errors.income = 'Income is required.';
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        const data = { ...formData };
        setSubmitLoading(true);

        const request = isEditMode
            ? axios.put(`${apiBase}${editId}/`, data)
            : axios.post(apiBase, data);

        request
            .then(res => {
                if (isEditMode) {
                    setEntries(prev =>
                        prev.map(entry => (entry.id === editId ? res.data : entry))
                    );
                } else {
                    setEntries(prev => [...prev, res.data]);
                }
                resetModal();
            })
            .catch(err => console.error("Error saving income", err))
            .finally(() => setSubmitLoading(false));
    };


    const handleDelete = (id) => {
        setDeleting(true); // ✅ Show spinner
        axios.delete(`${apiBase}${id}/`)
            .then(() => {
                setEntries(prev => prev.filter(entry => entry.id !== id));
            })
            .catch(err => console.error("Error deleting", err))
            .finally(() => {
                setDeleting(false); // ✅ Hide spinner
            });
    };

    const openEditModal = (entry) => {
        setFormData({
            child_one: entry.child_one,
            child_two: entry.child_two,
            child_three: entry.child_three,
            income: entry.income,
            previous_income: entry.previous_income ?? entry.income,
        });
        setEditId(entry.id);
        setIsEditMode(true);
        setShowModal(true);
    };

    const resetModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setEditId(null);
        setFormData({
            child_one: '',
            child_two: '',
            child_three: '',
            income: '',
        });
    };

    // --- Styles ---
    const thStyle = { padding: '12px 15px', textAlign: 'left', fontWeight: 'bold' };
    const tdStyle = { padding: '12px 15px', textAlign: 'left' };
    const editBtn = { padding: '5px 10px', marginRight: '8px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' };
    const deleteBtn = { padding: '5px 10px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' };
    const inputStyle = { width: '100%', padding: '8px 10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '14px' };
    const modalBtn = { padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' };

    // Calculate total pages
    const PAGE_SIZE = 10;
    const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    if (loading) {
        return <div style={{ textAlign: 'center', paddingTop: '50px' }}>⏳ Loading data...</div>;
    }

    return (
        <div style={{ maxWidth: '900px', margin: '50px auto', textAlign: 'center' }}>
            <h2>💰 Common Monthly Basic Income Settings</h2>
            <p>This is the income setting for the Normal, BPL & Handicap</p>
            <button
                style={{ marginBottom: '20px', padding: '10px 15px', fontSize: '16px', cursor: 'pointer' }}
                onClick={() => setShowModal(true)}
            >
                Create Basic Income Setting
            </button>

            <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                <thead style={{ backgroundColor: '#8e7e7e', color: '#fff' }}>
                    <tr>
                        <th style={thStyle}>S.No</th>
                        <th style={thStyle}>Category 1</th>
                        <th style={thStyle}>Category 2</th>
                        <th style={thStyle}>Category 3</th>
                        <th style={thStyle}>Previous Income</th>
                        <th style={thStyle}>Current Income</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, index) => (
                        <tr key={entry.id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff', borderBottom: '1px solid #ddd' }}>
                            <td style={tdStyle}>
                                {(() => {
                                    const serialNumber = (page - 1) * PAGE_SIZE + index + 1;
                                    console.log(`Page: ${page}, Index: ${index}, S.No: ${serialNumber}`);
                                    return serialNumber;
                                })()}
                            </td>
                            <td style={tdStyle}>{entry.child_one}</td>
                            <td style={tdStyle}>{entry.child_two}</td>
                            <td style={tdStyle}>{entry.child_three}</td>
                            <td style={tdStyle}>₹{entry.previous_income ?? entry.income}</td>
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

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
                    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '10px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>{isEditMode ? 'Edit' : 'Create'} Basic Income</h3>

                        {['child_one', 'child_two', 'child_three'].map((field, i) => (
                            <div style={{ marginBottom: '15px' }} key={field}>
                                <label>{`Category ${i + 1}`}</label>
                                <select name={field} value={formData[field]} onChange={handleChange} style={inputStyle}>
                                    <option value="">Select</option>
                                    <option value="Normal">Normal</option>
                                    <option value="BPL">BPL</option>
                                    <option value="Handicap">Handicap</option>
                                </select>
                                {formErrors[field] && (
                                    <div style={{ color: 'red', fontSize: '12px', marginTop: '2px', textAlign: 'left' }}>{formErrors[field]}</div>
                                )}
                            </div>
                        ))}

                        {isEditMode && (
                            <div style={{ marginBottom: '15px' }}>
                                <label>Previous Income</label>
                                <input
                                    type="number"
                                    name="previous_income"
                                    value={formData.previous_income ?? formData.income}
                                    readOnly
                                    style={{ ...inputStyle, backgroundColor: '#f3f3f3' }}
                                />
                            </div>
                        )}

                        <div style={{ marginBottom: '15px' }}>
                            <label>Income</label>
                            <input type="number" name="income" value={formData.income} onChange={handleChange} style={inputStyle} />
                            {formErrors.income && (
                                <div style={{ color: 'red', fontSize: '12px', marginTop: '2px', textAlign: 'left' }}>{formErrors.income}</div>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={resetModal} style={{ ...modalBtn, backgroundColor: '#e5e7eb', color: '#333', marginRight: '10px' }}>Cancel</button>
                            <button onClick={handleCreate} style={{ ...modalBtn, backgroundColor: '#4f46e5', color: '#fff' }} disabled={submitLoading}>
                                {submitLoading ? '⏳ Saving...' : isEditMode ? 'Update' : 'Save'}
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Loader Overlay for Delete */}
            {deleting && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
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


//  create income wabt Bassic instead of General.
//  N/A dropdown.
//  instead of child want category. 1, 2 ,3
// pagination me start form next val;ue not from 1
//  same for edit flow