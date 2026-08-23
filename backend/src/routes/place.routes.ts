import express from 'express';
import { check } from 'express-validator';

import placeController from '../controllers/place.controller';

const router = express.Router();

router.get('/:pid', placeController.getPlaceById);

router.get('/user/:uid', placeController.getPlacesByUserId);

router.post(
  '/',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address')
      .not()
      .isEmpty()
  ],
  placeController.createPlace
);

router.patch(
  '/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  placeController.updatePlace
);

router.delete('/:pid', placeController.deletePlace);

export default router;