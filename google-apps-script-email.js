/**
 * Google Apps Script for GenAI ChatGPT Email Notifications
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com
 * 2. Click "New Project"
 * 3. Paste this entire code
 * 4. Click "Deploy" > "New deployment"
 * 5. Type: "Web app"
 * 6. Execute as: "Me"
 * 7. Who has access: "Anyone"
 * 8. Click "Deploy"
 * 9. Copy the Web App URL
 * 10. Update VITE_WEBHOOK_URL in your .env and GitHub secrets
 */

function doGet(e) {
  // If parameters are passed, send an email notification
  if (e.parameter && e.parameter.name) {
    try {
      const name = e.parameter.name || 'Unknown';
      const email = e.parameter.email || '';
      const phone = e.parameter.phone || '';
      const city = e.parameter.city || '';
      const status = e.parameter.status || '';
      const experience = e.parameter.experience || '';
      const jobRole = e.parameter.jobRole || '';
      const description = e.parameter.description || '';
      const type = e.parameter._type || 'contact';
      const subject = e.parameter._subject || `New Submission from ${name}`;

      let htmlBody = '';
      let textBody = '';

      if (type === 'enroll') {
        htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #2563eb;">New Enrollment Request</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; width: 150px;">Name:</td><td>${name}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>${phone}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">City:</td><td>${city || 'N/A'}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Status:</td><td>${status}</td></tr>
              ${status === 'professional' ? `<tr><td style="padding: 8px 0; font-weight: bold;">Experience:</td><td>${experience} Years</td></tr><tr><td style="padding: 8px 0; font-weight: bold;">Current Role:</td><td>${jobRole}</td></tr>` : ''}
            </table>
            <p style="font-size: 12px; color: #666; margin-top: 20px;">Sent from genaichatgpt.com</p>
          </div>`;
        textBody = `New Enrollment Request\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCity: ${city || 'N/A'}\nStatus: ${status}\n${status === 'professional' ? `Experience: ${experience} Years\nCurrent Role: ${jobRole}\n` : ''}`;
      } else {
        htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #2563eb;">New Contact Inquiry</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; width: 150px;">Name:</td><td>${name}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>${phone}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Requirement:</td><td>${description}</td></tr>
            </table>
            <p style="font-size: 12px; color: #666; margin-top: 20px;">Sent from genaichatgpt.com</p>
          </div>`;
        textBody = `New Contact Inquiry\nName: ${name}\nPhone: ${phone}\nRequirement: ${description}`;
      }

      MailApp.sendEmail({
        to: 'ajay.ai.spoc@gmail.com',
        subject: subject,
        body: textBody,
        htmlBody: htmlBody
      });

      return ContentService.createTextOutput(
        JSON.stringify({ status: 'success', message: 'Email sent successfully' })
      ).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'error', message: error.toString() })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Default health check response
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'success', message: 'Webhook is active.' })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    // Parse the request
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      data = e.parameter;
    }

    Logger.log('Received data: ' + JSON.stringify(data));

    // Extract fields
    const name = data.name || 'Unknown';
    const email = data.email || '';
    const phone = data.phone || '';
    const city = data.city || '';
    const status = data.status || '';
    const role = data.role || '';
    const experience = data.experience || '';
    const jobRole = data.jobRole || '';
    const description = data.description || '';
    const subject = data.subject || data._subject || `New Submission from ${name}`;
    const to = data.to || 'ajay.ai.spoc@gmail.com';

    // Determine if it's enrollment or contact
    const isEnrollment = !!email; // Enrollment has email field

    // Build email body
    let htmlBody = '';
    let textBody = '';

    if (isEnrollment) {
      // Enrollment email
      htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2563eb;">New Enrollment Request</h2>
          <p>You have received a new training enrollment request.</p>
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
              <td style="padding: 10px 0;">${city || 'N/A'}</td>
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
              <td style="padding: 10px 0; font-weight: bold;">Current Role:</td>
              <td style="padding: 10px 0;">${jobRole}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Target Role:</td>
              <td style="padding: 10px 0;">${role || 'N/A'}</td>
            </tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #666;">Sent from genaichatgpt.com</p>
        </div>
      `;

      textBody = `
New Enrollment Request
----------------------
Name: ${name}
Email: ${email}
Phone: ${phone}
City: ${city || 'N/A'}
Status: ${status}
${status === 'professional' ? `Experience: ${experience} Years\nCurrent Role: ${jobRole}\n` : ''}Target Role: ${role || 'N/A'}

---
Sent from genaichatgpt.com
      `;
    } else {
      // Contact inquiry email
      htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2563eb;">New Contact Inquiry</h2>
          <p>You have received a new inquiry from your website.</p>
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
          <p style="font-size: 12px; color: #666;">Sent from genaichatgpt.com</p>
        </div>
      `;

      textBody = `
New Contact Inquiry
-------------------
Name: ${name}
Phone: ${phone}
Requirement: ${description}

---
Sent from genaichatgpt.com
      `;
    }

    // Send email
    MailApp.sendEmail({
      to: to,
      subject: subject,
      body: textBody,
      htmlBody: htmlBody
    });

    Logger.log('Email sent successfully to: ' + to);

    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'success',
        message: 'Email sent successfully'
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.toString());

    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'error',
        message: error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
