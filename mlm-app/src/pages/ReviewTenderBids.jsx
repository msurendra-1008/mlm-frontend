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
import axios from 'axios';
import '../components/ReviewTenderBids.css';

const BASE_API = 'https://mlm-backend-pi.vercel.app/api/ecom-product';

const TenderBidReview = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [negotiationNote, setNegotiationNote] = useState('');
  const [editingBidId, setEditingBidId] = useState(null);
  const [loadingBidId, setLoadingBidId] = useState(null); // ✅ For per-bid spinner

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

  const updateStatus = async (id, status, customMessage = null) => {
    setLoadingBidId(id); // ✅ Start spinner for this bid
    try {
      await axios.post(`${BASE_API}/tender-bids/${id}/update_status/`, {
        status,
        negotiation_message: customMessage !== null ? customMessage : ''
      });
      setEditingBidId(null);
      setNegotiationNote('');
      fetchBids();
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    } finally {
      setLoadingBidId(null); // ✅ Stop spinner
    }
  };

  return (
    <div className="bid-review-container">
      <h2 className="page-title">Tender Bids Review</h2>
      {loading ? (
        <div className="loader" />
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Tender</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bids.map(bid => (
              <tr key={bid.id}>
                <td>{bid.vendor_name}</td>
                <td>{bid.tender_title}</td>
                <td>₹ {bid.bid_amount}</td>
                <td>{bid.bid_description}</td>
                <td><span className={`badge badge-${bid.status}`}>{bid.status}</span></td>
                <td>{new Date(bid.submitted_at).toLocaleString()}</td>
                <td>
                  {loadingBidId === bid.id ? (
                    <div className="row-spinner" />
                  ) : bid.status === 'approved' ? (
                    <span className="emoji">✅</span>
                  ) : bid.status === 'rejected' ? (
                    <span className="emoji">❌</span>
                  ) : (
                    <>
                      <button className="action-btn" onClick={() => updateStatus(bid.id, 'approved')}>Approve</button>
                      <button className="danger-btn" onClick={() => updateStatus(bid.id, 'rejected')}>Reject</button>

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
                              <button className="primary-btn" onClick={() => updateStatus(bid.id, 'negotiation', negotiationNote)}>
                                Send
                              </button>
                              <button className="secondary-btn" onClick={() => setEditingBidId(null)}>Cancel</button>
                            </>
                          ) : (
                            <button className="secondary-btn" onClick={() => {
                              setEditingBidId(bid.id);
                              setNegotiationNote(bid.negotiation_message || '');
                            }}>
                              Edit Message
                            </button>
                          )}
                        </>
                      )}

                      {bid.status === 'pending' && (
                        <button className="secondary-btn" onClick={() => {
                          setEditingBidId(bid.id);
                          setNegotiationNote('');
                          updateStatus(bid.id, 'negotiation', '');
                        }}>
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


