// Original file: src/grpc/grpc.proto

import type { Long } from '@grpc/proto-loader';

export interface RefreshRequest {
  'user'?: (string);
  'client'?: (string);
  'expired'?: (boolean);
  'expireAt'?: (number | string | Long);
  'info'?: (Buffer | Uint8Array | string);
  'session'?: (string);
}

export interface RefreshRequest__Output {
  'user'?: (string);
  'client'?: (string);
  'expired'?: (boolean);
  'expireAt'?: (Long);
  'info'?: (Buffer);
  'session'?: (string);
}
