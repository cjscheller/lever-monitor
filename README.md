# lever-monitor

NodeJS tool for monitoring changes to Lever job board posts. Supports running on local and remote environments (deployed to remote infrastructure via [Serverless](https://github.com/serverless/serverless)).

### Prerequisites:

- Node + NPM

## Running local

After cloning repo, run locally via:

```bash
node main.js --target ${target}
```

where `${target}` is the full path + query string of a Lever job board (ex: "serverless" or "serverless?team=Engineering"). Note that you can supply multiple `--target` options.

The script will maintain a `postings.json` in the project folder to store hashed version of job board to monitor for changes.

If changes are detected, a desktop notification (implemented via [node-notifier](https://github.com/mikaelbr/node-notifier)) will be triggered. A notification will always appear on first run of a new Lever target.

### Running via cron

To run the tool on a cron:

```bash
# Run at 12pm (local time) M-F
0 12 * * 1-5 node ${PATH/TO/PROJECT} main.js --target ${target1} --target ${target2}
```

## Running via remote

You can optionally deploy the tool to AWS (or another cloud provider) via [Serverless](https://www.serverless.com/).

### Setting up config.json

You'll first need to configure the service. Create a `config.json` file from the example provided:

```bash
cp example-config.json config.json
```

And then specify the following configuration options:

- **targets**: the Lever job board targets to monitor (same as the `--target` option above). For multiple targets, separate with commas (serverless,uipath)
- **emailTo**: the email address for the service to send notifications to via SES. This will need to be configured in SES.
- **emailFrom**: a source email address for the notification emails. This will need to be configured in SES.
- **sesIdentityTo**: an email address that has been verified in SES. More info below.
- **sesIdentityFrom**: an email address on a domain that has been verified in SES. More info below.

### Setting up SES

You can follow [this guide](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses.html) for verifiying an email address to receive email addresses. This will be the email address used for the `emailTo` and `sesIdentityTo` configuration options.

You can follow [this guide](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-domains.html) for verifying a domain. A pre-requisite is that you have a domain registered in Route 53. Once you have verified domains, you can send emails from any address at that domain. This will be the email address used for the `emailFrom` and `sesIdentityFrom` configuration options.

### Deploying

Once configured, you can deploy the application using:

```bash
sls deploy
```

You'll need to provide AWS credentials for authentication - see the [Serverless docs](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/) for more info.

## Contributing

Contributions are **welcome** and will be fully **credited**. See [CONTRIBUTING](/CONTRIBUTING.md) for more details.
