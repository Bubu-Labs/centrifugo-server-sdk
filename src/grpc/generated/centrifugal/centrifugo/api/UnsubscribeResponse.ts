// Original file: src/grpc/grpc.proto

import type { Error as _centrifugal_centrifugo_api_Error, Error__Output as _centrifugal_centrifugo_api_Error__Output } from '../../../centrifugal/centrifugo/api/Error';
import type { UnsubscribeResult as _centrifugal_centrifugo_api_UnsubscribeResult, UnsubscribeResult__Output as _centrifugal_centrifugo_api_UnsubscribeResult__Output } from '../../../centrifugal/centrifugo/api/UnsubscribeResult';

export interface UnsubscribeResponse {
  'error'?: (_centrifugal_centrifugo_api_Error | null);
  'result'?: (_centrifugal_centrifugo_api_UnsubscribeResult | null);
}

export interface UnsubscribeResponse__Output {
  'error'?: (_centrifugal_centrifugo_api_Error__Output);
  'result'?: (_centrifugal_centrifugo_api_UnsubscribeResult__Output);
}
