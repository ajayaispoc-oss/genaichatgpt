/**
 * Cloud Functions for handling email notifications
 * Supports both enrollment and contact form submissions
 */

import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";

// CORS configuration
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

interface EnrollmentData {
  name: string;
  email: string;
  phone: string;
  city?: string;
  status: string;
  role?: string;
  experience?: string;
  jobRole?: string;
}

interface ContactData {
  name: string;
  phone: string;
  description: string;
}

/**
 * Sends data to webhook endpoint (e.g., Google Apps Script)
 */
async function sendToWebhook(webhookUrl: string, data: any): Promise<void> {
  logger.info("Calling webhook:", webhookUrl);

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      timestamp: new Date().toISOString(),
    }),
  });

  logger.info("Webhook response status:", response.status);
  const responseText = await response.text();
  logger.info("Webhook response:", responseText);

  // Google Apps Script returns 302 redirects, which is normal
  if (!response.ok && response.status !== 302) {
    throw new Error(`Webhook failed with status ${response.status}: ${responseText}`);
  }
}

/**
 * Cloud Function for handling enrollment form submissions
 */
export const enroll = functions.https.onRequest(async (req, res) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.set(corsHeaders);
    res.status(204).send("");
    return;
  }

  // Set CORS headers for actual request
  res.set(corsHeaders);

  // Only allow POST requests
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const data: EnrollmentData = req.body;

    // Validate required fields
    if (!data.name || !data.email || !data.phone) {
      res.status(400).json({ error: "Missing required fields: name, email, phone" });
      return;
    }

    logger.info("Processing enrollment request:", { name: data.name, email: data.email });

    // Get webhook URL from environment config
    const webhookUrl = process.env.WEBHOOK_URL;

    if (!webhookUrl) {
      logger.warn("WEBHOOK_URL not configured. Email notification will not be sent.");
      res.status(200).json({
        success: true,
        message: "Enrollment received, but email notification is not configured.",
      });
      return;
    }

    // Send to webhook (Google Apps Script)
    await sendToWebhook(webhookUrl, {
      to: "ajay.ai.spoc@gmail.com",
      subject: `New Enrollment Request: ${data.name}`,
      type: "enrollment",
      ...data,
    });

    logger.info("Enrollment notification sent successfully");
    res.status(200).json({
      success: true,
      message: "Enrollment notification sent successfully.",
    });
  } catch (error) {
    logger.error("Error processing enrollment:", error);
    // Return 200 to avoid breaking user experience
    // The enrollment is still saved in Firestore by the client
    res.status(200).json({
      success: true,
      message: "Enrollment received, but there was an error sending the email notification.",
    });
  }
});

/**
 * Cloud Function for handling contact form submissions
 */
export const contact = functions.https.onRequest(async (req, res) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.set(corsHeaders);
    res.status(204).send("");
    return;
  }

  // Set CORS headers for actual request
  res.set(corsHeaders);

  // Only allow POST requests
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const data: ContactData = req.body;

    // Validate required fields
    if (!data.name || !data.phone || !data.description) {
      res.status(400).json({ error: "Missing required fields: name, phone, description" });
      return;
    }

    logger.info("Processing contact inquiry:", { name: data.name, phone: data.phone });

    // Get webhook URL from environment config
    const webhookUrl = process.env.WEBHOOK_URL;

    if (!webhookUrl) {
      logger.warn("WEBHOOK_URL not configured. Email notification will not be sent.");
      res.status(200).json({
        success: true,
        message: "Contact inquiry received, but email notification is not configured.",
      });
      return;
    }

    // Send to webhook (Google Apps Script)
    await sendToWebhook(webhookUrl, {
      to: "ajay.ai.spoc@gmail.com",
      subject: `New Contact Inquiry: ${data.name}`,
      type: "contact",
      ...data,
    });

    logger.info("Contact notification sent successfully");
    res.status(200).json({
      success: true,
      message: "Contact inquiry sent successfully.",
    });
  } catch (error) {
    logger.error("Error processing contact inquiry:", error);
    res.status(200).json({
      success: true,
      message: "Contact inquiry received, but there was an error sending the email notification.",
    });
  }
});
