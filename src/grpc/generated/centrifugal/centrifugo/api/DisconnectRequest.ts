// Original file: src/grpc/grpc.proto

import type { Disconnect as _centrifugal_centrifugo_api_Disconnect, Disconnect__Output as _centrifugal_centrifugo_api_Disconnect__Output } from '../../../centrifugal/centrifugo/api/Disconnect';

export interface DisconnectRequest {
  'user'?: (string);
  'disconnect'?: (_centrifugal_centrifugo_api_Disconnect | null);
  'client'?: (string);
  'whitelist'?: (string)[];
  'session'?: (string);
}

export interface DisconnectRequest__Output {
  'user'?: (string);
  'disconnect'?: (_centrifugal_centrifugo_api_Disconnect__Output);
  'client'?: (string);
  'whitelist'?: (string)[];
  'session'?: (string);
}
