// Original file: src/grpc/grpc.proto

import type { MethodDefinition } from '@grpc/proto-loader'
import type { BatchRequest as _centrifugal_centrifugo_api_BatchRequest, BatchRequest__Output as _centrifugal_centrifugo_api_BatchRequest__Output } from '../../../centrifugal/centrifugo/api/BatchRequest';
import type { BatchResponse as _centrifugal_centrifugo_api_BatchResponse, BatchResponse__Output as _centrifugal_centrifugo_api_BatchResponse__Output } from '../../../centrifugal/centrifugo/api/BatchResponse';
import type { BroadcastRequest as _centrifugal_centrifugo_api_BroadcastRequest, BroadcastRequest__Output as _centrifugal_centrifugo_api_BroadcastRequest__Output } from '../../../centrifugal/centrifugo/api/BroadcastRequest';
import type { BroadcastResponse as _centrifugal_centrifugo_api_BroadcastResponse, BroadcastResponse__Output as _centrifugal_centrifugo_api_BroadcastResponse__Output } from '../../../centrifugal/centrifugo/api/BroadcastResponse';
import type { ChannelsRequest as _centrifugal_centrifugo_api_ChannelsRequest, ChannelsRequest__Output as _centrifugal_centrifugo_api_ChannelsRequest__Output } from '../../../centrifugal/centrifugo/api/ChannelsRequest';
import type { ChannelsResponse as _centrifugal_centrifugo_api_ChannelsResponse, ChannelsResponse__Output as _centrifugal_centrifugo_api_ChannelsResponse__Output } from '../../../centrifugal/centrifugo/api/ChannelsResponse';
import type { DisconnectRequest as _centrifugal_centrifugo_api_DisconnectRequest, DisconnectRequest__Output as _centrifugal_centrifugo_api_DisconnectRequest__Output } from '../../../centrifugal/centrifugo/api/DisconnectRequest';
import type { DisconnectResponse as _centrifugal_centrifugo_api_DisconnectResponse, DisconnectResponse__Output as _centrifugal_centrifugo_api_DisconnectResponse__Output } from '../../../centrifugal/centrifugo/api/DisconnectResponse';
import type { HistoryRemoveRequest as _centrifugal_centrifugo_api_HistoryRemoveRequest, HistoryRemoveRequest__Output as _centrifugal_centrifugo_api_HistoryRemoveRequest__Output } from '../../../centrifugal/centrifugo/api/HistoryRemoveRequest';
import type { HistoryRemoveResponse as _centrifugal_centrifugo_api_HistoryRemoveResponse, HistoryRemoveResponse__Output as _centrifugal_centrifugo_api_HistoryRemoveResponse__Output } from '../../../centrifugal/centrifugo/api/HistoryRemoveResponse';
import type { HistoryRequest as _centrifugal_centrifugo_api_HistoryRequest, HistoryRequest__Output as _centrifugal_centrifugo_api_HistoryRequest__Output } from '../../../centrifugal/centrifugo/api/HistoryRequest';
import type { HistoryResponse as _centrifugal_centrifugo_api_HistoryResponse, HistoryResponse__Output as _centrifugal_centrifugo_api_HistoryResponse__Output } from '../../../centrifugal/centrifugo/api/HistoryResponse';
import type { InfoRequest as _centrifugal_centrifugo_api_InfoRequest, InfoRequest__Output as _centrifugal_centrifugo_api_InfoRequest__Output } from '../../../centrifugal/centrifugo/api/InfoRequest';
import type { InfoResponse as _centrifugal_centrifugo_api_InfoResponse, InfoResponse__Output as _centrifugal_centrifugo_api_InfoResponse__Output } from '../../../centrifugal/centrifugo/api/InfoResponse';
import type { PresenceRequest as _centrifugal_centrifugo_api_PresenceRequest, PresenceRequest__Output as _centrifugal_centrifugo_api_PresenceRequest__Output } from '../../../centrifugal/centrifugo/api/PresenceRequest';
import type { PresenceResponse as _centrifugal_centrifugo_api_PresenceResponse, PresenceResponse__Output as _centrifugal_centrifugo_api_PresenceResponse__Output } from '../../../centrifugal/centrifugo/api/PresenceResponse';
import type { PresenceStatsRequest as _centrifugal_centrifugo_api_PresenceStatsRequest, PresenceStatsRequest__Output as _centrifugal_centrifugo_api_PresenceStatsRequest__Output } from '../../../centrifugal/centrifugo/api/PresenceStatsRequest';
import type { PresenceStatsResponse as _centrifugal_centrifugo_api_PresenceStatsResponse, PresenceStatsResponse__Output as _centrifugal_centrifugo_api_PresenceStatsResponse__Output } from '../../../centrifugal/centrifugo/api/PresenceStatsResponse';
import type { PublishRequest as _centrifugal_centrifugo_api_PublishRequest, PublishRequest__Output as _centrifugal_centrifugo_api_PublishRequest__Output } from '../../../centrifugal/centrifugo/api/PublishRequest';
import type { PublishResponse as _centrifugal_centrifugo_api_PublishResponse, PublishResponse__Output as _centrifugal_centrifugo_api_PublishResponse__Output } from '../../../centrifugal/centrifugo/api/PublishResponse';
import type { RefreshRequest as _centrifugal_centrifugo_api_RefreshRequest, RefreshRequest__Output as _centrifugal_centrifugo_api_RefreshRequest__Output } from '../../../centrifugal/centrifugo/api/RefreshRequest';
import type { RefreshResponse as _centrifugal_centrifugo_api_RefreshResponse, RefreshResponse__Output as _centrifugal_centrifugo_api_RefreshResponse__Output } from '../../../centrifugal/centrifugo/api/RefreshResponse';
import type { SubscribeRequest as _centrifugal_centrifugo_api_SubscribeRequest, SubscribeRequest__Output as _centrifugal_centrifugo_api_SubscribeRequest__Output } from '../../../centrifugal/centrifugo/api/SubscribeRequest';
import type { SubscribeResponse as _centrifugal_centrifugo_api_SubscribeResponse, SubscribeResponse__Output as _centrifugal_centrifugo_api_SubscribeResponse__Output } from '../../../centrifugal/centrifugo/api/SubscribeResponse';
import type { UnsubscribeRequest as _centrifugal_centrifugo_api_UnsubscribeRequest, UnsubscribeRequest__Output as _centrifugal_centrifugo_api_UnsubscribeRequest__Output } from '../../../centrifugal/centrifugo/api/UnsubscribeRequest';
import type { UnsubscribeResponse as _centrifugal_centrifugo_api_UnsubscribeResponse, UnsubscribeResponse__Output as _centrifugal_centrifugo_api_UnsubscribeResponse__Output } from '../../../centrifugal/centrifugo/api/UnsubscribeResponse';

export interface CentrifugoApiDefinition {
  Batch: MethodDefinition<_centrifugal_centrifugo_api_BatchRequest, _centrifugal_centrifugo_api_BatchResponse, _centrifugal_centrifugo_api_BatchRequest__Output, _centrifugal_centrifugo_api_BatchResponse__Output>
  Broadcast: MethodDefinition<_centrifugal_centrifugo_api_BroadcastRequest, _centrifugal_centrifugo_api_BroadcastResponse, _centrifugal_centrifugo_api_BroadcastRequest__Output, _centrifugal_centrifugo_api_BroadcastResponse__Output>
  Channels: MethodDefinition<_centrifugal_centrifugo_api_ChannelsRequest, _centrifugal_centrifugo_api_ChannelsResponse, _centrifugal_centrifugo_api_ChannelsRequest__Output, _centrifugal_centrifugo_api_ChannelsResponse__Output>
  Disconnect: MethodDefinition<_centrifugal_centrifugo_api_DisconnectRequest, _centrifugal_centrifugo_api_DisconnectResponse, _centrifugal_centrifugo_api_DisconnectRequest__Output, _centrifugal_centrifugo_api_DisconnectResponse__Output>
  History: MethodDefinition<_centrifugal_centrifugo_api_HistoryRequest, _centrifugal_centrifugo_api_HistoryResponse, _centrifugal_centrifugo_api_HistoryRequest__Output, _centrifugal_centrifugo_api_HistoryResponse__Output>
  HistoryRemove: MethodDefinition<_centrifugal_centrifugo_api_HistoryRemoveRequest, _centrifugal_centrifugo_api_HistoryRemoveResponse, _centrifugal_centrifugo_api_HistoryRemoveRequest__Output, _centrifugal_centrifugo_api_HistoryRemoveResponse__Output>
  Info: MethodDefinition<_centrifugal_centrifugo_api_InfoRequest, _centrifugal_centrifugo_api_InfoResponse, _centrifugal_centrifugo_api_InfoRequest__Output, _centrifugal_centrifugo_api_InfoResponse__Output>
  Presence: MethodDefinition<_centrifugal_centrifugo_api_PresenceRequest, _centrifugal_centrifugo_api_PresenceResponse, _centrifugal_centrifugo_api_PresenceRequest__Output, _centrifugal_centrifugo_api_PresenceResponse__Output>
  PresenceStats: MethodDefinition<_centrifugal_centrifugo_api_PresenceStatsRequest, _centrifugal_centrifugo_api_PresenceStatsResponse, _centrifugal_centrifugo_api_PresenceStatsRequest__Output, _centrifugal_centrifugo_api_PresenceStatsResponse__Output>
  Publish: MethodDefinition<_centrifugal_centrifugo_api_PublishRequest, _centrifugal_centrifugo_api_PublishResponse, _centrifugal_centrifugo_api_PublishRequest__Output, _centrifugal_centrifugo_api_PublishResponse__Output>
  Refresh: MethodDefinition<_centrifugal_centrifugo_api_RefreshRequest, _centrifugal_centrifugo_api_RefreshResponse, _centrifugal_centrifugo_api_RefreshRequest__Output, _centrifugal_centrifugo_api_RefreshResponse__Output>
  Subscribe: MethodDefinition<_centrifugal_centrifugo_api_SubscribeRequest, _centrifugal_centrifugo_api_SubscribeResponse, _centrifugal_centrifugo_api_SubscribeRequest__Output, _centrifugal_centrifugo_api_SubscribeResponse__Output>
  Unsubscribe: MethodDefinition<_centrifugal_centrifugo_api_UnsubscribeRequest, _centrifugal_centrifugo_api_UnsubscribeResponse, _centrifugal_centrifugo_api_UnsubscribeRequest__Output, _centrifugal_centrifugo_api_UnsubscribeResponse__Output>
}
