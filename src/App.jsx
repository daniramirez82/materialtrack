import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Config from './pages/Config';
import AuthPage from './pages/AuthPage';
import SelectObra from './components/SelectObra';
import MaterialForm from './components/MaterialForm';
import AddObra from './components/AddObra';

function App() {
  const [selectedObra, setSelectedObra] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);

  const handleSelectObra = (obraId, clienteId) => {
    console.log("App recibe: ", obraId, clienteId);
    setSelectedObra(obraId);
    setSelectedCliente(clienteId);
  };

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/config" element={<Config />} />
        <Route path="/add-obra" element={<AddObra />} />
        <Route
          path="/"
          element={
            selectedObra && selectedCliente ? (
              <MaterialForm obraId={selectedObra} clienteId={selectedCliente} />
            ) : (
              <SelectObra onSelect={handleSelectObra} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
