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
import ImageUpload from "../../components/shared/FormElements/ImageUpload";

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
          image: undefined,
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
          image: {
            value: null,
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

    const emailValue = formState.inputs.email?.value;
    const passwordValue = formState.inputs.password?.value;

    try {
      let response: AuthResponse;

      if (isLoginMode) {
        if (
          typeof emailValue !== "string" ||
          typeof passwordValue !== "string"
        ) {
          return;
        }
        response = await sendRequest<AuthResponse>(
          API_ENDPOINTS.auth.login,
          "POST",
          JSON.stringify({ email: emailValue, password: passwordValue }),
          { "Content-Type": "application/json" },
        );
      } else {
        const nameValue = formState.inputs.name?.value;
        const imageValue = formState.inputs.image?.value;
        if (
          typeof nameValue !== "string" ||
          typeof emailValue !== "string" ||
          typeof passwordValue !== "string" ||
          !(imageValue instanceof File)
        ) {
          return;
        }

        const formData = new FormData();
        formData.append("email", emailValue);
        formData.append("name", nameValue);
        formData.append("password", passwordValue);
        formData.append("image", imageValue);

        response = await sendRequest<AuthResponse>(
          API_ENDPOINTS.auth.signup,
          "POST",
          formData,
        );
      }
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
          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              errorText="Please provide an image."
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
