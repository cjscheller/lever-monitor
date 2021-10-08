class Notifier {

    async notify(target) {
        if (process.env.LEVER_RUNTIME === "remote") {
            return await this.notifySES(target);
        } else {
            return this.notifyDesktop(target);
        }
    }

    notifyDesktop(target) {
        const notifier = require('node-notifier');

        notifier.notify({
            title: "Lever: Job posts have been updated.",
            message: `The job posts at https://jobs.lever.co/${target} have changed. Click to view.`,
            open: `https://jobs.lever.co/${target}`,
            actions: "View"
        })

        notifier.on('click', (obj, options) => {
            const spawn = require('child_process').spawn;
            const cmd = spawn('open', [`https://jobs.lever.co/${target}`]);
        });
    }

    async notifySES(target) {
        const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");

        const body = `
            <div>
                The job posts at https://jobs.lever.co/${target} have changed. 
                <a href="https://jobs.lever.co/${target}">Click to view.</a>
            </div>
        `;

        const params = {
            Content: {
                Simple: {
                    Body: {
                        Html: {
                            Data: body,
                        },
                        Text: {
                            Data: body,
                        }
                    },
                    Subject: {
                        Data: "Lever Monitor: Job postings have been updated",
                    }
                },
            },
            Destination: {
                ToAddresses: [process.env.EMAIL_TO]
            },
            FromEmailAddress: process.env.EMAIL_FROM,
        };

        try {
            const client = new SESv2Client({ region: process.env.AWS_REGION });
            await client.send(new SendEmailCommand(params));
            return true;
        } catch (e) {
            console.error(e)
            return false;
        }
    }
}

module.exports = new Notifier();