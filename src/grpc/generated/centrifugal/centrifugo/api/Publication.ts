// Original file: src/grpc/grpc.proto

import type { ClientInfo as _centrifugal_centrifugo_api_ClientInfo, ClientInfo__Output as _centrifugal_centrifugo_api_ClientInfo__Output } from '../../../centrifugal/centrifugo/api/ClientInfo';
import type { Long } from '@grpc/proto-loader';

export interface Publication {
  'data'?: (Buffer | Uint8Array | string);
  'info'?: (_centrifugal_centrifugo_api_ClientInfo | null);
  'offset'?: (number | string | Long);
  'tags'?: ({[key: string]: string});
}

export interface Publication__Output {
  'data'?: (Buffer);
  'info'?: (_centrifugal_centrifugo_api_ClientInfo__Output);
  'offset'?: (Long);
  'tags'?: ({[key: string]: string});
}
