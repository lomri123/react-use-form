import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

interface FormProps<T> {
  formAction: () => void;
  pending: boolean;
  formState: T;
  submitCount: number;
}

function useForm<T>(
  handleSubmit: (data: T) => void,
  initialState: T
): FormProps<T> {
  const [formState, formAction] = useFormState<T>(onSubmit, initialState);
  const { pending } = useFormStatus();
  const [submitCount, setSubmitCount] = useState(0);

  async function onSubmit(previousState: T, formData: FormData): Promise<T> {
    setSubmitCount((count) => count + 1);
    const fieldValues = Object.fromEntries(formData) as T;
    await handleSubmit(fieldValues);
    return fieldValues;
  }

  return {
    formAction,
    pending,
    formState,
    submitCount,
  };
}

export default useForm;
