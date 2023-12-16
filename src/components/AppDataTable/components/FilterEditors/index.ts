import SelectFilterEditor from './SelectFilterEditor';
import OptionsHook, { LazyOptionsHook, OptionsDependencies } from 'src/types/OptionsHook';
import { FormikErrors, FormikValues } from 'formik';

export interface CommonFilterEditorProps {
  id: string;
  name: string;
  title: string;
  values: FilterData;
  setFieldValue: (field: string, value: unknown, shouldValidate?: boolean | undefined) => Promise<FormikErrors<FormikValues>> | Promise<void>;
}

export interface SelectFilterEditorProps<T> extends CommonFilterEditorProps {
  optionId: string;
  optionLabel: string;
  options?: OptionsHook<T>;
  lazyOptions?: LazyOptionsHook<T>;
  allowNotChosen?: boolean;
  defaultFilter?: { [key: string]: unknown };
  optionsDependencies?: OptionsDependencies;
}

export type FilterEditorProps<T = unknown> = CommonFilterEditorProps | SelectFilterEditorProps<T>;

export type FilterData = {[key: string]: unknown};

export interface FilterConfig {
  id: string;
  name: string;
  title: string;
  editor: (props: FilterEditorProps<FilterData>) => JSX.Element;
  optionId?: string;
  optionLabel?: string;
  options?: OptionsHook<FilterData>;
  lazyOptions?: LazyOptionsHook<FilterData>;
  allowNotChosen?: boolean;
  defaultFilter?: { [key: string]: unknown };
  optionsDependencies?: (values: FormikValues) => OptionsDependencies;
}

export {
  SelectFilterEditor
};