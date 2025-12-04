import nodemailer from 'nodemailer';

class EmailService {
    constructor() {
        this.transporter = null;
        this.init();
    }

    init() {
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            this.transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                port: process.env.EMAIL_PORT || 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            console.log('📧 Email Service: SMTP Configured');
        } else {
            console.log('⚠️ Email Service: SMTP Not Configured. Running in DEV MODE (Logging emails to console).');
        }
    }

    async sendEmail(to, subject, html) {
        if (!this.transporter) {
            console.log('\n========== 📧 DEV MODE EMAIL LOG ==========');
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log('-------------------------------------------');
            console.log(html.replace(/<[^>]*>/g, '')); // Strip HTML for console readability
            console.log('===========================================\n');
            return { success: true, message: 'Dev mode: Email logged' };
        }

        try {
            const info = await this.transporter.sendMail({
                from: `"JoBika AI" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                html
            });
            console.log('✅ Email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Email send failed:', error);
            return { success: false, error: error.message };
        }
    }

    async sendWelcomeEmail(user) {
        const subject = 'Welcome to JoBika! 🚀';
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #10b981;">Welcome to JoBika, ${user.name}!</h1>
                <p>We're thrilled to have you on board. JoBika is your AI-powered career assistant designed to land you your dream job faster.</p>
                
                <h3>Here's what you can do next:</h3>
                <ul>
                    <li>📄 <strong>Upload your Resume</strong> to get an instant AI score.</li>
                    <li>🔍 <strong>Search for Jobs</strong> and let our AI match you.</li>
                    <li>⚡ <strong>Auto-Apply</strong> to jobs with a single click.</li>
                    <li>🤖 <strong>Chat with Orion</strong>, your personal career coach.</li>
                </ul>

                <p>Get started now by logging into your dashboard!</p>
                
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
                
                <p style="margin-top: 30px; font-size: 12px; color: #666;">Best regards,<br>The JoBika Team</p>
            </div>
        `;
        return this.sendEmail(user.email, subject, html);
    }

    async sendJobAlert(user, jobs) {
        const subject = `🔥 ${jobs.length} New Jobs Match Your Profile`;
        const jobList = jobs.map(job => `
            <div style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <h3 style="margin: 0; color: #333;">${job.title}</h3>
                <p style="margin: 5px 0; color: #666;">${job.company} • ${job.location}</p>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/job/${job.id}" style="color: #10b981; text-decoration: none;">View Job</a>
            </div>
        `).join('');

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">New Job Matches Found!</h2>
                <p>Hi ${user.name}, we found some new opportunities that match your skills and preferences.</p>
                
                ${jobList}
                
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="display: block; text-align: center; margin-top: 20px; background-color: #10b981; color: white; padding: 10px; text-decoration: none; border-radius: 5px;">View All Matches</a>
            </div>
        `;
        return this.sendEmail(user.email, subject, html);
    }

    async sendApplicationUpdate(user, application) {
        const subject = `Application Update: ${application.role} at ${application.company}`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Application Status Update</h2>
                <p>Hi ${user.name},</p>
                <p>Your application for <strong>${application.role}</strong> at <strong>${application.company}</strong> has been updated.</p>
                
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <strong>New Status:</strong> <span style="color: #10b981; font-weight: bold;">${application.status}</span>
                </div>

                <p>Good luck!</p>
                <p style="font-size: 12px; color: #666;">JoBika AI</p>
            </div>
        `;
        return this.sendEmail(user.email, subject, html);
    }
}

export default new EmailService();
