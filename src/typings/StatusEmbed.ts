import { StatusType } from '.';

export type StatusEmbedType = Exclude<StatusType, 'CONNECT' | 'UPDATE'> | 'ONLINE' | 'UNKNOWN';
