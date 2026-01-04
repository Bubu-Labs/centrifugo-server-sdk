// Original file: src/grpc/grpc.proto

import type { Error as _centrifugal_centrifugo_api_Error, Error__Output as _centrifugal_centrifugo_api_Error__Output } from '../../../centrifugal/centrifugo/api/Error';
import type { RefreshResult as _centrifugal_centrifugo_api_RefreshResult, RefreshResult__Output as _centrifugal_centrifugo_api_RefreshResult__Output } from '../../../centrifugal/centrifugo/api/RefreshResult';

export interface RefreshResponse {
  'error'?: (_centrifugal_centrifugo_api_Error | null);
  'result'?: (_centrifugal_centrifugo_api_RefreshResult | null);
}

export interface RefreshResponse__Output {
  'error'?: (_centrifugal_centrifugo_api_Error__Output);
  'result'?: (_centrifugal_centrifugo_api_RefreshResult__Output);
}
