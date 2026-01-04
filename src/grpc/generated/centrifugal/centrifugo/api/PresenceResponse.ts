// Original file: src/grpc/grpc.proto

import type { Error as _centrifugal_centrifugo_api_Error, Error__Output as _centrifugal_centrifugo_api_Error__Output } from '../../../centrifugal/centrifugo/api/Error';
import type { PresenceResult as _centrifugal_centrifugo_api_PresenceResult, PresenceResult__Output as _centrifugal_centrifugo_api_PresenceResult__Output } from '../../../centrifugal/centrifugo/api/PresenceResult';

export interface PresenceResponse {
  'error'?: (_centrifugal_centrifugo_api_Error | null);
  'result'?: (_centrifugal_centrifugo_api_PresenceResult | null);
}

export interface PresenceResponse__Output {
  'error'?: (_centrifugal_centrifugo_api_Error__Output);
  'result'?: (_centrifugal_centrifugo_api_PresenceResult__Output);
}
