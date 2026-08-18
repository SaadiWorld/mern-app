export interface Location {
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  address: string;
  location: Location;
  creator: string;
}

export interface PlaceItemData {
  id: string;
  image: string;
  title: string;
  description: string;
  address: string;
  creatorId: string;
  coordinates: Location;
}
