// Original file: src/grpc/grpc.proto

import type { PublishRequest as _centrifugal_centrifugo_api_PublishRequest, PublishRequest__Output as _centrifugal_centrifugo_api_PublishRequest__Output } from '../../../centrifugal/centrifugo/api/PublishRequest';
import type { BroadcastRequest as _centrifugal_centrifugo_api_BroadcastRequest, BroadcastRequest__Output as _centrifugal_centrifugo_api_BroadcastRequest__Output } from '../../../centrifugal/centrifugo/api/BroadcastRequest';
import type { SubscribeRequest as _centrifugal_centrifugo_api_SubscribeRequest, SubscribeRequest__Output as _centrifugal_centrifugo_api_SubscribeRequest__Output } from '../../../centrifugal/centrifugo/api/SubscribeRequest';
import type { UnsubscribeRequest as _centrifugal_centrifugo_api_UnsubscribeRequest, UnsubscribeRequest__Output as _centrifugal_centrifugo_api_UnsubscribeRequest__Output } from '../../../centrifugal/centrifugo/api/UnsubscribeRequest';
import type { DisconnectRequest as _centrifugal_centrifugo_api_DisconnectRequest, DisconnectRequest__Output as _centrifugal_centrifugo_api_DisconnectRequest__Output } from '../../../centrifugal/centrifugo/api/DisconnectRequest';
import type { PresenceRequest as _centrifugal_centrifugo_api_PresenceRequest, PresenceRequest__Output as _centrifugal_centrifugo_api_PresenceRequest__Output } from '../../../centrifugal/centrifugo/api/PresenceRequest';
import type { PresenceStatsRequest as _centrifugal_centrifugo_api_PresenceStatsRequest, PresenceStatsRequest__Output as _centrifugal_centrifugo_api_PresenceStatsRequest__Output } from '../../../centrifugal/centrifugo/api/PresenceStatsRequest';
import type { HistoryRequest as _centrifugal_centrifugo_api_HistoryRequest, HistoryRequest__Output as _centrifugal_centrifugo_api_HistoryRequest__Output } from '../../../centrifugal/centrifugo/api/HistoryRequest';
import type { HistoryRemoveRequest as _centrifugal_centrifugo_api_HistoryRemoveRequest, HistoryRemoveRequest__Output as _centrifugal_centrifugo_api_HistoryRemoveRequest__Output } from '../../../centrifugal/centrifugo/api/HistoryRemoveRequest';
import type { InfoRequest as _centrifugal_centrifugo_api_InfoRequest, InfoRequest__Output as _centrifugal_centrifugo_api_InfoRequest__Output } from '../../../centrifugal/centrifugo/api/InfoRequest';
import type { RefreshRequest as _centrifugal_centrifugo_api_RefreshRequest, RefreshRequest__Output as _centrifugal_centrifugo_api_RefreshRequest__Output } from '../../../centrifugal/centrifugo/api/RefreshRequest';
import type { ChannelsRequest as _centrifugal_centrifugo_api_ChannelsRequest, ChannelsRequest__Output as _centrifugal_centrifugo_api_ChannelsRequest__Output } from '../../../centrifugal/centrifugo/api/ChannelsRequest';

export interface Command {
  'publish'?: (_centrifugal_centrifugo_api_PublishRequest | null);
  'broadcast'?: (_centrifugal_centrifugo_api_BroadcastRequest | null);
  'subscribe'?: (_centrifugal_centrifugo_api_SubscribeRequest | null);
  'unsubscribe'?: (_centrifugal_centrifugo_api_UnsubscribeRequest | null);
  'disconnect'?: (_centrifugal_centrifugo_api_DisconnectRequest | null);
  'presence'?: (_centrifugal_centrifugo_api_PresenceRequest | null);
  'presenceStats'?: (_centrifugal_centrifugo_api_PresenceStatsRequest | null);
  'history'?: (_centrifugal_centrifugo_api_HistoryRequest | null);
  'historyRemove'?: (_centrifugal_centrifugo_api_HistoryRemoveRequest | null);
  'info'?: (_centrifugal_centrifugo_api_InfoRequest | null);
  'refresh'?: (_centrifugal_centrifugo_api_RefreshRequest | null);
  'channels'?: (_centrifugal_centrifugo_api_ChannelsRequest | null);
  'cmd'?: "publish"|"broadcast"|"subscribe"|"unsubscribe"|"disconnect"|"presence"|"presenceStats"|"history"|"historyRemove"|"info"|"refresh"|"channels";
}

export interface Command__Output {
  'publish'?: (_centrifugal_centrifugo_api_PublishRequest__Output);
  'broadcast'?: (_centrifugal_centrifugo_api_BroadcastRequest__Output);
  'subscribe'?: (_centrifugal_centrifugo_api_SubscribeRequest__Output);
  'unsubscribe'?: (_centrifugal_centrifugo_api_UnsubscribeRequest__Output);
  'disconnect'?: (_centrifugal_centrifugo_api_DisconnectRequest__Output);
  'presence'?: (_centrifugal_centrifugo_api_PresenceRequest__Output);
  'presenceStats'?: (_centrifugal_centrifugo_api_PresenceStatsRequest__Output);
  'history'?: (_centrifugal_centrifugo_api_HistoryRequest__Output);
  'historyRemove'?: (_centrifugal_centrifugo_api_HistoryRemoveRequest__Output);
  'info'?: (_centrifugal_centrifugo_api_InfoRequest__Output);
  'refresh'?: (_centrifugal_centrifugo_api_RefreshRequest__Output);
  'channels'?: (_centrifugal_centrifugo_api_ChannelsRequest__Output);
}
