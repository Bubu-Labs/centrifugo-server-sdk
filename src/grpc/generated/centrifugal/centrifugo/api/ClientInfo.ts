// Original file: src/grpc/grpc.proto


export interface ClientInfo {
  'user'?: (string);
  'client'?: (string);
  'connInfo'?: (Buffer | Uint8Array | string);
  'chanInfo'?: (Buffer | Uint8Array | string);
}

export interface ClientInfo__Output {
  'user'?: (string);
  'client'?: (string);
  'connInfo'?: (Buffer);
  'chanInfo'?: (Buffer);
}
