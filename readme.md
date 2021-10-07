# PERSTAT Slack Bot

This simple bot sends a daily PERSAT message to users and prompts them to check in. At a later scheduled time it then collects the responses and rolls them up into a report.

## Required Configuration Variables

Create a `.env` file at the root of the project on your local machine and fill in the relevant variables.
```
SLACK_SIGNING_SECRET="<string>"
SLACK_BOT_TOKEN="<string>"
SLACK_PERSTAT_BOT_SOCKET_TOKEN="<string>"

INITIAL_HOUR=<int>
INITIAL_MIN=<int>
REMINDER_HOUR=<int>
REMINDER_MIN=<int>
REPORT_HOUR=<int>
REPORT_MIN=<int>

PERSTAT_CHANNEL_ID="<string>"
ENVIRONMENT="<string>"
```

## TODO
- ~~Accurate scheduling~~
- Error handling / ~~logging~~
- ~~Deployment pipeline~~
- Testing
- Convert to typescript
- Add "notes" field
- Format the report data better
- Disable submission inputs and button on submission
- Handle late submissions
- Reset user state in the morning
- Simplify reminder time logic (create its own env var)
- remove user id from logs. You cant search by it anyway
- filter out inactive users (campbell)


### Advanced TODOs
- Admin controls
    - Identify a user's team and report them accordingly
    - Add | Edit a user's settings
    - Trigger a new report (for late responses)
    - Trigger a new solicitation of status
    - Adjust solicitation and report times
- Multiple solicitation formats
    - Simple math problems to submit
    - Giffs and memes
- Send report to external file like a google doc
