// Original file: src/grpc/grpc.proto

import type { Long } from '@grpc/proto-loader';

export interface Process {
  'cpu'?: (number | string);
  'rss'?: (number | string | Long);
}

export interface Process__Output {
  'cpu'?: (number);
  'rss'?: (Long);
}
