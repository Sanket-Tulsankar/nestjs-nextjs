'use client';

import {
    Box,
    Button,
    Paper,
    Typography,
    Alert,
} from '@mui/material';
import { useState, useEffect } from 'react';
import formConfig from '@/app/utils/formConfig.json';
import FormField from './FormField';
import { useForm } from 'react-hook-form';

interface FormData {
    [key: string]: any;
}

export default function DynamicForm() {
    const [formFields, setFormFields] = useState(formConfig.data);
    const [submittedData, setSubmittedData] = useState<FormData | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        defaultValues: formFields.reduce((acc, field) => {
            acc[field.name] = field.defaultValue || '';
            return acc;
        }, {} as FormData),
    });

    useEffect(() => {
        async function fetchFormData() {
            try {
                const response = await fetch('/api/form-data');
                if (!response.ok) {
                    throw new Error('Failed to load form data');
                }
                const savedData = await response.json();
                reset(savedData);
            } catch (error) {
                console.error('Error loading form data:', error);
            }
        }

        fetchFormData();
    }, [reset]);

    const onSubmit = async (data: FormData) => {
        try {
            const response = await fetch('/api/form-submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to submit form');
            }
            const result = await response.json();
            setSubmittedData(result);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    User Registration Form
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
                        {formFields.map((field) => (
                            <FormField
                                key={field.id}
                                field={field}
                                control={control}
                                errors={errors}
                            />
                        ))}

                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                            >
                                Submit
                            </Button>
                            <Button
                                type="button"
                                variant="outlined"
                                color="secondary"
                                size="large"
                                fullWidth
                                onClick={() => {
                                    reset();
                                    setSubmittedData(null);
                                }}
                            >
                                Reset
                            </Button>
                        </Box>
                    </Box>
                </form>

                {submittedData && (
                    <Alert severity="success" sx={{ mt: 3 }}>
                        <Typography variant="h6">Form Submitted Successfully!</Typography>
                        <pre>{JSON.stringify(submittedData, null, 2)}</pre>
                    </Alert>
                )}
            </Paper>
        </Box>
    );
}
