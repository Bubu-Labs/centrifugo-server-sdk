// Original file: src/grpc/grpc.proto

import type { Long } from '@grpc/proto-loader';

export interface PublishResult {
  'offset'?: (number | string | Long);
  'epoch'?: (string);
}

export interface PublishResult__Output {
  'offset'?: (Long);
  'epoch'?: (string);
}
