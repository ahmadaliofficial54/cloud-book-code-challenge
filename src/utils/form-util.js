export const getFormItemValidationProps = (field: any, form: any) => {
  if (!form || !field) {
    return {};
  }
  const { touched, errors } = form;

  if (touched && touched[field?.name]) {
    if (errors[field.name]) {
      return {
        validateStatus: "error",
        hasFeedback: true,
        help: form.errors[field.name],
      };
    }
    return {
      validateStatus: "success",
      hasFeedback: true,
    };
  }
  return {};
};
