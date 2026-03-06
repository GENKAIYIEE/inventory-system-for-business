// client/src/App.jsx
// Root application with routing

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Inventory from './pages/Inventory';
import Dishes from './pages/Dishes';
import Waste from './pages/Waste';
import Restock from './pages/Restock';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="pos" element={<POS />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="dishes" element={<Dishes />} />
          <Route path="restock" element={<Restock />} />
          <Route path="waste" element={<Waste />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
