// Original file: src/grpc/grpc.proto

import type { Error as _centrifugal_centrifugo_api_Error, Error__Output as _centrifugal_centrifugo_api_Error__Output } from '../../../centrifugal/centrifugo/api/Error';
import type { PublishResult as _centrifugal_centrifugo_api_PublishResult, PublishResult__Output as _centrifugal_centrifugo_api_PublishResult__Output } from '../../../centrifugal/centrifugo/api/PublishResult';

export interface PublishResponse {
  'error'?: (_centrifugal_centrifugo_api_Error | null);
  'result'?: (_centrifugal_centrifugo_api_PublishResult | null);
}

export interface PublishResponse__Output {
  'error'?: (_centrifugal_centrifugo_api_Error__Output);
  'result'?: (_centrifugal_centrifugo_api_PublishResult__Output);
}
