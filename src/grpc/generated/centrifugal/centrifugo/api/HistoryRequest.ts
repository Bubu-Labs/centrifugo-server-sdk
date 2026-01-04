// Original file: src/grpc/grpc.proto

import type { StreamPosition as _centrifugal_centrifugo_api_StreamPosition, StreamPosition__Output as _centrifugal_centrifugo_api_StreamPosition__Output } from '../../../centrifugal/centrifugo/api/StreamPosition';

export interface HistoryRequest {
  'channel'?: (string);
  'limit'?: (number);
  'since'?: (_centrifugal_centrifugo_api_StreamPosition | null);
  'reverse'?: (boolean);
}

export interface HistoryRequest__Output {
  'channel'?: (string);
  'limit'?: (number);
  'since'?: (_centrifugal_centrifugo_api_StreamPosition__Output);
  'reverse'?: (boolean);
}
