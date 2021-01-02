import { StatusType } from '.';

export type statusEmbedType = Exclude<StatusType, 'CONNECT' | 'UPDATE'> | 'ONLINE' | 'UNKNOWN';
