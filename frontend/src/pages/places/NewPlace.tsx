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
import ImageUpload from "../../components/shared/FormElements/ImageUpload";

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
      image: {
        value: null,
        isValid: false,
      },
    },
    false,
  );

  const placeSubmitHandler = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = formState.inputs.title?.value;
    const description = formState.inputs.description?.value;
    const address = formState.inputs.address?.value;
    const image = formState.inputs.image?.value;
    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof address !== "string" ||
      !(image instanceof File) ||
      !userId
    ) {
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("creator", userId);
    formData.append("image", image);

    try {
      await sendRequest(API_ENDPOINTS.places, "POST", formData);
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
        <div className={styles["place-form__image-upload"]}>
          <ImageUpload
            center
            id="image"
            onInput={inputHandler}
            errorText="Please provide an image."
          />
        </div>
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
