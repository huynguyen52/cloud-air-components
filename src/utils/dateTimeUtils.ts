import { DEFAULT_DATETIME_FORMAT, DEFAULT_DATE_FORMAT, MAX_DATE_FOR_TIME_AGO } from 'src/constants/common';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import moment from 'moment';

const timeAgoLocaleMap = {
  en
} as {[key: string]: typeof en};

export const formatISODate = (isoString: string, format?: string) => {
  const date = moment(isoString);
  return date.isValid() ? date.format(format || DEFAULT_DATE_FORMAT) : undefined;
};

export const formatISODateTime = (isoString: string) => formatISODate(isoString, DEFAULT_DATETIME_FORMAT);

export const formatTimeAgo = (isoString: string, locale = 'en') => {
  const date = moment(isoString);
  if (!date.isValid()) return undefined;
  if (moment().diff(date, 'days') + 1 > MAX_DATE_FOR_TIME_AGO) return date.format(DEFAULT_DATETIME_FORMAT);
  TimeAgo.addLocale(timeAgoLocaleMap[locale]);
  const timeAgo = new TimeAgo(locale);
  const inSeconds = date.valueOf();
  return timeAgo.format(inSeconds - 60 * 1000);
};