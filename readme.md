# PERSTAT Slack Bot

This simple bot sends a daily PERSAT message to users and prompts them to check in. At a later scheduled time it then collects the responses and rolls them up into a report.

## Required Configuration Variables
```
SLACK_SIGNING_SECRET
SLACK_BOT_TOKEN
SLACK_PERSTAT_BOT_SOCKET_TOKEN

DEV_BASE_HOUR
DEV_BASE_MIN
DEV_BASE_REMINDER_DELAY
DEV_REPORT_HOUR
DEV_REPORT_MIN

PERSTAT_CHANNEL_ID
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
