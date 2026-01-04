// Original file: src/grpc/grpc.proto

import type { Error as _centrifugal_centrifugo_api_Error, Error__Output as _centrifugal_centrifugo_api_Error__Output } from '../../../centrifugal/centrifugo/api/Error';
import type { PublishResult as _centrifugal_centrifugo_api_PublishResult, PublishResult__Output as _centrifugal_centrifugo_api_PublishResult__Output } from '../../../centrifugal/centrifugo/api/PublishResult';
import type { BroadcastResult as _centrifugal_centrifugo_api_BroadcastResult, BroadcastResult__Output as _centrifugal_centrifugo_api_BroadcastResult__Output } from '../../../centrifugal/centrifugo/api/BroadcastResult';
import type { SubscribeResult as _centrifugal_centrifugo_api_SubscribeResult, SubscribeResult__Output as _centrifugal_centrifugo_api_SubscribeResult__Output } from '../../../centrifugal/centrifugo/api/SubscribeResult';
import type { UnsubscribeResult as _centrifugal_centrifugo_api_UnsubscribeResult, UnsubscribeResult__Output as _centrifugal_centrifugo_api_UnsubscribeResult__Output } from '../../../centrifugal/centrifugo/api/UnsubscribeResult';
import type { DisconnectResult as _centrifugal_centrifugo_api_DisconnectResult, DisconnectResult__Output as _centrifugal_centrifugo_api_DisconnectResult__Output } from '../../../centrifugal/centrifugo/api/DisconnectResult';
import type { PresenceResult as _centrifugal_centrifugo_api_PresenceResult, PresenceResult__Output as _centrifugal_centrifugo_api_PresenceResult__Output } from '../../../centrifugal/centrifugo/api/PresenceResult';
import type { PresenceStatsResult as _centrifugal_centrifugo_api_PresenceStatsResult, PresenceStatsResult__Output as _centrifugal_centrifugo_api_PresenceStatsResult__Output } from '../../../centrifugal/centrifugo/api/PresenceStatsResult';
import type { HistoryResult as _centrifugal_centrifugo_api_HistoryResult, HistoryResult__Output as _centrifugal_centrifugo_api_HistoryResult__Output } from '../../../centrifugal/centrifugo/api/HistoryResult';
import type { HistoryRemoveResult as _centrifugal_centrifugo_api_HistoryRemoveResult, HistoryRemoveResult__Output as _centrifugal_centrifugo_api_HistoryRemoveResult__Output } from '../../../centrifugal/centrifugo/api/HistoryRemoveResult';
import type { InfoResult as _centrifugal_centrifugo_api_InfoResult, InfoResult__Output as _centrifugal_centrifugo_api_InfoResult__Output } from '../../../centrifugal/centrifugo/api/InfoResult';
import type { RefreshResult as _centrifugal_centrifugo_api_RefreshResult, RefreshResult__Output as _centrifugal_centrifugo_api_RefreshResult__Output } from '../../../centrifugal/centrifugo/api/RefreshResult';
import type { ChannelsResult as _centrifugal_centrifugo_api_ChannelsResult, ChannelsResult__Output as _centrifugal_centrifugo_api_ChannelsResult__Output } from '../../../centrifugal/centrifugo/api/ChannelsResult';

export interface Reply {
  'error'?: (_centrifugal_centrifugo_api_Error | null);
  'publish'?: (_centrifugal_centrifugo_api_PublishResult | null);
  'broadcast'?: (_centrifugal_centrifugo_api_BroadcastResult | null);
  'subscribe'?: (_centrifugal_centrifugo_api_SubscribeResult | null);
  'unsubscribe'?: (_centrifugal_centrifugo_api_UnsubscribeResult | null);
  'disconnect'?: (_centrifugal_centrifugo_api_DisconnectResult | null);
  'presence'?: (_centrifugal_centrifugo_api_PresenceResult | null);
  'presenceStats'?: (_centrifugal_centrifugo_api_PresenceStatsResult | null);
  'history'?: (_centrifugal_centrifugo_api_HistoryResult | null);
  'historyRemove'?: (_centrifugal_centrifugo_api_HistoryRemoveResult | null);
  'info'?: (_centrifugal_centrifugo_api_InfoResult | null);
  'refresh'?: (_centrifugal_centrifugo_api_RefreshResult | null);
  'channels'?: (_centrifugal_centrifugo_api_ChannelsResult | null);
  'result'?: "publish"|"broadcast"|"subscribe"|"unsubscribe"|"disconnect"|"presence"|"presenceStats"|"history"|"historyRemove"|"info"|"refresh"|"channels";
}

export interface Reply__Output {
  'error'?: (_centrifugal_centrifugo_api_Error__Output);
  'publish'?: (_centrifugal_centrifugo_api_PublishResult__Output);
  'broadcast'?: (_centrifugal_centrifugo_api_BroadcastResult__Output);
  'subscribe'?: (_centrifugal_centrifugo_api_SubscribeResult__Output);
  'unsubscribe'?: (_centrifugal_centrifugo_api_UnsubscribeResult__Output);
  'disconnect'?: (_centrifugal_centrifugo_api_DisconnectResult__Output);
  'presence'?: (_centrifugal_centrifugo_api_PresenceResult__Output);
  'presenceStats'?: (_centrifugal_centrifugo_api_PresenceStatsResult__Output);
  'history'?: (_centrifugal_centrifugo_api_HistoryResult__Output);
  'historyRemove'?: (_centrifugal_centrifugo_api_HistoryRemoveResult__Output);
  'info'?: (_centrifugal_centrifugo_api_InfoResult__Output);
  'refresh'?: (_centrifugal_centrifugo_api_RefreshResult__Output);
  'channels'?: (_centrifugal_centrifugo_api_ChannelsResult__Output);
}
