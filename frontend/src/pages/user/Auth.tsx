import { useContext, useState } from "react";
import type { SubmitEvent } from "react";

import Card from "../../components/shared/UIElements/Card";
import Input from "../../components/shared/FormElements/Input";
import Button from "../../components/shared/FormElements/Button";
import ErrorModal from "../../components/shared/UIElements/ErrorModal";
import LoadingSpinner from "../../components/shared/UIElements/LoadingSpinner";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../utils/validators";
import { useForm } from "../../hooks/form-hook";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";
import { API_ENDPOINTS } from "../../api/endpoints";
import styles from "./Auth.module.css";

type AuthResponse = {
  user: {
    id: string;
  };
  message: string;
};

const Auth = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false,
  );

  const switchModeHandler = () => {
    const emailIsValid = formState.inputs.email?.isValid ?? false;
    const passwordIsValid = formState.inputs.password?.isValid ?? false;

    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        emailIsValid && passwordIsValid,
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false,
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailValue = formState.inputs.email?.value ?? "";
    const passwordValue = formState.inputs.password?.value ?? "";
    const endpoint = isLoginMode
      ? API_ENDPOINTS.auth.login
      : API_ENDPOINTS.auth.signup;
    const payload = isLoginMode
      ? {
          email: emailValue,
          password: passwordValue,
        }
      : {
          name: formState.inputs.name?.value ?? "",
          email: emailValue,
          password: passwordValue,
        };

    try {
      const response = await sendRequest<AuthResponse>(
        endpoint,
        "POST",
        JSON.stringify(payload),
        {
          "Content-Type": "application/json",
        },
      );
      auth.login(response.user.id);
    } catch (_err) {
      // handled by hook
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className={styles.authentication}>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
