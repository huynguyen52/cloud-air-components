import { Buffer } from 'buffer';
import { isEmpty } from 'lodash';
import Location from 'src/types/Location';

export const objectToBase64 = (object: { [key: string]: unknown }) => {
  const json = JSON.stringify(object);
  return Buffer.from(json).toString('base64');
};

export const base64ToObject = (base64String?: string) => {
  if (!base64String) return {};
  const json = Buffer.from(base64String, 'base64').toString();
  return JSON.parse(json);
};

export const displayLocation = (location: Location) => !isEmpty(location) ? `${location.address}, ${location.ward.name}, ${location.district.name}, ${location.province.name}` : undefined;