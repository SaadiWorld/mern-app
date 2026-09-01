import Card from "../shared/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../shared/FormElements/Button";
import type { Place } from "../../types/place";
import styles from "./PlaceList.module.css";

interface PlaceListProps {
  items: Place[];
  onDeletePlace?: (deletedPlaceId: string) => void;
}

const PlaceList = ({ items, onDeletePlace }: PlaceListProps) => {
  if (items.length === 0) {
    return (
      <div className={`${styles["place-list"]} center`}>
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className={styles["place-list"]}>
      {items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
