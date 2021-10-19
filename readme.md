# PERSTAT Slack Bot

This simple bot sends a daily PERSAT message to users and prompts them to check in. At a later scheduled time it then collects the responses and rolls them up into a report.


## Running Locally
The build and debug tools are tuned for VS Code. I don't have an intentions of porting it to another development environment yet.

Make sure you have [Node.js](https://nodejs.org/en/) installed and that its in your `PATH` variable. Open a terminal in VS Code or elsewhere and test it with `node -v`. If it fails after the install then time to conduct some remedial Google-Fu.

Install the node modules: `npm install`

Create a `.env` file in the root of the project and input the following environment variables:

```
SLACK_SIGNING_SECRET="<string>"
SLACK_BOT_TOKEN="<string>"
SLACK_PERSTAT_BOT_SOCKET_TOKEN="<string>"

DATABASE_URL="<string>"

INITIAL_HOUR=<int>
INITIAL_MIN=<int>
REMINDER_HOUR=<int>
REMINDER_MIN=<int>
REPORT_HOUR=<int>
REPORT_MIN=<int>

PERSTAT_CHANNEL_ID="<string>"
ENVIRONMENT="<string>"
DISABLE_DAY_RANGE="<string>"
SEND_ONLY_TO_USER="<string>"
DISABLE_REPORT="<string>"
```

This file will be excluded by the `.gitignore` because committing env variables is bad, mmmkay?

Open the debugger tab in VS Code (the one with the "Play" button and bug on it). Select the "Debug Typescript" option to start the server and debugger.

## Some Troubleshooting Gotchas
If the Heroku worker is still running then it might conflict with your attempts to trigger things locally. You'll notice this when clicking on an action or triggering a command isn't reflecting your changes. Its because the deployed instance is the one holding open the web socket.

Let me know and I'll shut down the worker for you.