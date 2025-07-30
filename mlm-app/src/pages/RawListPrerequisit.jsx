import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../components/RawListPrerequisit.css'; // Custom CSS

const BASE_URL = 'https://mlm-backend-pi.vercel.app/api/ecom-product';

const PreRequisitList = () => {
  const [awardedTenders, setAwardedTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTender, setSelectedTender] = useState('');
  const [bids, setBids] = useState([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalBid, setModalBid] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [rawLists, setRawLists] = useState([]);
  const [loadingRawLists, setLoadingRawLists] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    const fetchAwardedTenders = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/awarded-tender/awarded-status/`);
        setAwardedTenders(response.data);
      } catch (error) {
        console.error('Error fetching awarded tenders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAwardedTenders();
  }, []);

  const fetchBids = async (tenderId) => {
    setBids([]);
    if (!tenderId) return;
    setLoadingBids(true);
    try {
      const response = await axios.get(`${BASE_URL}/awarded-tender/${tenderId}/approved_bids/`);
      setBids(response.data);
    } catch (error) {
      setBids([]);
      console.error('Error fetching approved bids:', error);
    } finally {
      setLoadingBids(false);
    }
  };

  const handleTenderSelect = async (e) => {
    const tenderId = e.target.value;
    setSelectedTender(tenderId);
    await fetchBids(tenderId);
  };

  // Modal handlers
  const openEditModal = (bid) => {
    setModalBid(bid);
    setQuantity(bid.quantity || '');
    // Default delivery date: today + 7 days
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    setDeliveryDate(defaultDate.toISOString().slice(0, 10));
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    setModalBid(null);
    setQuantity('');
    setDeliveryDate('');
    setSaving(false);
  };
  const openViewModal = async (bid) => {
    setModalBid(bid);
    setShowViewModal(true);
    setLoadingRawLists(true);
    setRawLists([]);
    try {
      const response = await axios.get(`${BASE_URL}/raw-product-list/?tender_bid=${bid.id}`);
      setRawLists(response.data.results || []);
    } catch (error) {
      setRawLists([]);
      alert('Failed to fetch raw list data.');
    } finally {
      setLoadingRawLists(false);
    }
  };
  const closeViewModal = () => {
    setShowViewModal(false);
    setModalBid(null);
  };

  const approveRawList = async (rawListId) => {
    setApprovingId(rawListId);
    try {
      await axios.post(`${BASE_URL}/raw-product-list/${rawListId}/approve/`);
      alert('Raw list approved!');
      // Refresh raw lists in modal
      if (modalBid) {
        const response = await axios.get(`${BASE_URL}/raw-product-list/?tender_bid=${modalBid.id}`);
        setRawLists(response.data.results || []);
      }
    } catch (error) {
      alert('Failed to approve raw list.');
    } finally {
      setApprovingId(null);
    }
  };

  const handleSampleFormSubmit = async (e) => {
    e.preventDefault();
    if (!modalBid) return;
    setSaving(true);
    try {
      await axios.post(`${BASE_URL}/raw-product-list/`, {
        tender_bid: modalBid.id,
        tender: modalBid.tender,
        vendor: modalBid.vendor,
        batches: [
          {
            quantity: Number(quantity),
            delivery_date: deliveryDate
          }
        ]
      });
      alert('Pre-requisite created successfully!');
      closeEditModal();
      // Refresh bids table
      if (selectedTender) await fetchBids(selectedTender);
    } catch (error) {
      setSaving(false);
      alert('Failed to create pre-requisite.');
    }
  };

  return (
    <div className="pre-req-container">
      <h1 className="heading">Pre-Requisite List</h1>
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="dropdown-container">
          <label htmlFor="tender-select">Select Awarded Tender:</label>
          <select
            id="tender-select"
            value={selectedTender}
            onChange={handleTenderSelect}
          >
            <option value="">-- Select Tender --</option>
            {awardedTenders.map((tender) => (
              <option key={tender.id} value={tender.id}>
                {tender.tender_product_no ? `TPN-${tender.tender_product_no} - ` : ''}{tender.title || `Tender`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Loader and message when fetching bids */}
      {loadingBids && (
        <div className="loader-container">
          <div className="loader"></div>
          <div className="loader-message">Fetching data...</div>
        </div>
      )}

      {/* Table for bids */}
      {!loadingBids && bids.length > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>Tender Name</th>
                <th>Bid Amount</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Submitted At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => (
                <tr key={bid.id}>
                  <td>{bid.vendor_name}</td>
                  <td>{bid.tender_product_no ? `TPN-${bid.tender_product_no} - ` : ''}{bid.tender_title}</td>
                  <td>{bid.bid_amount}</td>
                  <td>{bid.bid_description}</td>
                  <td>{bid.quantity}</td>
                  <td>{bid.status}</td>
                  <td>{new Date(bid.submitted_at).toLocaleString()}</td>
                  <td className="action-cell">
                    {/* Fill/Edit icon (SVG) */}
                    <span className="action-icon" title="Edit" style={{marginRight: '8px', cursor: 'pointer'}} onClick={() => openEditModal(bid)}>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign: 'middle'}}>
                        <path d="M2 14.5V18h3.5l10.06-10.06-3.5-3.5L2 14.5zM17.71 6.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.5 3.5 1.83-1.83z" fill="#888"/>
                      </svg>
                    </span>
                    <span className="action-icon" title="View" style={{marginRight: '8px', cursor: 'pointer'}} onClick={() => openViewModal(bid)}>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign: 'middle'}}>
                        <path d="M10 4.5C5 4.5 1.73 8.11 1 10c.73 1.89 4 5.5 9 5.5s8.27-3.61 9-5.5c-.73-1.89-4-5.5-9-5.5zm0 9c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6.5A2.5 2.5 0 1 0 10 13a2.5 2.5 0 0 0 0-5z" fill="#888"/>
                      </svg>
                    </span>
                    <button className="action-approve-btn" title="Approve">Approve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && modalBid && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="modal-title">Create Pre-Requisite</h2>
            <form onSubmit={handleSampleFormSubmit} className="modal-form">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="modal-input"
                placeholder="Enter quantity"
                required
              />
              <label htmlFor="deliveryDate">Delivery Date</label>
              <input
                id="deliveryDate"
                type="date"
                value={deliveryDate}
                onChange={e => setDeliveryDate(e.target.value)}
                className="modal-input"
                required
              />
              <div className="modal-actions">
                {saving ? (
                  <button type="button" className="modal-btn primary" disabled>Saving...</button>
                ) : (
                  <>
                    <button type="submit" className="modal-btn primary">Save</button>
                    <button type="button" className="modal-btn" onClick={closeEditModal}>Cancel</button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && modalBid && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="modal-title">Pre-Requisite Details</h2>
            {loadingRawLists ? (
              <div className="loader-container" style={{minHeight: 120}}>
                <div className="loader"></div>
                <div className="loader-message">Loading raw list...</div>
              </div>
            ) : rawLists.length === 0 ? (
              <div style={{textAlign: 'center', color: '#888', margin: '2rem 0'}}>No raw list found for this bid.</div>
            ) : (
              rawLists.map((raw, idx) => (
                <div key={raw.id} style={{marginBottom: '2.2rem'}}>
                  <div className="modal-kv-list">
                    <div className="modal-kv-row"><span>Vendor Name:</span> <span>{raw.vendor_name}</span></div>
                    <div className="modal-kv-row"><span>Tender Name:</span> <span>{raw.tender_product_no ? `TPN-${raw.tender_product_no} - ` : ''}{raw.tender_title}</span></div>
                    <div className="modal-kv-row"><span>Status:</span> <span>{raw.status}</span></div>
                    <div className="modal-kv-row"><span>Created At:</span> <span>{new Date(raw.created_at).toLocaleString()}</span></div>
                    <div className="modal-kv-row" style={{fontWeight: 600, color: '#007bff'}}>Batches:</div>
                    {raw.batches && raw.batches.length > 0 ? raw.batches.map(batch => (
                      <div className="modal-kv-row" key={batch.id} style={{paddingLeft: '1.2rem'}}>
                        <span>Delivery: {batch.delivery_date}</span>
                        <span>Qty: {batch.quantity}</span>
                      </div>
                    )) : (
                      <div className="modal-kv-row" style={{paddingLeft: '1.2rem', color: '#888'}}>No batches</div>
                    )}
                  </div>
                  <div className="modal-actions" style={{marginTop: '1.2rem', justifyContent: 'center'}}>
                    <button
                      className="modal-btn primary"
                      onClick={() => approveRawList(raw.id)}
                      disabled={approvingId === raw.id}
                      style={{minWidth: 120, borderBottom: '2px solid #007bff'}}
                    >
                      {approvingId === raw.id ? 'Approving...' : 'Approve'}
                    </button>
                  </div>
                  {idx !== rawLists.length - 1 && <hr style={{margin: '2rem 0', border: 0, borderTop: '1.5px solid #e0e0e0'}} />}
                </div>
              ))
            )}
            <div className="modal-actions">
              <button className="modal-btn primary" onClick={closeViewModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreRequisitList;
