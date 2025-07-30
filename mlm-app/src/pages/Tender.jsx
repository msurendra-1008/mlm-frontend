// import React, { useEffect, useState, useCallback } from 'react';
// import axios from 'axios';
// import '../components/TenderAdminDashboard.css'; // Import the CSS

// const BASE_API = 'https://mlm-backend-pi.vercel.app/api/ecom-product';

// const TenderAdminDashboard = () => {
//     const [tenders, setTenders] = useState([]);
//     const [modalOpen, setModalOpen] = useState(false);
//     const [formData, setFormData] = useState({
//         tender_product_no: '',
//         title: '',
//         product_image: null,
//         description: '',
//         deadline: '',
//         location: '',
//         budget: '',
//         status: 'open',
//         tender_date: ''
//     });
//     const [editingId, setEditingId] = useState(null);
//     const [page, setPage] = useState(1);
//     const [next, setNext] = useState(null);
//     const [prev, setPrev] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [formLoading, setFormLoading] = useState(false);

//     const fetchTenders = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await axios.get(`${BASE_API}/tenders/`, {
//                 params: { page }
//             });
//             setTenders(res.data.results);
//             setNext(res.data.next);
//             setPrev(res.data.previous);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     }, [page]);

//     useEffect(() => {
//         fetchTenders();
//     }, [fetchTenders]);

//     const handleChange = (e) => {
//         const { name, value, files } = e.target;
//         if (files) {
//             setFormData(prev => ({ ...prev, [name]: files[0] }));
//         } else {
//             setFormData(prev => ({ ...prev, [name]: value }));
//         }
//     };

//     const openModal = (tender = null) => {
//         if (tender) {
//             setFormData({
//                 tender_product_no: tender.tender_product_no || '',
//                 title: tender.title || '',
//                 // product_image: null,
//                 description: tender.description || '',
//                 deadline: tender.deadline ? tender.deadline.slice(0, 16) : '',
//                 location: tender.location || '',
//                 budget: tender.budget || '',
//                 status: tender.status || 'open',
//                 tender_date: tender.tender_date ? tender.tender_date.slice(0, 16) : ''
//             });
//             setEditingId(tender.id);
//         } else {
//             setFormData({
//                 tender_product_no: '',
//                 title: '',
//                 // product_image: null,
//                 description: '',
//                 deadline: '',
//                 location: '',
//                 budget: '',
//                 status: 'open',
//                 tender_date: ''
//             });
//             setEditingId(null);
//         }
//         setModalOpen(true);
//     };

//     const getStatusBadge = (status) => {
//         const statusMap = {
//           draft: { text: 'Draft', color: '#6c757d' },           // Gray
//           open: { text: 'Open', color: '#007bff' },             // Blue
//           review: { text: 'Under Review', color: '#ffc107' },   // Yellow
//           awarded: { text: 'Awarded', color: '#28a745' },       // Green
//           cancelled: { text: 'Cancelled', color: '#dc3545' }    // Red
//         };
      
//         const badge = statusMap[status] || { text: status, color: '#6c757d' };
//         return (
//           <span className="status-badge" style={{ backgroundColor: badge.color }}>
//             {badge.text}
//           </span>
//         );
//       };
      


//     const closeModal = () => setModalOpen(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setFormLoading(true);
//         const form = new FormData();
//         for (const key in formData) {
//             if (formData[key]) {
//                 form.append(key, formData[key]);
//             }
//         }

//         try {
//             if (editingId) {
//                 await axios.put(`${BASE_API}/tenders/${editingId}/`, form, {
//                     headers: { 'Content-Type': 'multipart/form-data' }
//                 });
//             } else {
//                 await axios.post(`${BASE_API}/tenders/`, form, {
//                     headers: { 'Content-Type': 'multipart/form-data' }
//                 });
//             }
//             closeModal();
//             fetchTenders();
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setFormLoading(false);
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this tender?")) return;
//         try {
//             await axios.delete(`${BASE_API}/tenders/${id}/`);
//             fetchTenders();
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     return (
//         <div className="dashboard-container">
//             <h1 className="dashboard-title">Tender Management</h1>
//             <div className="center-button">
//                 <button className="primary-btn" onClick={() => openModal()}>Create Tender</button>
//             </div>


//             {/* {loading && <div className="spinner">Loading...</div>} */}

//             {modalOpen && (
//                 <div className="modal-overlay">
//                     <div className="modal-box">
//                         <h2>{editingId ? 'Edit Tender' : 'Create Tender'}</h2>
//                         <form onSubmit={handleSubmit} className="modal-form">
//                             <label>Product No</label>
//                             <input name="tender_product_no" value={formData.tender_product_no} onChange={handleChange} />

//                             <label>Title</label>
//                             <input name="title" value={formData.title} onChange={handleChange} required />

//                             {/* <label>Product Image</label> */}
//                             {/* <input name="product_image" type="file" accept="image/*" onChange={handleChange} /> */}

//                             <label>Description</label>
//                             <textarea name="description" value={formData.description} onChange={handleChange} required />

//                             <label>Deadline</label>
//                             <input name="deadline" type="datetime-local" value={formData.deadline} onChange={handleChange} required />

//                             <label>Location</label>
//                             <input name="location" value={formData.location} onChange={handleChange} required />

//                             <label>Budget</label>
//                             <input name="budget" type="number" value={formData.budget} onChange={handleChange} required />

//                             <label>Tender Date</label>
//                             <input name="tender_date" type="datetime-local" value={formData.tender_date} onChange={handleChange} />

//                             <label>Status</label>
//                             <select name="status" value={formData.status} onChange={handleChange}>
//                                 <option value="draft">Draft</option>
//                                 <option value="open">Open</option>
//                                 <option value="review">Under Review</option>
//                                 <option value="awarded">Awarded</option>
//                                 <option value="cancelled">Cancelled</option>
//                             </select>

//                             <div className="form-actions">
//                                 <button className="primary-btn" type="submit" disabled={formLoading}>
//                                     {formLoading ? 'Saving...' : editingId ? 'Update' : 'Create'}
//                                 </button>
//                                 <button className="secondary-btn" type="button" onClick={closeModal}>Cancel</button>
//                             </div>
//                         </form>

//                     </div>
//                 </div>
//             )}

//             {loading ? (
//                 <div className="spinner"><div className="loader"></div></div>
//             ) : (
//                 <>
//                     <table className="custom-table">
//                         <thead>
//                             <tr>
//                                 <th>Title</th>
//                                 <th>Location</th>
//                                 <th>Budget</th>
//                                 <th>Status</th>
//                                 <th>Deadline</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {tenders.map(tender => (
//                                 <tr key={tender.id}>
//                                     <td>{tender.title}</td>
//                                     <td>{tender.location}</td>
//                                     <td>{tender.budget}</td>
//                                     <td>{getStatusBadge(tender.status)}</td>
//                                     <td>{new Date(tender.deadline).toLocaleString()}</td>
//                                     <td>
//                                         <button className="action-btn" onClick={() => openModal(tender)}>Edit</button>
//                                         <button className="danger-btn" onClick={() => handleDelete(tender.id)}>Delete</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>

//                     <div className="pagination">
//                         <button className="pagination-btn" onClick={() => prev && setPage(p => p - 1)} disabled={!prev}>Prev</button>
//                         <button className="pagination-btn" onClick={() => next && setPage(p => p + 1)} disabled={!next}>Next</button>
//                     </div>
//                 </>
//             )}


//             {/* <div className="pagination">
//                 <button className="pagination-btn" onClick={() => prev && setPage(p => p - 1)} disabled={!prev}>Prev</button>
//                 <button className="pagination-btn" onClick={() => next && setPage(p => p + 1)} disabled={!next}>Next</button>
//             </div> */}
//         </div>
//     );
// };

// export default TenderAdminDashboard;


// //  this is for tender creation and management



import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../components/TenderAdminDashboard.css';

const BASE_API = 'https://mlm-backend-pi.vercel.app/api/ecom-product';

const TenderAdminDashboard = () => {
  const [tenders, setTenders] = useState([]);
  const [filteredTenders, setFilteredTenders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    tender_product_no: '',
    title: '',
    quantity: '', // <-- Added quantity field
    product_image: null,
    description: '',
    deadline: '',
    location: '',
    budget: '',
    status: 'open',
    tender_date: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 7; // Set to your backend's page size

  const fetchTenders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_API}/tenders/`, {
        params: { page }
      });
      const results = res.data.results;
      setTenders(results);
      setFilteredTenders(results);
      setTotalCount(res.data.count); // <-- Add this
    } catch (err) {
      toast.error("Failed to load tenders.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchTenders();
  }, [fetchTenders]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const openModal = (tender = null) => {
    if (tender) {
      setFormData({
        tender_product_no: tender.tender_product_no || '',
        title: tender.title || '',
        quantity: tender.quantity || '', // <-- Added quantity field
        description: tender.description || '',
        deadline: tender.deadline ? tender.deadline.slice(0, 16) : '',
        location: tender.location || '',
        budget: tender.budget || '',
        status: tender.status || 'open',
        tender_date: tender.tender_date ? tender.tender_date.slice(0, 16) : ''
      });
      setEditingId(tender.id);
    } else {
      setFormData({
        tender_product_no: '',
        title: '',
        quantity: '', // <-- Added quantity field
        description: '',
        deadline: '',
        location: '',
        budget: '',
        status: 'open',
        tender_date: ''
      });
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const form = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        form.append(key, formData[key]);
      }
    }

    try {
      if (editingId) {
        await axios.put(`${BASE_API}/tenders/${editingId}/`, form);
        toast.success("Tender updated!");
      } else {
        await axios.post(`${BASE_API}/tenders/`, form);
        toast.success("Tender created!");
      }
      closeModal();
      fetchTenders();
    } catch (err) {
      toast.error("Error submitting tender.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tender?")) return;
    try {
      await axios.delete(`${BASE_API}/tenders/${id}/`);
      toast.success("Tender deleted!");
      fetchTenders();
    } catch (err) {
      toast.error("Failed to delete tender.");
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: { text: 'Draft', color: '#6c757d' },
      open: { text: 'Open', color: '#007bff' },
      review: { text: 'Under Review', color: '#ffc107' },
      awarded: { text: 'Awarded', color: '#28a745' },
      cancelled: { text: 'Cancelled', color: '#dc3545' }
    };

    const badge = statusMap[status] || { text: status, color: '#6c757d' };
    return (
      <span className="status-badge" style={{ backgroundColor: badge.color }}>
        {badge.text}
      </span>
    );
  };

  const handleSort = (criteria) => {
    setSortBy(criteria);
    let sorted = [...filteredTenders];
    if (criteria === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (criteria === 'budget') {
      sorted.sort((a, b) => b.budget - a.budget);
    } else if (criteria === 'deadline') {
      sorted.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }
    setFilteredTenders(sorted);
  };

  const handleFilterStatus = (status) => {
    setStatusFilter(status);
    if (status === '') {
      setFilteredTenders(tenders);
    } else {
      const filtered = tenders.filter(t => t.status === status);
      setFilteredTenders(filtered);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let start = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let end = start + maxPagesToShow - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Tender Management</h1>

      <div className="top-controls">
        <button className="primary-btn" onClick={() => openModal()}>Create Tender</button>

        <div className="filter-sort">
          <select value={sortBy} onChange={(e) => handleSort(e.target.value)}>
            <option value="">Sort by</option>
            <option value="title">Title A-Z</option>
            <option value="budget">Budget High → Low</option>
            <option value="deadline">Deadline Soonest</option>
          </select>

          <select value={statusFilter} onChange={(e) => handleFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="review">Under Review</option>
            <option value="awarded">Awarded</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : filteredTenders.length > 0 ? (
        <>
          <table className="custom-table">
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Title</th>
                <th>Quantity</th> {/* <-- Added Quantity column */}
                <th>Location</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenders.map((tender, idx) => (
                <tr key={tender.id}>
                  <td>{(page - 1) * pageSize + idx + 1}</td>
                  <td>{tender.title}</td>
                  <td>{tender.quantity}</td> {/* <-- Show quantity */}
                  <td>{tender.location}</td>
                  <td>{tender.budget}</td>
                  <td>{getStatusBadge(tender.status)}</td>
                  <td>{new Date(tender.deadline).toLocaleString()}</td>
                  <td>
                    <button className="action-btn" onClick={() => openModal(tender)}>Edit</button>
                    <button className="danger-btn" onClick={() => handleDelete(tender.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-bar">
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Prev
              </button>
              {getPageNumbers().map((pg) => (
                <button
                  key={pg}
                  className={`pagination-btn${pg === page ? ' active' : ''}`}
                  onClick={() => setPage(pg)}
                  disabled={pg === page}
                >
                  {pg}
                </button>
              ))}
              <button
                className="pagination-btn"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
            <div className="pagination-info">
              Page {page} of {totalPages}
            </div>
          </div>
        </>
      ) : (
        <div className="no-data-message">No tenders available.</div>
      )}

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>{editingId ? 'Edit Tender' : 'Create Tender'}</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <label>Product No</label>
              <input name="tender_product_no" value={formData.tender_product_no} onChange={handleChange} />

              <label>Title</label>
              <input name="title" value={formData.title} onChange={handleChange} required />

              <label>Quantity</label> {/* <-- Added Quantity input */}
              <input
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
              />

              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required />

              <label>Deadline</label>
              <input name="deadline" type="datetime-local" value={formData.deadline} onChange={handleChange} required />

              <label>Location</label>
              <input name="location" value={formData.location} onChange={handleChange} required />

              <label>Budget</label>
              <input name="budget" type="number" value={formData.budget} onChange={handleChange} required />

              <label>Tender Date</label>
              <input name="tender_date" type="datetime-local" value={formData.tender_date} onChange={handleChange} />

              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="open">Open</option>
                <option value="review">Under Review</option>
                <option value="awarded">Awarded</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <div className="form-actions">
                <button className="primary-btn" type="submit" disabled={formLoading}>
                  {formLoading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
                <button className="secondary-btn" type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenderAdminDashboard;
