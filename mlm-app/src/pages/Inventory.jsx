import React, { useState } from 'react';
import '../components/Inventory.css'; // custom css for inventory

const InventoryDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState('');

  const locations = [
    { id: 1, name: 'Warehouse A' },
    { id: 2, name: 'Warehouse B' },
    { id: 3, name: 'Warehouse C' },
  ];

  const kpis = {
    total_products: 150,
    low_stock: 12,
    total_value: 25000.5,
  };

  const products = [
    { id: 1, name: 'Laptop', quantity: 20, location: { id: 1, name: 'Warehouse A' }, value: 1200.0 },
    { id: 2, name: 'Mouse', quantity: 50, location: { id: 1, name: 'Warehouse A' }, value: 25.5 },
    { id: 3, name: 'Keyboard', quantity: 30, location: { id: 2, name: 'Warehouse B' }, value: 45.0 },
    { id: 4, name: 'Monitor', quantity: 15, location: { id: 3, name: 'Warehouse C' }, value: 300.0 },
    { id: 5, name: 'Headphones', quantity: 5, location: { id: 2, name: 'Warehouse B' }, value: 80.0 },
  ];

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const filteredProducts = selectedLocation
    ? products.filter((p) => p.location.id === parseInt(selectedLocation))
    : products;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Inventory Management Dashboard</h1>

      <div className="filter-bar">
        <label htmlFor="location">📍 Location:</label>
        <select
          id="location"
          value={selectedLocation}
          onChange={handleLocationChange}
        >
          <option value="">All Locations</option>
          {locations.map(location => (
            <option key={location.id} value={location.id}>{location.name}</option>
          ))}
        </select>

        <label htmlFor="stock">📦 Stock Status:</label>
        <select id="stock" disabled>
          <option value="">All</option>
          <option value="low">Low Stock</option>
          <option value="available">Available</option>
        </select>

        <label htmlFor="search">🔍 Search:</label>
        <input
          type="text"
          id="search"
          placeholder="Search products..."
          disabled
        />
      </div>


      <div className="kpi-container">
        <div className="kpi-card">
          <h2>Total Products</h2>
          <p>{kpis.total_products}</p>
        </div>
        <div className="kpi-card">
          <h2>Low Stock</h2>
          <p className="low-stock">{kpis.low_stock}</p>
        </div>
        <div className="kpi-card">
          <h2>Total Value</h2>
          <p className="total-value">${kpis.total_value.toFixed(2)}</p>
        </div>
      </div>

      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.location.name}</td>
                <td>${product.value.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && <p className="no-products">No products found.</p>}
      </div>
    </div>
  );
};

export default InventoryDashboard;
