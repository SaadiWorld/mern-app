import { useParams } from "react-router";

import PlaceList from "../../components/places/PlaceList";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Los Pollos Hermanos",
    description: "One of the most famous fast food chain in new mexico!",
    imageUrl:
      "https://static.wikia.nocookie.net/breakingbad/images/c/cf/C6kZgT2WgAQ_Xzo.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Madrigal Electro Motor",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://static.wikia.nocookie.net/breakingbad/images/e/ec/5x02_Madrigal.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
];

const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
