import * as Yup from 'yup';

export const profileValidationSchema = 
Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),

  lastName: Yup.string().required('Last Name is required'),

  email: Yup.string().email('Invalid email address').required('Email is required'),

  phoneNumber: Yup.string()
    .matches(/^\d{11}$/, 'Phone number must be exactly 11 digits')
    .required('Phone number is required'),

    password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .nullable()
    .transform((value) => (value === '' ? null : value)),

    confirmPassword: Yup.string().test('valid-password', 'Password does not match', function (value) {
      const password = this.parent.password;
    
      if (password === value || (!password && !value)) {
        return true;
      }
      return false;
    }),    
});
