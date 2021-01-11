import { StatusType } from '.';

export type StatusEmbedType = Exclude<StatusType, 'CONNECT'> | 'UNKNOWN';
