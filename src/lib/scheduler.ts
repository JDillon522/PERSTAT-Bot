import { App } from "@slack/bolt";
import { getInitialMin, getInitialHour, DATE_RANGE, getReminderHour, getReminderMin, getReportHour, getReportMin } from "./utils";
import { Scheduler } from 'node-schedule';
import { sendPerstat, sendReport } from "./perstatActions";


export const schedulePerstat = async (app: App) => {
    const rule = new Scheduler.RecurrenceRule();
    rule.minute = getInitialMin();
    rule.hour = getInitialHour();
    rule.dayOfWeek = DATE_RANGE;

    await Scheduler.scheduleJob(rule, async () => {
        await sendPerstat(app);
    });
};

export const sendReminder = (app: App) => {
    const rule = new Scheduler.RecurrenceRule();
    rule.minute = getReminderMin();
    rule.hour = getReminderHour();
    rule.dayOfWeek = DATE_RANGE;

    Scheduler.scheduleJob(rule, async () => {
        await sendReminder(app);
    });
};

export const scheduleReport = (app: App) => {
    const rule = new Scheduler.RecurrenceRule();
    rule.minute = getReportMin();
    rule.hour = getReportHour();
    rule.dayOfWeek = DATE_RANGE;

    Scheduler.scheduleJob(rule, async () => {
        sendReport(app);
    });
};