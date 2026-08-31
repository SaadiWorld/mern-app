import { useCallback, useReducer } from "react";

export type FormInput = {
  value: string;
  isValid: boolean;
};

export type FormInputs = Record<string, FormInput | undefined>;

type FormState = {
  inputs: FormInputs;
  isValid: boolean;
};

type FormAction =
  | {
      type: "INPUT_CHANGE";
      inputId: string;
      value: string;
      isValid: boolean;
    }
  | {
      type: "SET_DATA";
      inputs: FormInputs;
      formIsValid: boolean;
    };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "INPUT_CHANGE": {
      let formIsValid = true;

      for (const inputId in state.inputs) {
        const currentInput = state.inputs[inputId];

        if (!currentInput) {
          continue;
        }

        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && currentInput.isValid;
        }
      }

      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    }
    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };
    default:
      return state;
  }
};

export const useForm = (
  initialInputs: FormInputs,
  initialFormValidity: boolean,
) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  const inputHandler = useCallback(
    (id: string, value: string, isValid: boolean) => {
      dispatch({
        type: "INPUT_CHANGE",
        value,
        isValid,
        inputId: id,
      });
    },
    [],
  );

  const setFormData = useCallback(
    (inputData: FormInputs, formValidity: boolean) => {
      dispatch({
        type: "SET_DATA",
        inputs: inputData,
        formIsValid: formValidity,
      });
    },
    [],
  );

  return [formState, inputHandler, setFormData] as const;
};
