import React from 'react';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Settings from './pages/Settings';
import UserList from './pages/UserList';
import Inventory from './pages/Inventory';
import VendorRegistration from './pages/VendorRegistration';
import InventoryStock from './pages/InventoryStock';
import InventoryOrders from './pages/InventoryOrders';
import InventoryReturns from './pages/InventoryReturns';
import IncomeGeneral from './pages/IncomeGeneral';
import IncomeWomen from './pages/IncomeWomen';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ padding: '20px', flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users/customers" element={<UserList />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/vendors" element={<VendorRegistration />} />
          <Route path="/inventory/stock" element={<InventoryStock />} />
          <Route path="/inventory/orders" element={<InventoryOrders />} />
          <Route path="/inventory/returns" element={<InventoryReturns />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/income/general" element={<IncomeGeneral />} />
          <Route path="/income/women" element={<IncomeWomen />} />
          {/* Add more pages here later */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
