'use client';

import { Container, Typography, Box } from '@mui/material';
import DynamicForm from '@/app/components/DynamicForm';

export default function Home() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Revest Solutions
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          Dynamic Form Builder
        </Typography>
        <DynamicForm />
      </Box>
    </Container>
  );
}