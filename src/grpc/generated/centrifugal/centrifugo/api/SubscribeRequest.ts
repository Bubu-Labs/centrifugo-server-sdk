// Original file: src/grpc/grpc.proto

import type { StreamPosition as _centrifugal_centrifugo_api_StreamPosition, StreamPosition__Output as _centrifugal_centrifugo_api_StreamPosition__Output } from '../../../centrifugal/centrifugo/api/StreamPosition';
import type { SubscribeOptionOverride as _centrifugal_centrifugo_api_SubscribeOptionOverride, SubscribeOptionOverride__Output as _centrifugal_centrifugo_api_SubscribeOptionOverride__Output } from '../../../centrifugal/centrifugo/api/SubscribeOptionOverride';
import type { Long } from '@grpc/proto-loader';

export interface SubscribeRequest {
  'channel'?: (string);
  'user'?: (string);
  'expireAt'?: (number | string | Long);
  'info'?: (Buffer | Uint8Array | string);
  'b64info'?: (string);
  'client'?: (string);
  'data'?: (Buffer | Uint8Array | string);
  'b64data'?: (string);
  'recoverSince'?: (_centrifugal_centrifugo_api_StreamPosition | null);
  'override'?: (_centrifugal_centrifugo_api_SubscribeOptionOverride | null);
  'session'?: (string);
}

export interface SubscribeRequest__Output {
  'channel'?: (string);
  'user'?: (string);
  'expireAt'?: (Long);
  'info'?: (Buffer);
  'b64info'?: (string);
  'client'?: (string);
  'data'?: (Buffer);
  'b64data'?: (string);
  'recoverSince'?: (_centrifugal_centrifugo_api_StreamPosition__Output);
  'override'?: (_centrifugal_centrifugo_api_SubscribeOptionOverride__Output);
  'session'?: (string);
}
