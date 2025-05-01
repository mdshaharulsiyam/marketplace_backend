
import express from 'express';
import config from '../../DefaultConfig/config';
import asyncWrapper from '../../middleware/asyncWrapper';
import uploadFile from '../../middleware/fileUploader';
import verifyToken from '../../middleware/verifyToken';
import { division_controller } from './division_controller';

export const division_router = express.Router()

division_router
  .post('/division/create', verifyToken(config.ADMIN), asyncWrapper(division_controller.create))

  .get('/division/get-all', asyncWrapper(division_controller.get_all))

  .patch('/division/update/:id', verifyToken(config.ADMIN), uploadFile(), asyncWrapper(division_controller.update))

  .delete('/division/delete/:id', verifyToken(config.ADMIN), asyncWrapper(division_controller.delete_division))

