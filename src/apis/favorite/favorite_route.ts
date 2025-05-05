
import express, { Request } from 'express';
import config from '../../DefaultConfig/config';
import asyncWrapper from '../../middleware/asyncWrapper';
import uploadFile from '../../middleware/fileUploader';
import validateRequest from '../../middleware/validateRequest';
import verifyToken from '../../middleware/verifyToken';
import { favorite_controller } from './favorite_controller';
import { favorite_model } from './favorite_model';
import { favorite_validate } from './favorite_validate';

export const favorite_router = express.Router()

favorite_router
  .post('/favorite/create/:product',
    validateRequest(favorite_validate.create_validation),
    verifyToken(config.USER, undefined, undefined, async (req: Request) => {
      const [is_exist] = await Promise.all([
        favorite_model.find({ product: req.params.product }),
      ])
      return { is_exist }
    }),
    asyncWrapper(favorite_controller.create)
  )

  .get('/favorite/get-all', verifyToken(config.USER), asyncWrapper(favorite_controller.get_all))

  .patch('/favorite/update/:id', verifyToken(config.ADMIN), uploadFile(), asyncWrapper(favorite_controller.update))

  .delete('/favorite/delete/:id', verifyToken(config.ADMIN), asyncWrapper(favorite_controller.delete_favorite))

