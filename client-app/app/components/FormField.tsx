import { Controller } from 'react-hook-form';
import {
    TextField,
    MenuItem,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    FormHelperText,
} from '@mui/material';

interface FieldConfig {
    id: number;
    name: string;
    fieldType: string;
    minLength?: number;
    maxLength?: number;
    defaultValue?: string;
    required: boolean;
    listOfValues1?: string[];
}

interface FormFieldProps {
    field: FieldConfig;
    control: any;
    errors: any;
}

export default function FormField({ field, control, errors }: FormFieldProps) {
    const getValidationRules = () => {
        const rules: any = {
            required: field.required ? `${field.name} is required` : false,
        };

        if (field.minLength) {
            rules.minLength = {
                value: field.minLength,
                message: `Minimum length is ${field.minLength}`,
            };
        }

        if (field.maxLength) {
            rules.maxLength = {
                value: field.maxLength,
                message: `Maximum length is ${field.maxLength}`,
            };
        }

        if (field.name.toLowerCase().includes('email')) {
            rules.pattern = {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
            };
        }

        return rules;
    };

    const renderField = () => {
        switch (field.fieldType) {
            case 'TEXT':
                return (
                    <Controller
                        name={field.name}
                        control={control}
                        rules={getValidationRules()}
                        render={({ field: controllerField }) => (
                            <TextField
                                {...controllerField}
                                label={field.name}
                                required={field.required}
                                error={!!errors[field.name]}
                                helperText={errors[field.name]?.message}
                                fullWidth
                                variant="outlined"
                            />
                        )}
                    />
                );

            case 'LIST':
                return (
                    <Controller
                        name={field.name}
                        control={control}
                        rules={getValidationRules()}
                        render={({ field: controllerField }) => (
                            <TextField
                                {...controllerField}
                                select
                                label={field.name}
                                required={field.required}
                                error={!!errors[field.name]}
                                helperText={errors[field.name]?.message}
                                fullWidth
                                variant="outlined"
                            >
                                {field.listOfValues1?.map((option, index) => (
                                    <MenuItem key={index} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                );

            case 'RADIO':
                return (
                    <Controller
                        name={field.name}
                        control={control}
                        rules={getValidationRules()}
                        render={({ field: controllerField }) => (
                            <FormControl
                                error={!!errors[field.name]}
                                required={field.required}
                                component="fieldset"
                            >
                                <FormLabel component="legend">{field.name}</FormLabel>
                                <RadioGroup {...controllerField} row>
                                    {field.listOfValues1?.map((option, index) => (
                                        <FormControlLabel
                                            key={index}
                                            value={option}
                                            control={<Radio />}
                                            label={option}
                                        />
                                    ))}
                                </RadioGroup>
                                {errors[field.name] && (
                                    <FormHelperText>{errors[field.name]?.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                );

            default:
                return null;
        }
    };

    return renderField();
}