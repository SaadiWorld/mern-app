import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import HttpError from '../utils/http-error';
import getCoordsForAddress from '../utils/location';
import Place from '../models/place.model';
import type { PlaceDocument } from '../models/place.model';
import User from '../models/user.model';
import type { UserDocument } from '../models/user.model';
import mongoose from 'mongoose';
import { unlink } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { uploadDirectory } from '../middlewares/file-upload';

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
      'Something went wrong, could not find a place.',
      500,
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      'Could not find a place for the provided id.',
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
    typeof req.query.creatorId === 'string' ? req.query.creatorId : undefined;

  let allPlaces;
  let userWithPlaces;
  try {
    if (creatorId) {
      // await Place.find({ creator: creatorId })
      userWithPlaces = await User.findById(creatorId).populate<{
        places: PlaceDocument[];
      }>('places');
    } else {
      allPlaces = await Place.find();
    }
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later',
      500,
    );
    return next(error);
  }

  const places = creatorId ? userWithPlaces?.places : allPlaces;

  if (!places || places.length === 0) {
    return next(
      new HttpError(
        `Could not find places${creatorId ? ` for the provided user id: ${creatorId}` : ''}.`,
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
      new HttpError('Invalid inputs passed, please check your data.', 422),
    );
  }

  if (!req.file) {
    return next(new HttpError('Please provide an image.', 422));
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
    image: `/uploads/images/${req.file.filename}`,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
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
      'Creating place failed, please try again.',
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
      'Invalid inputs passed, please check your data.',
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
      'Something went wrong, could not update place.',
      500,
    );
    return next(error);
  }

  if (!place) {
    return next(new HttpError('Could not find a place for that id.', 404));
  }

  if (place.creator.toString() !== req.userData?.userId) {
    return next(new HttpError('You are not allowed to edit this place.', 401));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
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
    }>('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500,
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find place for this id.', 404);
    return next(error);
  }

  if (place.creator.id !== req.userData?.userId) {
    return next(
      new HttpError('You are not allowed to delete this place.', 401),
    );
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
      'Something went wrong, could not delete place.',
      500,
    );
    return next(error);
  } finally {
    await sess.endSession();
  }

  // The database stores a URL path, while unlink needs an absolute filesystem path.
  // basename also prevents a stored value from escaping the upload directory.
  if (place.image.includes('/uploads/images/')) {
    const imagePath = resolve(uploadDirectory, basename(place.image));
    try {
      await unlink(imagePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error('Error deleting image:', error);
      }
    }
  }

  res.status(200).json({ message: 'Deleted place.' });
};

export default {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
};
