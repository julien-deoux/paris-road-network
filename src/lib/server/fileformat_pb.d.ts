//* Copyright (c) 2010 Scott A. Crosby. <scott@sacrosby.com>
//
//Permission is hereby granted, free of charge, to any person obtaining a copy of
//this software and associated documentation files (the "Software"), to deal in
//the Software without restriction, including without limitation the rights to
//use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
//of the Software, and to permit persons to whom the Software is furnished to do
//so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.
//

// @generated by protoc-gen-es v1.10.0
// @generated from file fileformat.proto (package OSMPBF, syntax proto2)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto2 } from "@bufbuild/protobuf";

/**
 * @generated from message OSMPBF.Blob
 */
export declare class Blob extends Message<Blob> {
  /**
   * When compressed, the uncompressed size
   *
   * @generated from field: optional int32 raw_size = 2;
   */
  rawSize?: number;

  /**
   * @generated from oneof OSMPBF.Blob.data
   */
  data: {
    /**
     * No compression
     *
     * @generated from field: bytes raw = 1;
     */
    value: Uint8Array;
    case: "raw";
  } | {
    /**
     * Possible compressed versions of the data.
     *
     * @generated from field: bytes zlib_data = 3;
     */
    value: Uint8Array;
    case: "zlibData";
  } | {
    /**
     * For LZMA compressed data (optional)
     *
     * @generated from field: bytes lzma_data = 4;
     */
    value: Uint8Array;
    case: "lzmaData";
  } | {
    /**
     * Formerly used for bzip2 compressed data. Deprecated in 2010.
     *
     * Don't reuse this tag number.
     *
     * @generated from field: bytes OBSOLETE_bzip2_data = 5 [deprecated = true];
     * @deprecated
     */
    value: Uint8Array;
    case: "OBSOLETEBzip2Data";
  } | {
    /**
     * For LZ4 compressed data (optional)
     *
     * @generated from field: bytes lz4_data = 6;
     */
    value: Uint8Array;
    case: "lz4Data";
  } | {
    /**
     * For ZSTD compressed data (optional)
     *
     * @generated from field: bytes zstd_data = 7;
     */
    value: Uint8Array;
    case: "zstdData";
  } | { case: undefined; value?: undefined };

  constructor(data?: PartialMessage<Blob>);

  static readonly runtime: typeof proto2;
  static readonly typeName = "OSMPBF.Blob";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Blob;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Blob;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Blob;

  static equals(a: Blob | PlainMessage<Blob> | undefined, b: Blob | PlainMessage<Blob> | undefined): boolean;
}

/**
 * @generated from message OSMPBF.BlobHeader
 */
export declare class BlobHeader extends Message<BlobHeader> {
  /**
   * @generated from field: required string type = 1;
   */
  type?: string;

  /**
   * @generated from field: optional bytes indexdata = 2;
   */
  indexdata?: Uint8Array;

  /**
   * @generated from field: required int32 datasize = 3;
   */
  datasize?: number;

  constructor(data?: PartialMessage<BlobHeader>);

  static readonly runtime: typeof proto2;
  static readonly typeName = "OSMPBF.BlobHeader";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): BlobHeader;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): BlobHeader;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): BlobHeader;

  static equals(a: BlobHeader | PlainMessage<BlobHeader> | undefined, b: BlobHeader | PlainMessage<BlobHeader> | undefined): boolean;
}

