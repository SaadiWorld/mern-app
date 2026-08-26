import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

import HttpError from "../utils/http-error";
import getCoordsForAddress from "../utils/location";
import Place from "../models/place.model";

const getPlaceById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const placeId = req.params.pid; // { pid: 'p1' }

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500,
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404,
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) }); // => { place } => { place: place }
};

const getPlaces = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const creatorId =
    typeof req.query.creatorId === "string" ? req.query.creatorId : undefined;

  let places;
  try {
    places = creatorId
      ? await Place.find({ creator: creatorId })
      : await Place.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later",
      500,
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError(
        `Could not find places${creatorId ? ` for the provided user id: ${creatorId}` : ""}.`,
        404,
      ),
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422),
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg",
    creator,
  });

  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500,
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace.toObject({ getters: true }) });
};

const updatePlace = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422,
    );
    return next(error);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500,
    );
    return next(error);
  }

  if (!place) {
    return next(new HttpError("Could not find a place for that id.", 404));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500,
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500,
    );
    return next(error);
  }

  if (!place) {
    return next(new HttpError("Could not find a place for that id.", 404));
  }

  try {
    await place.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500,
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted place." });
};

export default {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
};
