class NotificationService {
    constructor() {
        // Mock configuration
        this.channels = {
            email: true,
            push: true,
            whatsapp: true
        };
    }

    async sendJobMatchAlert(user, job, matchScore) {
        if (matchScore >= 85) {
            await Promise.all([
                this.sendEmail(user.email, 'High Match Job Alert', `New 🎯 ${matchScore}% Match: ${job.title} at ${job.company}`),
                this.sendPushNotification(user.id, `🎯 ${matchScore}% Match: ${job.title}`),
                this.sendWhatsApp(user.phone, `New job alert: ${job.title} at ${job.company} - ${matchScore}% match! Apply now: ${job.url}`)
            ]);
        } else if (matchScore >= 75) {
            await this.sendEmail(user.email, 'Job Match Alert', `New Match: ${job.title} at ${job.company}`);
        }
    }

    async sendApplicationStatusUpdate(user, application, newStatus) {
        const messages = {
            'screening': '📋 Your application is under review',
            'interview': '🎉 Interview scheduled!',
            'offer': '🎊 Congratulations! You received an offer',
            'rejected': '😔 Application not selected this time'
        };

        const message = messages[newStatus] || `Application status updated to: ${newStatus}`;

        await this.sendEmail(user.email, 'Application Update', message);
        await this.sendPushNotification(user.id, message);
    }

    // Mock Channel Implementations
    async sendEmail(to, subject, body) {
        console.log(`[📧 EMAIL] To: ${to} | Subject: ${subject} | Body: ${body}`);
        return true;
    }

    async sendPushNotification(userId, message) {
        console.log(`[📱 PUSH] User: ${userId} | Message: ${message}`);
        return true;
    }

    async sendWhatsApp(phone, message) {
        console.log(`[💬 WHATSAPP] To: ${phone} | Message: ${message}`);
        return true;
    }
}

module.exports = NotificationService;
