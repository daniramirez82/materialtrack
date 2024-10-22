import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { db } from '../config/firebase';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';

const MaterialForm = ({ obraId, clienteId }) => {
  const validationSchema = Yup.object({
    materiales: Yup.array().of(
      Yup.object({
        codigo: Yup.string().required('Requerido'),
        nombre: Yup.string().required('Requerido'),
        cantidad: Yup.number().required('Requerido').positive('Debe ser un número positivo'),
      })
    ),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const fecha = format(new Date(), 'yyyy-MM-dd');
    const clienteRef = collection(db, 'salidas', fecha, 'clientes', clienteId, 'materiales');

    try {
      for (const material of values.materiales) {
        const materialRef = doc(clienteRef, material.codigo);
        await setDoc(materialRef, material);
      }
      resetForm();
    } catch (error) {
      console.error('Error al guardar los datos: ', error);
    }
    setSubmitting(false);
  };

  const fetchArticulo = async (codigo, setFieldValue, index) => {
    if (codigo) {
      const docRef = doc(db, 'articulos', codigo);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFieldValue(`materiales.${index}.nombre`, docSnap.data().nombreArticulo);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <Typography variant="h4" component="h1" gutterBottom>
          Registrar Materiales para la Obra
        </Typography>
        <Formik
          initialValues={{ materiales: [{ codigo: '', nombre: '', cantidad: '' }] }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, isSubmitting, setFieldValue }) => (
            <Form>
              <FieldArray name="materiales">
                {({ push, remove }) => (
                  <div>
                    {values.materiales.map((material, index) => (
                      <Box key={index} mb={2}>
                        <Field
                          as={TextField}
                          margin="normal"
                          required
                          fullWidth
                          id={`materiales.${index}.codigo`}
                          label="Código"
                          name={`materiales.${index}.codigo`}
                          autoComplete="codigo"
                          error={touched.materiales?.[index]?.codigo && Boolean(errors.materiales?.[index]?.codigo)}
                          helperText={touched.materiales?.[index]?.codigo && errors.materiales?.[index]?.codigo}
                          onChange={async (e) => {
                            const newCodigo = e.target.value;
                            setFieldValue(`materiales.${index}.codigo`, newCodigo);
                            await fetchArticulo(newCodigo, setFieldValue, index);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              document.getElementById(`materiales.${index}.cantidad`).focus();
                            }
                          }}
                        />
                        <Field
                          as={TextField}
                          margin="normal"
                          required
                          fullWidth
                          id={`materiales.${index}.nombre`}
                          label="Nombre del Artículo"
                          name={`materiales.${index}.nombre`}
                          autoComplete="nombre"
                          error={touched.materiales?.[index]?.nombre && Boolean(errors.materiales?.[index]?.nombre)}
                          helperText={touched.materiales?.[index]?.nombre && errors.materiales?.[index]?.nombre}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                        <Field
                          as={TextField}
                          margin="normal"
                          required
                          fullWidth
                          id={`materiales.${index}.cantidad`}
                          label="Cantidad"
                          name={`materiales.${index}.cantidad`}
                          type="number"
                          autoComplete="cantidad"
                          error={touched.materiales?.[index]?.cantidad && Boolean(errors.materiales?.[index]?.cantidad)}
                          helperText={touched.materiales?.[index]?.cantidad && errors.materiales?.[index]?.cantidad}
                        />
                        <Button variant="contained" color="secondary" onClick={() => remove(index)}>
                          Eliminar
                        </Button>
                      </Box>
                    ))}
                    <Button variant="contained" color="primary" onClick={() => push({ codigo: '', nombre: '', cantidad: '' })}>
                      Añadir Material
                    </Button>
                  </div>
                )}
              </FieldArray>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isSubmitting}>
                Registrar
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default MaterialForm;
