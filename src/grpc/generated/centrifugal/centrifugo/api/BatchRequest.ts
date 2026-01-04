// Original file: src/grpc/grpc.proto

import type { Command as _centrifugal_centrifugo_api_Command, Command__Output as _centrifugal_centrifugo_api_Command__Output } from '../../../centrifugal/centrifugo/api/Command';

export interface BatchRequest {
  'commands'?: (_centrifugal_centrifugo_api_Command)[];
  'parallel'?: (boolean);
}

export interface BatchRequest__Output {
  'commands'?: (_centrifugal_centrifugo_api_Command__Output)[];
  'parallel'?: (boolean);
}
