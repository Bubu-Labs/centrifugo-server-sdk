// Original file: src/grpc/grpc.proto


export interface Metrics {
  'interval'?: (number | string);
  'items'?: ({[key: string]: number | string});
}

export interface Metrics__Output {
  'interval'?: (number);
  'items'?: ({[key: string]: number});
}
