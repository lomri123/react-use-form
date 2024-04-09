import React from 'react';
import useForm from './use-form';
import * as yup from 'yup';

interface FormState {
  name: string;
  email: string;
}

const handleSubmit = async (
  data: FormState,
  errors: Record<keyof FormState, string>
) => {
  console.log('formData', data);
  console.log('errors', errors);
};

const validationSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Too short!')
    .max(50, 'Too long!')
    .required('Required'),
  email: yup.string().email('Invalid email').required('Required'),
});

const ContactForm: React.FC = () => {
  const { formData, errors, register, formAction } = useForm<FormState>(
    handleSubmit,
    {
      name: '',
      email: '',
    },
    validationSchema
  );

  return (
    <>
      formState: {JSON.stringify(formData)}
      <form action={formAction}>
        <input {...register('name')} />
        {errors.name && <div className='error-message'>{errors.name}</div>}
        <input {...register('email')} />
        {errors.email && <div className='error-message'>{errors.email}</div>}
        <input type='submit' />
      </form>
    </>
  );
};

export default ContactForm;
