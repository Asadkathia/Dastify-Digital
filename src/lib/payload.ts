import { cache } from 'react';
import { getPayload } from 'payload';
import config from '@payload-config';

export const getPayloadClient = cache(async () => {
  const payloadConfig = await config;
  return getPayload({ config: payloadConfig });
});
