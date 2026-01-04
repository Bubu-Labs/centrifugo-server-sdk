// Original file: src/grpc/grpc.proto

import type { Metrics as _centrifugal_centrifugo_api_Metrics, Metrics__Output as _centrifugal_centrifugo_api_Metrics__Output } from '../../../centrifugal/centrifugo/api/Metrics';
import type { Process as _centrifugal_centrifugo_api_Process, Process__Output as _centrifugal_centrifugo_api_Process__Output } from '../../../centrifugal/centrifugo/api/Process';

export interface NodeResult {
  'uid'?: (string);
  'name'?: (string);
  'version'?: (string);
  'numClients'?: (number);
  'numUsers'?: (number);
  'numChannels'?: (number);
  'uptime'?: (number);
  'metrics'?: (_centrifugal_centrifugo_api_Metrics | null);
  'process'?: (_centrifugal_centrifugo_api_Process | null);
  'numSubs'?: (number);
}

export interface NodeResult__Output {
  'uid'?: (string);
  'name'?: (string);
  'version'?: (string);
  'numClients'?: (number);
  'numUsers'?: (number);
  'numChannels'?: (number);
  'uptime'?: (number);
  'metrics'?: (_centrifugal_centrifugo_api_Metrics__Output);
  'process'?: (_centrifugal_centrifugo_api_Process__Output);
  'numSubs'?: (number);
}
