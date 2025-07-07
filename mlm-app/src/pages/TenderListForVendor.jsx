import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../components/VendorTenderList.css';

const BASE_API = 'https://mlm-backend-pi.vercel.app/api';

const statusBadge = (status) => {
  const statusMap = {
    draft: 'gray',
    open: 'green',
    review: 'orange',
    awarded: 'blue',
    cancelled: 'red'
  };
  const labelMap = {
    draft: 'Draft',
    open: 'Open',
    review: 'Under Review',
    awarded: 'Awarded',
    cancelled: 'Cancelled'
  };
  return <span className={`badge badge-${statusMap[status]}`}>{labelMap[status]}</span>;
};

const VendorTenderList = () => {
  const [tenders, setTenders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTender, setSelectedTender] = useState(null);
  const [formData, setFormData] = useState({
    vendor_email: '',
    bid_amount: '',
    bid_description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE_API}/open-tenders/`)
      .then(res => {
        const data = Array.isArray(res.data.results) ? res.data.results : res.data;
        setTenders(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const openModal = (tender) => {
    setSelectedTender(tender);
    setFormData({
      vendor_email: '',
      bid_amount: '',
      bid_description: ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTender(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${BASE_API}/tender-bids/`, {
        ...formData,
        tender_id: selectedTender.id
      });
      alert("Bid submitted successfully!");
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Error submitting bid.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="vendor-container">
      <h2 className="page-title center-text">Available Tenders</h2>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <table className="vendor-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Status</th>
              <th>Deadline</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tenders.map(tender => (
              <tr key={tender.id}>
                <td>{tender.title}</td>
                <td>{tender.location}</td>
                <td>{statusBadge(tender.status)}</td>
                <td>{new Date(tender.deadline).toLocaleString()}</td>
                <td>
                  <button className="primary-btn" onClick={() => openModal(tender)}>
                    Fill Bid
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Submit Bid for: <span className="highlight">{selectedTender.title}</span></h3>
            <form onSubmit={handleSubmit} className="modal-form">
              <label>Email (registered)</label>
              <input type="email" name="vendor_email" required value={formData.vendor_email} onChange={handleChange} />

              <label>Bid Amount (₹)</label>
              <input type="number" name="bid_amount" required value={formData.bid_amount} onChange={handleChange} />

              <label>Description</label>
              <textarea name="bid_description" value={formData.bid_description} onChange={handleChange} />

              <div className="form-actions">
                <button className="primary-btn" type="submit" disabled={submitting}>
                  {submitting ? <div className="btn-spinner"></div> : 'Submit Bid'}
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

export default VendorTenderList;
