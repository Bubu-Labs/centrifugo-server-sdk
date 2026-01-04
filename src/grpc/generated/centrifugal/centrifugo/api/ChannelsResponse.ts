// Original file: src/grpc/grpc.proto

import type { Error as _centrifugal_centrifugo_api_Error, Error__Output as _centrifugal_centrifugo_api_Error__Output } from '../../../centrifugal/centrifugo/api/Error';
import type { ChannelsResult as _centrifugal_centrifugo_api_ChannelsResult, ChannelsResult__Output as _centrifugal_centrifugo_api_ChannelsResult__Output } from '../../../centrifugal/centrifugo/api/ChannelsResult';

export interface ChannelsResponse {
  'error'?: (_centrifugal_centrifugo_api_Error | null);
  'result'?: (_centrifugal_centrifugo_api_ChannelsResult | null);
}

export interface ChannelsResponse__Output {
  'error'?: (_centrifugal_centrifugo_api_Error__Output);
  'result'?: (_centrifugal_centrifugo_api_ChannelsResult__Output);
}
