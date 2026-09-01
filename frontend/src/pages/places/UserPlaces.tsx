import { useParams } from "react-router";

import PlaceList from "../../components/places/PlaceList";
import LoadingSpinner from "../../components/shared/UIElements/LoadingSpinner";
import ErrorModal from "../../components/shared/UIElements/ErrorModal";
import { useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import { API_ENDPOINTS } from "../../api/endpoints";
import type { Place } from "../../types/place";

type PlacesResponse = {
  places: Place[];
};

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState<Place[]>([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await sendRequest<PlacesResponse>(
          `${API_ENDPOINTS.places}?creatorId=${userId}`,
        );
        setLoadedPlaces(response.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId: string) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId),
    );
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </>
  );
};

export default UserPlaces;
