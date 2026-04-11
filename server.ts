import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Enrollment Email
  app.post("/api/enroll", async (req, res) => {
    const { name, email, phone, city, status, role, experience, jobRole } = req.body;

    // Validate input
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const professionalDetails = status === 'professional' ? `
        Years of Experience: ${experience}
        Existing Job Role: ${jobRole}
    ` : '';

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"GenAI ChatGPT" <noreply@genaichatgpt.com>',
      to: "ajay.ai.spoc@gmail.com",
      subject: `New Enrollment Request: ${name}`,
      text: `
        New Enrollment Details:
        -----------------------
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        City: ${city || "Not provided"}
        Status: ${status}
        ${professionalDetails}
        Current Role: ${role || "Not provided"}
      `,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2563eb;">New Enrollment Request</h2>
          <p>You have received a new training request from your website.</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; width: 150px;">Name:</td>
              <td style="padding: 10px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Email:</td>
              <td style="padding: 10px 0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 10px 0;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">City:</td>
              <td style="padding: 10px 0;">${city || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Status:</td>
              <td style="padding: 10px 0;">${status}</td>
            </tr>
            ${status === 'professional' ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Experience:</td>
              <td style="padding: 10px 0;">${experience} Years</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Existing Role:</td>
              <td style="padding: 10px 0;">${jobRole}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Target Role:</td>
              <td style="padding: 10px 0;">${role || "N/A"}</td>
            </tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #666;">This email was sent automatically from genaichatgpt.com</p>
        </div>
      `,
    };

    try {
      // 1. Try SMTP if configured
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: "Email sent via SMTP." });
      }

      // 2. Try Webhook if configured (e.g. Google Apps Script, Zapier, Formspree)
      if (process.env.WEBHOOK_URL) {
        try {
          console.log("Calling webhook:", process.env.WEBHOOK_URL);
          
          // Using fetch for better redirect handling with Google Apps Script
          const response = await fetch(process.env.WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: "ajay.ai.spoc@gmail.com",
              subject: `New Enrollment Request: ${name}`,
              ...req.body,
              timestamp: new Date().toISOString()
            }),
          });
          
          console.log("Webhook response status:", response.status);
          const responseText = await response.text();
          console.log("Webhook response text:", responseText);

          if (!response.ok && response.status !== 302) {
            throw new Error(`Webhook failed with status ${response.status}: ${responseText}`);
          }

          return res.status(200).json({ success: true, message: "Notification sent via Webhook." });
        } catch (webhookErr: any) {
          console.error("Webhook call failed:", webhookErr.message);
          // Re-throw to be caught by the outer catch
          throw webhookErr;
        }
      }

      // 3. Fallback: Log to console
      console.log("--- NEW ENROLLMENT (NO SMTP/WEBHOOK) ---");
      console.log(mailOptions.text);
      console.log("--------------------------------");
      
      res.status(200).json({ 
        success: true, 
        message: "Enrollment received. (SMTP not configured, data logged to server console)" 
      });
    } catch (error) {
      console.error("Error sending email:", error);
      // We still return 200 because the lead is saved in Firestore (handled by client)
      // and we don't want to break the user experience if email fails.
      res.status(200).json({ 
        success: true, 
        message: "Enrollment received, but there was an error sending the email notification." 
      });
    }
  });

  // API Route for Contact Form
  app.post("/api/contact", async (req, res) => {
    const { name, phone, description } = req.body;

    if (!name || !phone || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"GenAI ChatGPT" <noreply@genaichatgpt.com>',
      to: "ajay.ai.spoc@gmail.com",
      subject: `New Contact Inquiry: ${name}`,
      text: `
        New Contact Inquiry:
        -----------------------
        Name: ${name}
        Phone: ${phone}
        Requirement: ${description}
      `,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2563eb;">New Contact Inquiry</h2>
          <p>You have received a new inquiry from your website contact form.</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; width: 150px;">Name:</td>
              <td style="padding: 10px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 10px 0;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">Requirement:</td>
              <td style="padding: 10px 0;">${description}</td>
            </tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #666;">This email was sent automatically from genaichatgpt.com</p>
        </div>
      `,
    };

    try {
      // 1. Try SMTP
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: "Inquiry sent via SMTP." });
      }

      // 2. Try Webhook
      if (process.env.WEBHOOK_URL) {
        const response = await fetch(process.env.WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: "ajay.ai.spoc@gmail.com",
            subject: `New Contact Inquiry: ${name}`,
            ...req.body,
            timestamp: new Date().toISOString()
          }),
        });
        if (!response.ok && response.status !== 302) {
          throw new Error(`Webhook failed with status ${response.status}`);
        }
        return res.status(200).json({ success: true, message: "Inquiry sent via Webhook." });
      }

      res.status(200).json({ success: true, message: "Inquiry received (logged to console)." });
    } catch (error) {
      console.error("Error sending contact email:", error);
      res.status(200).json({ success: true, message: "Inquiry received, but email notification failed." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("WEBHOOK_URL loaded:", process.env.WEBHOOK_URL ? "Yes" : "No");
  });
}

startServer();
