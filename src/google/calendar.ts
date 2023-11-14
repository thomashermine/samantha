import { google } from "googleapis";
import { google as client } from "./client";
import { log } from "../_helpers/logs";

export const GOOGLE_CALENDAR_CLIENT = null;

/**
 * Fetches events from the primary Google Calendar.
 *
 * @param {Object} paramOptions - The options for the events to fetch.
 * @param {string} paramOptions.timeMin - The minimum time for the events. Defaults to the current time. . Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z.
 * @param {string} paramOptions.timeMax - The maximum time for the events. Defaults to undefined. . Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z.
 * @param {number} paramOptions.maxResults - The maximum number of events to fetch. Defaults to 10.
 * @param {string} paramOptions.q - The query to search for in the events.
 * @param {string} paramOptions.orderBy - The order in which to return the events. Defaults to "startTime".
 * @returns {Promise<Object>} - The Promise that resolves with the fetched events.
 */
export async function getEvents(paramOptions: {
  timeMin?: string;
  timeMax?: string;
  maxResults?: number;
  q?: string;
}) {
  const options = {
    timeMin: new Date().toISOString(),
    maxResults: 10,
    timeZone: "Europe/Brussels",
    singleEvents: true,
    orderBy: "startTime",
    ...paramOptions,
  };

  let logMessage = options.q ? ` Searching for ${options.q}` : "Getting events";
  if (options.timeMin) logMessage += ` after ${options.timeMin}`;
  if (options.timeMax) logMessage += ` before ${options.timeMax}`;
  log("google", "info", logMessage);
  log("google", "debug", "Options:", options);
  const calendar = google.calendar({ version: "v3", auth: client });
  return await calendar.events.list({
    calendarId: "primary",
    ...options,
  });
}

/**
 * Creates an event in the primary Google Calendar.
 *
 * @param {string} title - The title of the event.
 * @param {Date} startTime - The start time of the event.
 * @param {Date} endTime - The end time of the event.
 * @param {string} location - The location of the event.
 * @returns {Promise<void>} - The Promise that resolves when the event has been created.
 */
export async function createEvent({ title, startTime, endTime, location }) {
  const calendar = google.calendar({ version: "v3", auth: client });
  const event = {
    summary: title,
    start: {
      dateTime: startTime,
      timeZone: "Europe/Brussels",
    },
    end: {
      dateTime: endTime,
      timeZone: "Europe/Brussels",
    },
    location: location,
  };
  return await calendar.events.insert({
    calendarId: "primary",
    resource: event,
  });
}

/**
 * Deletes an event in the primary Google Calendar.
 *
 * @param {Object} paramOptions - The options for the events to fetch.
 * @param {string} paramOptions.eventId - The ID of the event to delete.
 * @returns {Promise<Object>} - The Promise that resolves with the fetched events.
 */
export async function deleteEvent({ eventId }) {
  const calendar = google.calendar({ version: "v3", auth: client });
  return await calendar.events.delete({
    calendarId: "primary",
    eventId: eventId,
  });
}
