// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import '../components/ReviewTenderBids.css';

// const BASE_API = 'https://mlm-backend-pi.vercel.app/api/ecom-product';

// const TenderBidReview = () => {
//   const [bids, setBids] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [negotiationNote, setNegotiationNote] = useState('');
//   const [selectedBidId, setSelectedBidId] = useState(null);

//   // ✅ Fetch bids on page load
//   useEffect(() => {
//     fetchBids();
//   }, []);

//   // ✅ Reusable fetch function
//   const fetchBids = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${BASE_API}/tender-bids/`);
//       const bidList = Array.isArray(res.data.results) ? res.data.results : res.data;
//       setBids(bidList);
//     } catch (err) {
//       console.error('Error fetching bids:', err);
//       setBids([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Update bid status
//   const updateStatus = async (id, status) => {
//     try {
//       await axios.post(`${BASE_API}/tender-bids/${id}/update_status/`, {
//         status,
//         negotiation_message: status === 'negotiation' ? negotiationNote : ''
//       });
//       fetchBids();
//       setSelectedBidId(null);
//       setNegotiationNote('');
//     } catch (err) {
//       console.error('Status update failed:', err);
//       alert('Failed to update status.');
//     }
//   };

//   return (
//     <div className="bid-review-container">
//       <h2 className="page-title">Tender Bids Review</h2>

//       {loading ? (
//         <div className="loader" />
//       ) : (
//         <>
//           {bids.length === 0 ? (
//             <p className="no-bids">No bids available.</p>
//           ) : (
//             <table className="custom-table">
//               <thead>
//                 <tr>
//                   <th>Vendor</th>
//                   <th>Tender</th>
//                   <th>Amount</th>
//                   <th>Description</th>
//                   <th>Status</th>
//                   <th>Submitted</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {bids.map(bid => (
//                   <tr key={bid.id}>
//                     <td>{bid.vendor_name}</td>
//                     <td>{bid.tender_title}</td>
//                     <td>₹ {bid.bid_amount}</td>
//                     <td>{bid.bid_description}</td>
//                     <td>
//                       <span className={`badge badge-${bid.status}`}>{bid.status}</span>
//                     </td>
//                     <td>{new Date(bid.submitted_at).toLocaleString()}</td>
//                     <td>
//                       <button
//                         className="action-btn"
//                         onClick={() => updateStatus(bid.id, 'approved')}
//                       >
//                         Approve
//                       </button>
//                       <button
//                         className="danger-btn"
//                         onClick={() => updateStatus(bid.id, 'rejected')}
//                       >
//                         Reject
//                       </button>
//                       <button
//                         className="secondary-btn"
//                         onClick={() => setSelectedBidId(bid.id)}
//                       >
//                         Negotiate
//                       </button>
//                       {selectedBidId === bid.id && (
//                         <div className="negotiation-box">
//                           <textarea
//                             placeholder="Message to vendor..."
//                             value={negotiationNote}
//                             onChange={(e) => setNegotiationNote(e.target.value)}
//                           />
//                           <button
//                             className="primary-btn"
//                             onClick={() => updateStatus(bid.id, 'negotiation')}
//                           >
//                             Send
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default TenderBidReview;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import '../components/ReviewTenderBids.css';

// const BASE_API = 'https://mlm-backend-pi.vercel.app/api/ecom-product';

// const TenderBidReview = () => {
//   const [bids, setBids] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [negotiationNote, setNegotiationNote] = useState('');
//   const [selectedBidId, setSelectedBidId] = useState(null);

//   const fetchBids = async () => {
//     try {
//       const res = await axios.get(`${BASE_API}/tender-bids/`);
//       const bidList = Array.isArray(res.data.results) ? res.data.results : res.data;
//       setBids(bidList);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBids();
//   }, []);

//   const updateStatus = async (id, status) => {
//     try {
//       await axios.post(`${BASE_API}/tender-bids/${id}/update_status/`, {
//         status,
//         negotiation_message: status === 'negotiation' ? negotiationNote : ''
//       });
//       setNegotiationNote('');
//       setSelectedBidId(null);
//       fetchBids();
//     } catch (err) {
//       console.error(err);
//       alert('Failed to update status.');
//     }
//   };

//   return (
//     <div className="bid-review-container">
//       <h2 className="page-title">Tender Bids Review</h2>
//       {loading ? (
//         <div className="loader" />
//       ) : (
//         <table className="custom-table">
//           <thead>
//             <tr>
//               <th>Vendor</th>
//               <th>Tender</th>
//               <th>Amount</th>
//               <th>Description</th>
//               <th>Status</th>
//               <th>Submitted</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {bids.map(bid => (
//               <tr key={bid.id}>
//                 <td>{bid.vendor_name}</td>
//                 <td>{bid.tender_title}</td>
//                 <td>₹ {bid.bid_amount}</td>
//                 <td>{bid.bid_description}</td>
//                 <td><span className={`badge badge-${bid.status}`}>{bid.status}</span></td>
//                 <td>{new Date(bid.submitted_at).toLocaleString()}</td>
//                 <td>
//                   {bid.status === 'approved' ? (
//                     <span style={{ color: 'green', fontSize: '20px' }}>✅</span>
//                   ) : bid.status === 'rejected' ? (
//                     <span style={{ color: 'red', fontSize: '20px' }}>❌</span>
//                   ) : bid.status === 'negotiation' ? (
//                     <div>
//                       <div className="negotiation-message">
//                         <strong>Negotiation:</strong> {bid.negotiation_message || 'No message'}
//                       </div>
//                       {selectedBidId === bid.id ? (
//                         <>
//                           <textarea
//                             value={negotiationNote}
//                             onChange={(e) => setNegotiationNote(e.target.value)}
//                             placeholder="Update negotiation message"
//                           />
//                           <div style={{ marginTop: '10px' }}>
//                             <button className="primary-btn" onClick={() => updateStatus(bid.id, 'negotiation')}>
//                               Send
//                             </button>
//                             <button className="action-btn" onClick={() => updateStatus(bid.id, 'approved')}>
//                               Approve
//                             </button>
//                           </div>
//                         </>
//                       ) : (
//                         <button className="secondary-btn" onClick={() => setSelectedBidId(bid.id)}>
//                           Edit Message
//                         </button>
//                       )}
//                     </div>
//                   ) : (
//                     <div>
//                       <button className="action-btn" onClick={() => updateStatus(bid.id, 'approved')}>Approve</button>
//                       <button className="danger-btn" onClick={() => updateStatus(bid.id, 'rejected')}>Reject</button>
//                       <button className="secondary-btn" onClick={() => setSelectedBidId(bid.id)}>Negotiate</button>
//                       {selectedBidId === bid.id && (
//                         <div className="negotiation-box">
//                           <textarea
//                             placeholder="Message to vendor..."
//                             value={negotiationNote}
//                             onChange={(e) => setNegotiationNote(e.target.value)}
//                           />
//                           <button className="primary-btn" onClick={() => updateStatus(bid.id, 'negotiation')}>
//                             Send
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default TenderBidReview;


import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import '../components/ReviewTenderBids.css';

const BASE_API = 'https://mlm-backend-pi.vercel.app/api/ecom-product';

const TenderBidReview = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [negotiationNote, setNegotiationNote] = useState('');
  const [editingBidId, setEditingBidId] = useState(null);
  const [rowLoading, setRowLoading] = useState(null); // ✅ Correct name
  const [statusFilter, setStatusFilter] = useState('');

  // Add a status label map for display
  const statusLabelMap = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    negotiation: 'Negotiation',
  };

  // Filtered bids based on status
  const filteredBids = statusFilter ? bids.filter(bid => bid.status === statusFilter) : bids;

  const fetchBids = async () => {
    try {
      const res = await axios.get(`${BASE_API}/tender-bids/`);
      const bidList = res.data?.results || res.data;
      setBids(bidList);
    } catch (err) {
      console.error(err);
      setBids([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, []);

  const updateStatus = async (id, status, newMessage = '') => {
    setRowLoading(id);
    try {
      await axios.post(`${BASE_API}/tender-bids/${id}/update_status/`, {
        status,
        negotiation_message: status === 'negotiation' ? newMessage : '',
      });

      const res = await axios.get(`${BASE_API}/tender-bids/`);
      const data = Array.isArray(res.data.results) ? res.data.results : res.data;
      setBids(data);

      toast.success(`Status updated to "${status}"`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status.');
    } finally {
      setRowLoading(null);
      setEditingBidId(null);
      setNegotiationNote('');
    }
  };

  return (
    <div className="bid-review-container">
      <ToastContainer position="top-center" autoClose={2000} />
      <h2 className="page-title">Tender Bids Review</h2>

      <div className="filter-bar">
        <label htmlFor="statusFilter">Filter by Status: </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="status-filter-select"
        >
          <option value="">All</option>
          {Object.entries(statusLabelMap).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loader" />
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Quantity</th>
              <th>Tender</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBids.map((bid) => (
              <tr key={bid.id}>
                <td>{bid.vendor_name}</td>
                <td>{bid.quantity}</td>
                <td>{bid.tender_title}</td>
                <td>₹ {bid.bid_amount}</td>
                <td>{bid.bid_description}</td>
                <td>
                  <span className={`badge badge-${bid.status}`}>{statusLabelMap[bid.status] || bid.status}</span>
                </td>
                <td>{new Date(bid.submitted_at).toLocaleString()}</td>
                <td>
                  {rowLoading === bid.id ? (
                    <div className="row-spinner" />
                  ) : bid.status === 'approved' ? (
                    <button className="action-btn icon-btn" title="Approved" disabled>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="10" fill="#28a745" />
                        <path d="M6 10.5L9 13.5L14 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  ) : bid.status === 'rejected' ? (
                    <button className="danger-btn icon-btn" title="Rejected" disabled>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="10" fill="#dc3545" />
                        <path d="M7 7L13 13M13 7L7 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  ) : (
                    <>
                      <button
                        className="action-btn"
                        onClick={() => updateStatus(bid.id, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="danger-btn"
                        onClick={() => updateStatus(bid.id, 'rejected')}
                      >
                        Reject
                      </button>

                      {bid.status === 'negotiation' && (
                        <>
                          <div className="negotiation-message">
                            <strong>Message:</strong> {bid.negotiation_message}
                          </div>

                          {editingBidId === bid.id ? (
                            <>
                              <textarea
                                placeholder="Update negotiation message..."
                                value={negotiationNote}
                                onChange={(e) => setNegotiationNote(e.target.value)}
                                className="negotiation-input"
                              />
                              <button
                                className="primary-btn"
                                onClick={() =>
                                  updateStatus(bid.id, 'negotiation', negotiationNote)
                                }
                              >
                                Send
                              </button>
                              <button
                                className="secondary-btn"
                                onClick={() => setEditingBidId(null)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              className="secondary-btn"
                              onClick={() => {
                                setEditingBidId(bid.id);
                                setNegotiationNote(bid.negotiation_message || '');
                              }}
                            >
                              Edit Message
                            </button>
                          )}
                        </>
                      )}

                      {bid.status === 'pending' && (
                        <button
                          className="secondary-btn"
                          onClick={() => {
                            setEditingBidId(bid.id);
                            setNegotiationNote('');
                            updateStatus(bid.id, 'negotiation', '');
                          }}
                        >
                          Negotiate
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TenderBidReview;



