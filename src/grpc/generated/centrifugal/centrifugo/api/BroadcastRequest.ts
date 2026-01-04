// Original file: src/grpc/grpc.proto

import type { Long } from '@grpc/proto-loader';

export interface BroadcastRequest {
  'channels'?: (string)[];
  'data'?: (Buffer | Uint8Array | string);
  'b64data'?: (string);
  'skipHistory'?: (boolean);
  'tags'?: ({[key: string]: string});
  'idempotencyKey'?: (string);
  'delta'?: (boolean);
  'version'?: (number | string | Long);
  'versionEpoch'?: (string);
}

export interface BroadcastRequest__Output {
  'channels'?: (string)[];
  'data'?: (Buffer);
  'b64data'?: (string);
  'skipHistory'?: (boolean);
  'tags'?: ({[key: string]: string});
  'idempotencyKey'?: (string);
  'delta'?: (boolean);
  'version'?: (Long);
  'versionEpoch'?: (string);
}
