import qrcode from "qrcode";
import { createCanvas, loadImage } from "canvas";

export const generateQRCode = async (data) => {
  try {
    const qrData = JSON.stringify({
      points: data?.points,
      id: data?.unique_id,
    });

    var opts = {
      errorCorrectionLevel: "H",
      type: "image/jpeg",
      quality: 0.3,
      margin: 10,
    };

    const canvas = createCanvas(400, 430); // Increase the canvas height to accommodate the text
    const ctx = canvas.getContext("2d");

    await qrcode.toCanvas(canvas, qrData, opts);

    // Set white background behind points text
    ctx.fillStyle = "red";
    ctx.fillRect(0, 400, canvas.width, 30);

    // Set red text color
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "red";

    // Draw points text
    ctx.fillText(
      `Points: ${data?.points}`,
      canvas.width / 2,
      canvas.height - 10
    );

    // Convert the canvas to data URL
    const finalQrCodeDataUrl = canvas.toDataURL();

    return finalQrCodeDataUrl;
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to generate QR code");
  }
};
