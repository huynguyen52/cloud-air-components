import * as yup from 'yup';

export const validateJsonString = (message: string) => yup
  .string()
  .test('valid-json', message, value => {
    if (!value) {
      return true;
    }
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      return false;
    }
  });