import React, { useState, useEffect } from 'react';
import { Box, Button, Container, MenuItem, TextField, Typography, Link } from '@mui/material';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link as RouterLink } from 'react-router-dom';

const SelectObra = ({ onSelect }) => {
  const [obras, setObras] = useState([]);
  const [selectedObra, setSelectedObra] = useState('');

  useEffect(() => {
    const fetchObras = async () => {
      const obrasCollection = collection(db, 'obras');
      const obrasSnapshot = await getDocs(obrasCollection);
      const obrasList = obrasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setObras(obrasList);
    };

    fetchObras();
  }, []);

  const handleSelect = () => {
    const obra = obras.find(o => o.id === selectedObra);
    if (obra) {
      onSelect(selectedObra, obra.clienteId);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <Typography variant="h4" component="h1" gutterBottom>
          Seleccionar Obra
        </Typography>
        <TextField
          select
          label="Obra"
          value={selectedObra}
          onChange={(e) => setSelectedObra(e.target.value)}
          fullWidth
          margin="normal"
        >
          {obras.map((obra) => (
            <MenuItem key={obra.id} value={obra.id}>
              {obra.nombre}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" color="primary" onClick={handleSelect} disabled={!selectedObra}>
          Seleccionar
        </Button>
        <Box mt={2}>
          <Link component={RouterLink} to="/add-obra" variant="body2">
            Agregar Nueva Obra
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default SelectObra;
