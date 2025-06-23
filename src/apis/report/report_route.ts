
import express from 'express';
import config from '../../DefaultConfig/config';
import asyncWrapper from '../../middleware/asyncWrapper';
import uploadFile from '../../middleware/fileUploader';
import verifyToken from '../../middleware/verifyToken';
import { report_controller } from './report_controller';

export const report_router = express.Router()

report_router
  .post('/report/create', verifyToken(config.USER), asyncWrapper(report_controller.create))

  .get('/report/get-all', asyncWrapper(report_controller.get_all))

  .patch('/report/update/:id', verifyToken(config.ADMIN), uploadFile(), asyncWrapper(report_controller.update))

  .delete('/report/delete/:id', verifyToken(config.ADMIN), asyncWrapper(report_controller.delete_report))

