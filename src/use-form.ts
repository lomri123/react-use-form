import { ChangeEvent, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { ObjectSchema, ValidationError, reach } from 'yup';

interface FormProps<T> {
  formAction: () => void;
  pending: boolean;
  formState: T;
  formData: T;
  submitCount: number;
  touched: Record<keyof T, boolean>;
  errors: Record<keyof T, string>;
  register: (name: keyof T) => {
    name: keyof T;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: ChangeEvent<HTMLInputElement>) => void;
  };
}

function useForm<T extends Record<string, any>>(
  handleSubmit: (data: T, errors: Record<keyof T, string>) => void,
  initialState: T,
  validationSchema?: ObjectSchema<T>
): FormProps<T> {
  const [formState, formAction] = useFormState<T>(onSubmit, initialState);
  const { pending } = useFormStatus();
  const [submitCount, setSubmitCount] = useState(0);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    {} as Record<keyof T, boolean>
  );
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState<Record<keyof T, string>>(
    {} as Record<keyof T, string>
  );

  const validate = async (data: T) => {
    let errors = {};
    try {
      await validationSchema?.validate(data, { abortEarly: false });
    } catch (err) {
      if (err instanceof ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) newErrors[error.path] = error.message;
        });
        errors = newErrors;
      }
    }
    return errors as Record<keyof T, string>;
  };

  async function onSubmit(previousState: T, formData: FormData): Promise<T> {
    setSubmitCount((count) => count + 1);
    const fieldValues = Object.fromEntries(formData) as T;
    const errors = await validate(fieldValues);
    setErrors(errors);
    await handleSubmit(fieldValues, errors);
    return fieldValues;
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (validationSchema) {
      const fieldSchema = validationSchema.pick([name]);
      fieldSchema
        .validate({ [name]: value })
        .then(() => setErrors((currErrors) => ({ ...currErrors, [name]: '' })))
        .catch((err) =>
          setErrors((currErrors) => ({ ...currErrors, [name]: err.message }))
        );
    }
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const register = (name: keyof T) => ({
    name,
    onChange: handleChange,
    onBlur: handleBlur,
  });

  return {
    pending,
    formState,
    submitCount,
    touched,
    errors,
    formData,
    formAction,
    register,
  };
}

export default useForm;
