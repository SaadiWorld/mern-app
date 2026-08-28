import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

import HttpError from "../utils/http-error";
import getCoordsForAddress from "../utils/location";
import Place from "../models/place.model";
import type { PlaceDocument } from "../models/place.model";
import User from "../models/user.model";
import type { UserDocument } from "../models/user.model";
import mongoose from "mongoose";

const getPlaceById = async (
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

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlaces = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const creatorId =
    typeof req.query.creatorId === "string" ? req.query.creatorId : undefined;

  let allPlaces;
  let userWithPlaces;
  try {
    if (creatorId) {
      // await Place.find({ creator: creatorId })
      userWithPlaces = await User.findById(creatorId).populate<{
        places: PlaceDocument[];
      }>("places");
    } else {
      allPlaces = await Place.find();
    }
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later",
      500,
    );
    return next(error);
  }

  const places = creatorId ? userWithPlaces?.places : allPlaces;

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

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  const sess = await mongoose.startSession();
  try {
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace._id);
    await user.save({ session: sess });
    await sess.commitTransaction();
    await sess.endSession();
  } catch (err) {
    await sess.abortTransaction();
    const error = new HttpError(
      "Creating place failed, please try again.",
      500,
    );
    return next(error);
  } finally {
    await sess.endSession();
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
    place = await Place.findById(placeId).populate<{
      creator: UserDocument;
    }>("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500,
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

  const sess = await mongoose.startSession();
  try {
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places = place.creator.places.filter(
      (placeId) => !placeId.equals(place._id),
    );
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    await sess.abortTransaction();
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500,
    );
    return next(error);
  } finally {
    await sess.endSession();
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
