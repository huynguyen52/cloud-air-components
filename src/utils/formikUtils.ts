import { FormikConfig, FormikErrors, FormikProps, FormikTouched, FormikValues, useFormik } from 'formik';
import { compact, get, isArray, isString } from 'lodash';
import { ChangeEvent, FormEvent, FocusEvent } from 'react';

export interface AppFormikProps {
  onBlur: {
    (e: FocusEvent<unknown, Element>): void;
    <T = unknown>(fieldOrEvent: T): T extends string ? (e: unknown) => void : void;
  };
  onChange: {
    (e: ChangeEvent<unknown>): void;
    <T_1 = string | ChangeEvent<unknown>>(field: T_1): T_1 extends ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
  };
  setFieldValue: (field: string, value: unknown, shouldValidate?: boolean | undefined) => Promise<FormikErrors<FormikValues>> | Promise<void>;
  values: FormikValues;
  defaultValues: FormikValues;
  errors: FormikErrors<FormikValues>;
  touched: FormikTouched<FormikValues>;
  onSubmit: (e?: FormEvent<HTMLFormElement> | undefined) => void;
}

export const formatFormikValues = (values: FormikValues): FormikValues => Object.entries(values).reduce((acc, [ key, value ]) => {
  const transformOnSubmit = get(values, `transformOnSubmit.${key}`);
  if (transformOnSubmit) {
    if (isArray(value)) {
      acc[key] = compact(value).map(item => item && !isString(item) ? transformOnSubmit(item) : item);
    } else {
      acc[key] = value && !isString(value) ? transformOnSubmit(value) : value;
    }
  } else {
    acc[key] = value;
  }
  return acc;
}, {} as FormikValues);

export const emptyArraysAsUndefined = (values: FormikValues): FormikValues => (Object.entries(values).reduce((acc, [ key, value ]) => {
  acc[key] = isArray(value) && value.length === 0 ? undefined : value;
  if (acc[key] === undefined) {
    delete acc[key];
  }
  return acc;
}, {} as FormikValues));

export const prepareFormikProps = (formik: FormikProps<FormikValues>, initialValues: FormikValues) => ({
  onBlur: formik.handleBlur,
  onChange: formik.handleChange,
  setFieldValue: formik.setFieldValue,
  values: formik.values,
  errors: formik.errors,
  touched: formik.touched,
  onSubmit: formik.handleSubmit,
  defaultValues: initialValues
} as AppFormikProps);

export const useAppFormik = (config: FormikConfig<FormikValues>) => useFormik({
  ...config,
  onSubmit: (values, helpers) => {
    const formattedValues = formatFormikValues(values);
    delete formattedValues.transformOnSubmit;
    config.onSubmit(formattedValues, helpers);
  },
});
