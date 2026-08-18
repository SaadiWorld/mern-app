import type { SubmitEvent } from "react";
import Input from "../../components/shared/FormElements/Input";
import Button from "../../components/shared/FormElements/Button";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../utils/validators";
import { useForm } from "../../hooks/form-hook";
import styles from "./PlaceForm.module.css";

const NewPlace = () => {
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

  const placeSubmitHandler = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formState.inputs); // send this to the backend!
  };

  return (
    <form className={styles["place-form"]} onSubmit={placeSubmitHandler}>
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
  );
};

export default NewPlace;
