import { useContext, type SubmitEvent } from "react";
import Input from "../../components/shared/FormElements/Input";
import Button from "../../components/shared/FormElements/Button";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../utils/validators";
import { useForm } from "../../hooks/form-hook";
import styles from "./PlaceForm.module.css";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import { API_ENDPOINTS } from "../../api/endpoints";
import ErrorModal from "../../components/shared/UIElements/ErrorModal";
import LoadingSpinner from "../../components/shared/UIElements/LoadingSpinner";
import { useNavigate } from "react-router";

const NewPlace = () => {
  const { userId } = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false,
  );

  const placeSubmitHandler = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await sendRequest(
        API_ENDPOINTS.places,
        "POST",
        JSON.stringify({
          title: formState.inputs.title?.value,
          description: formState.inputs.description?.value,
          address: formState.inputs.address?.value,
          creator: userId,
        }),
        {
          "Content-Type": "application/json",
        },
      );
      navigate("/");
    } catch (err) {
      // Error handling is done by the useHttpClient hook
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className={styles["place-form"]} onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
