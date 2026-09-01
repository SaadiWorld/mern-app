import { useContext, useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate, useParams } from "react-router";

import Input from "../../components/shared/FormElements/Input";
import Button from "../../components/shared/FormElements/Button";
import Card from "../../components/shared/UIElements/Card";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../utils/validators";
import { useForm } from "../../hooks/form-hook";
import styles from "./PlaceForm.module.css";
import ErrorModal from "../../components/shared/UIElements/ErrorModal";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import type { Place } from "../../types/place";
import { API_ENDPOINTS } from "../../api/endpoints";
import LoadingSpinner from "../../components/shared/UIElements/LoadingSpinner";

type PlaceResponse = {
  place: Place;
};

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState<Place>();
  const placeId = useParams().placeId;
  const navigate = useNavigate();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false,
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await sendRequest<PlaceResponse>(
          `${API_ENDPOINTS.places}/${placeId}`,
        );
        setLoadedPlace(response.place);
        setFormData(
          {
            title: {
              value: response.place.title,
              isValid: true,
            },
            description: {
              value: response.place.description,
              isValid: true,
            },
          },
          true,
        );
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  const placeUpdateSubmitHandler = async (
    event: SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${API_ENDPOINTS.places}/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title?.value,
          description: formState.inputs.description?.value,
        }),
        {
          "Content-Type": "application/json",
        },
      );
      navigate("/" + auth.userId + "/places");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form
          className={styles["place-form"]}
          onSubmit={placeUpdateSubmitHandler}
        >
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  );
};
export default UpdatePlace;
