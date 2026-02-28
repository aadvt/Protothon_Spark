'use server'

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
})

export async function scheduleInterviewAction(candidateName: string, candidateEmail: string, date: string, time: string, notes: string) {
  try {
    // 1. Send Email to Candidate
    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME || 'Spark'}" <${process.env.MAIL_FROM}>`,
      to: candidateEmail,
      subject: `Interview Scheduled: ${candidateName}`,
      text: `Hello ${candidateName},\n\nYour interview has been scheduled for ${date} at ${time}.\n\nNotes: ${notes}\n\nGood luck!`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Interview Scheduled</h2>
          <p>Hello <strong>${candidateName}</strong>,</p>
          <p>Your interview has been scheduled successfully.</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Notes:</strong> ${notes || 'N/A'}</p>
          </div>
          <p>Best regards,<br/>Recruitment Team</p>
        </div>
      `,
    })

    return { success: true }
  } catch (error: any) {
    console.error('Email sending failed:', error)
    return { success: false, error: 'Failed to send notification email. Please check SMTP settings.' }
  }
}
