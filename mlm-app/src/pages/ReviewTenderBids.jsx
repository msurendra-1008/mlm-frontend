import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../components/ReviewTenderBids.css';

const BASE_API = 'https://mlm-backend-pi.vercel.app/api/ecom-product';

const TenderBidReview = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [negotiationNote, setNegotiationNote] = useState('');
  const [selectedBidId, setSelectedBidId] = useState(null);

  // ✅ Fetch bids on page load
  useEffect(() => {
    fetchBids();
  }, []);

  // ✅ Reusable fetch function
  const fetchBids = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_API}/tender-bids/`);
      const bidList = Array.isArray(res.data.results) ? res.data.results : res.data;
      setBids(bidList);
    } catch (err) {
      console.error('Error fetching bids:', err);
      setBids([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update bid status
  const updateStatus = async (id, status) => {
    try {
      await axios.post(`${BASE_API}/tender-bids/${id}/update_status/`, {
        status,
        negotiation_message: status === 'negotiation' ? negotiationNote : ''
      });
      fetchBids();
      setSelectedBidId(null);
      setNegotiationNote('');
    } catch (err) {
      console.error('Status update failed:', err);
      alert('Failed to update status.');
    }
  };

  return (
    <div className="bid-review-container">
      <h2 className="page-title">Tender Bids Review</h2>

      {loading ? (
        <div className="loader" />
      ) : (
        <>
          {bids.length === 0 ? (
            <p className="no-bids">No bids available.</p>
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
                    <td>
                      <span className={`badge badge-${bid.status}`}>{bid.status}</span>
                    </td>
                    <td>{new Date(bid.submitted_at).toLocaleString()}</td>
                    <td>
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
                      <button
                        className="secondary-btn"
                        onClick={() => setSelectedBidId(bid.id)}
                      >
                        Negotiate
                      </button>
                      {selectedBidId === bid.id && (
                        <div className="negotiation-box">
                          <textarea
                            placeholder="Message to vendor..."
                            value={negotiationNote}
                            onChange={(e) => setNegotiationNote(e.target.value)}
                          />
                          <button
                            className="primary-btn"
                            onClick={() => updateStatus(bid.id, 'negotiation')}
                          >
                            Send
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default TenderBidReview;
