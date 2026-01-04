// Original file: src/grpc/grpc.proto

import type { Publication as _centrifugal_centrifugo_api_Publication, Publication__Output as _centrifugal_centrifugo_api_Publication__Output } from '../../../centrifugal/centrifugo/api/Publication';
import type { Long } from '@grpc/proto-loader';

export interface HistoryResult {
  'publications'?: (_centrifugal_centrifugo_api_Publication)[];
  'epoch'?: (string);
  'offset'?: (number | string | Long);
}

export interface HistoryResult__Output {
  'publications'?: (_centrifugal_centrifugo_api_Publication__Output)[];
  'epoch'?: (string);
  'offset'?: (Long);
}
