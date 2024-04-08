import React from 'react';
import { useFormState } from 'react-dom';

interface FormState {
  name: string;
  email: string;
}

const handleSubmit = async (
  previousState: FormState | undefined,
  formData: FormData
): Promise<FormState> => {
  // The previousState variable contains the last saved form state
  console.log('previous saved state ', previousState);
  // Use get to extract a value from a FormData object
  const name = formData.get('name');
  const email = formData.get('email');
  // The returned value will become our new formState
  return { name, email };
};

const ContactForm: React.FC = () => {
  const [formState, formAction] = useFormState(handleSubmit, {
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
