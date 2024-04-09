import React from 'react';
import useForm from './use-form';

interface FormState {
  name: string;
  email: string;
}

const handleSubmit = async (
  data: FormState // formData is now a regular data
) => {
  console.log('formData', data);
};

const ContactForm: React.FC = () => {
  const { formState, formAction } = useForm<FormState>(handleSubmit, {
    name: '',
    email: '',
  });

  return (
    <>
      formState: {JSON.stringify(formState)}
      <form action={formAction}>
        <input name='name' />
        <input name='email' />
        <input type='submit' />
      </form>
    </>
  );
};

export default ContactForm;
