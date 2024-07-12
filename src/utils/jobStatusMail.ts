import nodemailer from 'nodemailer';
import config from '../infrastructure/config';


const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.EMAIL,
        pass: config.EMAIL_PASSWORD,
    },
});

export const acceptJobMail = async (to: string, companyName: string, position: string): Promise<void> => {
    const mailOptions = {
        from: config.EMAIL,
        to,
        subject: 'Job Application Accepted',
        html: `
            <h1>Congratulations!</h1>
            <p>Your job application has been accepted by <strong>${companyName}</strong>.</p>
            <p>Position: <strong>${position}</strong></p>
            <p>We will get in touch with you soon with further details.</p>
            <p>Best regards,<br />The Recruitment Team</p>
        `,
    };

    try {
        await transport.sendMail(mailOptions);
        console.log(`Acceptance email sent to ${to}`);
    } catch (error) {
        console.error(`Error sending acceptance email: ${error}`);
    }
};

export const rejectJobMail = async (to: string, companyName:string, position:string):Promise<void>=>{
    const mailOptions = {
        from: config.EMAIL,
        to,
        subject: "Job Application Rejected",
        html: `
            <p>Your job application for ${position} has been rejected by <strong>${companyName}</strong>.</p>`,
    }
    try {
        await transport.sendMail(mailOptions);
        console.log(`Rejection email sent to ${to}`);
    } catch (error) {
        console.error(`Error sending acceptance email: ${error}`);
    }
}