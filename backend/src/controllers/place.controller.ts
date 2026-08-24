import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import HttpError from '../utils/http-error';
import getCoordsForAddress from '../utils/location';

let dummyPlaces = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
];

const getPlaceById = (req: Request, res: Response, _next: NextFunction): void => {
  const placeId = req.params.pid; // { pid: 'p1' }

  const place = dummyPlaces.find(p => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError('Could not find a place for the provided id.', 404);
  }

  res.json({ place }); // => { place } => { place: place }
};

// function getPlaceById() { ... }
// const getPlaceById = function() { ... }

const getPlaces = (req: Request, res: Response): void => {
  const creatorId = typeof req.query.creatorId === 'string'
    ? req.query.creatorId
    : undefined;

  const places = creatorId
    ? dummyPlaces.filter(place => place.creator === creatorId)
    : dummyPlaces;

  res.json({ places });
};

const createPlace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  // const title = req.body.title;
  const createdPlace = {
    id: randomUUID(),
    title,
    description,
    location: coordinates,
    address,
    creator
  };

  dummyPlaces.push(createdPlace); //unshift(createdPlace)

  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req: Request, res: Response, _next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  const placeIndex = dummyPlaces.findIndex(p => p.id === placeId);
  if (placeIndex === -1) {
    throw new HttpError('Could not find a place for that id.', 404);
  }

  const updatedPlace = dummyPlaces[placeIndex];
  updatedPlace.title = title;
  updatedPlace.description = description;

  dummyPlaces[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req: Request, res: Response, _next: NextFunction): void => {
  const placeId = req.params.pid;
  if (!dummyPlaces.find(p => p.id === placeId)) {
    throw new HttpError('Could not find a place for that id.', 404);
  }
  dummyPlaces = dummyPlaces.filter(p => p.id !== placeId);
  res.status(200).json({ message: 'Deleted place.' });
};

export default {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace
};