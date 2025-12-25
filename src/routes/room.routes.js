/**
 * 📜 ROOM ROUTES
 * * PURPOSE:
 * Maps URL paths to specific Controller functions for Rooms.
 * * SCOPE:
 * - GET /  ->  roomController.listRooms
 * * RELATION:
 * - Imports: 'src/controllers/rooms.controller.js'
 * - Imported by: 'src/app.js'
 */

// =======================================
//      HEJ @ANDRÉ HEATONLOVER PONTÉN
//      START PÅ APIANROPET ÄR:
//      -----------------------
//      | localhost/api/rooms |
//      -----------------------
// =======================================

import express from "express";
import * as roomController from "../controllers/room.controller.js";
import { authenticationMiddleware } from "../middleware/authentication.middleware.js";
import { authorize } from "../middleware/authorization.middleware.js";
import { ROLES } from "../constants/roles.js";

const roomsRouter = express.Router();

roomsRouter.get("/", authenticationMiddleware, roomController.listRooms);
roomsRouter.post(
  "/",
  authenticationMiddleware,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  roomController.createRoom
);

// Room-specific
roomsRouter.get("/:id", authenticationMiddleware, roomController.getRoom);
roomsRouter.put(
  "/:id",
  authenticationMiddleware,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  roomController.updateRoom
);
roomsRouter.delete(
  "/:id",
  authenticationMiddleware,
  authorize(ROLES.ADMIN),
  roomController.deleteRoom
);

// Assets under a room
//roomsRouter.get("/:id/assets", roomController.listAssetsByRoom);
roomsRouter.post(
  "/:id/assets",
  authenticationMiddleware,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  roomController.createRoomAsset
);

//// Assets by id
roomsRouter.put(
  "/assets/:assetId",
  authenticationMiddleware,
  authorize(ROLES.TEACHER, ROLES.ADMIN),
  roomController.updateRoomAsset
);
roomsRouter.delete(
  "/assets/:assetId",
  authenticationMiddleware,
  authorize(ROLES.ADMIN),
  roomController.deleteRoomAsset
);

export default roomsRouter;
