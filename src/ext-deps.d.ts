declare module 'osm-pbf-parser' {
	function parseOsm(): TransformStream<Uint8Array, unknown>;
	export = parseOsm;
}

/**
 * Node's ReadableStream implements this method, but some browsers don't yet.
 * We know we'll only be using this method on the backend, so we add it to
 * typescript's built-in type.
 * */
interface ReadableStream<R> {
	[Symbol.asyncIterator](): AsyncIterableIterator<R>;
}
