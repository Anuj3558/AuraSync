import express from 'express';
import {
  createPosition,
  getPositions,
  getPosition,
  updatePosition,
  deletePosition
} from "../controller/JobController.js"
import { protect } from '../middleware/verifyToken.js';

const Postitionrouter = express.Router();

Postitionrouter.route('/')
  .post(protect,createPosition)
  .get(protect,getPositions);

Postitionrouter.route('/:id')
  .get(protect, getPosition)
  .put( protect,updatePosition)
  .delete(protect, deletePosition);

export default Postitionrouter;