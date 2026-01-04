// Original file: src/grpc/grpc.proto

import type { BoolValue as _centrifugal_centrifugo_api_BoolValue, BoolValue__Output as _centrifugal_centrifugo_api_BoolValue__Output } from '../../../centrifugal/centrifugo/api/BoolValue';

export interface SubscribeOptionOverride {
  'presence'?: (_centrifugal_centrifugo_api_BoolValue | null);
  'joinLeave'?: (_centrifugal_centrifugo_api_BoolValue | null);
  'forceRecovery'?: (_centrifugal_centrifugo_api_BoolValue | null);
  'forcePositioning'?: (_centrifugal_centrifugo_api_BoolValue | null);
  'forcePushJoinLeave'?: (_centrifugal_centrifugo_api_BoolValue | null);
}

export interface SubscribeOptionOverride__Output {
  'presence'?: (_centrifugal_centrifugo_api_BoolValue__Output);
  'joinLeave'?: (_centrifugal_centrifugo_api_BoolValue__Output);
  'forceRecovery'?: (_centrifugal_centrifugo_api_BoolValue__Output);
  'forcePositioning'?: (_centrifugal_centrifugo_api_BoolValue__Output);
  'forcePushJoinLeave'?: (_centrifugal_centrifugo_api_BoolValue__Output);
}
