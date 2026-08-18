export interface Validator {
  type: string;
  val?: number;
}

export interface FormInput {
  value: string;
  isValid: boolean;
}

export type FormInputs = Record<string, FormInput>;

export interface InputProps {
  id: string;
  element: "input" | "textarea";
  type?: string;
  label: string;
  placeholder?: string;
  rows?: number;
  validators: Validator[];
  errorText: string;
  initialValue?: string;
  initialValid?: boolean;
  onInput: (id: string, value: string, isValid: boolean) => void;
}

export interface FormState {
  inputs: FormInputs;
  isValid: boolean;
}
