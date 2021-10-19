import { App } from "@slack/bolt";
import { getInitialMin, getInitialHour, DATE_RANGE, getReminderHour, getReminderMin, getReportHour, getReportMin } from "./utils";
import * as Scheduler from 'node-schedule';
import { sendPerstat, sendReminder, sendReport } from "../perstat/perstat";
import { resetUserResponseStateForNewReport } from "./users";
import { Client } from "pg";


export const schedulePerstat = async (app: App, db: Client) => {
    const rule = new Scheduler.RecurrenceRule();
    rule.minute = getInitialMin();
    rule.hour = getInitialHour();
    rule.dayOfWeek = DATE_RANGE;

    await Scheduler.scheduleJob(rule, async () => {
        await resetUserResponseStateForNewReport(db, app);
        sendPerstat(app);
    });
};

export const scheduleReminder = (app: App) => {
    const rule = new Scheduler.RecurrenceRule();
    rule.minute = getReminderMin();
    rule.hour = getReminderHour();
    rule.dayOfWeek = DATE_RANGE;

    Scheduler.scheduleJob(rule, () => {
        sendReminder(app);
    });
};

export const scheduleReport = (app: App) => {
    const rule = new Scheduler.RecurrenceRule();
    rule.minute = getReportMin();
    rule.hour = getReportHour();
    rule.dayOfWeek = DATE_RANGE;

    Scheduler.scheduleJob(rule, () => {
        sendReport(app);
    });
};

export const scheduleManualReport = (app: App, date: Date) => {
    Scheduler.scheduleJob(date, () => {
        sendReport(app);
    });
};