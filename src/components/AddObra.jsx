import React, { useState, useEffect } from 'react';
import { Box, Button, Container, TextField, Typography, MenuItem } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { db } from '../config/firebase';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const AddObra = () => {
  const [clientes, setClientes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      const q = query(collection(db, 'clients'), where('isActive', '==', true));
      const querySnapshot = await getDocs(q);
      const clientsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClientes(clientsList);
    };
    fetchClientes();
  }, []);

  const validationSchema = Yup.object({
    nombre: Yup.string().required('Requerido'),
    ubicacion: Yup.string().required('Requerido'),
    cliente: Yup.string().required('Requerido'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const selectedClient = clientes.find(cliente => cliente.clientAlias === values.cliente);
    const obraData = {
      ...values,
      clienteId: selectedClient.id,
    };

    try {
      await addDoc(collection(db, 'obras'), obraData);
      resetForm();
      navigate('/'); // Redirigir a la página anterior
    } catch (error) {
      console.error('Error al guardar los datos: ', error);
    }
    setSubmitting(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Agregar Nueva Obra
        </Typography>
        <Formik
          initialValues={{ nombre: '', ubicacion: '', cliente: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                id="nombre"
                label="Nombre de la Obra"
                name="nombre"
                autoComplete="nombre"
                autoFocus
                error={touched.nombre && Boolean(errors.nombre)}
                helperText={touched.nombre && errors.nombre}
              />
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                id="ubicacion"
                label="Ubicación"
                name="ubicacion"
                autoComplete="ubicacion"
                error={touched.ubicacion && Boolean(errors.ubicacion)}
                helperText={touched.ubicacion && errors.ubicacion}
              />
              <Field
                as={TextField}
                select
                margin="normal"
                required
                fullWidth
                id="cliente"
                label="Cliente"
                name="cliente"
                autoComplete="cliente"
                error={touched.cliente && Boolean(errors.cliente)}
                helperText={touched.cliente && errors.cliente}
              >
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.id} value={cliente.clientAlias}>
                    {cliente.clientName}
                  </MenuItem>
                ))}
              </Field>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
              >
                Agregar Obra
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default AddObra;
