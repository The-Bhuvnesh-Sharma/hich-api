// qrcodeRoutes.js

import express from "express";
import {
  createQRCode,
  getQRCodeList,
  getQRCodeById,
  deleteQRCode,
  getQRCodeListAll,
  deleteMultipalQRCode,
  deleteAllQRCode,
} from "../controllers/qrCodeController.js";
import {
  authenticateToken,
  authorizeRole,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Generate a new QR code
router.post("/", authenticateToken, authorizeRole("admin"), createQRCode);

// Get all QR codes
router.get("/", authenticateToken, getQRCodeList);

// Get all QR codes
router.get("/getQRCodeListAll", authenticateToken, getQRCodeListAll);

// Get a QR code by ID
router.get("/:qrcodeId", authenticateToken, getQRCodeById);

// Delete a QR code by ID
router.delete(
  "/:qrcodeId",
  authenticateToken,
  authorizeRole("admin"),
  deleteQRCode
);
router.delete(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  deleteMultipalQRCode
);
router.delete("/", authenticateToken, authorizeRole("admin"), deleteAllQRCode);

export default router;
