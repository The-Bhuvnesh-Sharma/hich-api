import QRCode from "../models/QRCode.js";
import { generateQRCode } from "../../utils/qrCodeGenerator.js";
import crypto from "crypto";
import { paginationOptions } from "../../utils/paginationOptions.js";

export const createQRCode = async (req, res) => {
  try {
    const { points, numberOfQr = 1 } = req.body;

    if (numberOfQr < 1) {
      return res.status(400).json({ error: "Invalid numberOfQr value" });
    }

    for (let i = 0; i < numberOfQr; i++) {
      const unique_id = crypto.randomBytes(10).toString("hex");
      const qrData = await generateQRCode({ points, unique_id });

      const qrCode = new QRCode({
        points,
        qrData,
        unique_id,
      });

      await qrCode.save();
    }

    res
      .status(201)
      .json({ message: `${numberOfQr} QR Code(s) created successfully` });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ error: "Failed to create QR Code(s)" });
  }
};

// Delete a QR Code
export const deleteQRCode = async (req, res) => {
  const qrcodeId = req.params.qrcodeId;
  try {
    const qrCode = await QRCode.findById(qrcodeId);

    if (!qrCode) {
      return res.status(404).json({ error: "QR Code not found" });
    }

    await qrCode.deleteOne();

    res.json({ message: "QR Code deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete QR Code" });
  }
};

// delete multiple QR codes permanently
export const deleteMultipalQRCode = async (req, res) => {
  try {
    const qrcodeIds = req.body.qrcodeIds;
    const deletedResults = await QRCode.deleteMany({ _id: { $in: qrcodeIds } });

    if (deletedResults.deletedCount === 0) {
      return res.status(404).json({ error: "QR Codes not found" });
    }

    res.json({
      message: `Deleted ${deletedResults.deletedCount} QR Codes successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete all Qr code
export const deleteAllQRCode = async (req, res) => {
  try {
    const deletedResults = await QRCode.deleteMany({});
    res.json({
      message: `Deleted ${deletedResults.deletedCount} QR Codes successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete QR Codes" });
  }
};

// Get all QR Codes
export const getQRCodeList = async (req, res) => {
  const { limit, page, sortBy, searchValue } = req.query;
  const sortField = "createdAt";
  const sortOrder = "desc";
  const query = { deleted: false };

  if (Number(searchValue)) {
    query.points = searchValue;
  }
  try {
    const qrCodes = await QRCode.paginate(
      query,
      paginationOptions(searchValue ? 1 : page, limit, sortField, sortOrder)
    );
    res.json(qrCodes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch QR Codes" });
  }
};
export const getQRCodeListAll = async (req, res) => {
  try {
    const { points } = req.query;
    const filter = { deleted: false };

    if (points) {
      filter.points = parseInt(points);
    }
    const qrCodes = await QRCode.find(filter).sort({ createdAt: -1 }).exec();
    return res.json({ data: qrCodes });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch QR Codes" });
  }
};

export const getQRCodeById = async (req, res) => {
  try {
    const qrcodeId = req.params.qrcodeId;

    // Find the QR code by ID
    const qrcode = await QRCode.findById(qrcodeId);

    if (!qrcode) {
      return res.status(404).json({ message: "QR code not found" });
    }

    res.status(200).json({ qrcode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get QR code" });
  }
};
