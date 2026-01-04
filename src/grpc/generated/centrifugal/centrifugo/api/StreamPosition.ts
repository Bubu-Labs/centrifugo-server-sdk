// Original file: src/grpc/grpc.proto

import type { Long } from '@grpc/proto-loader';

export interface StreamPosition {
  'offset'?: (number | string | Long);
  'epoch'?: (string);
}

export interface StreamPosition__Output {
  'offset'?: (Long);
  'epoch'?: (string);
}
