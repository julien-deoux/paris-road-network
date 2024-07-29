import { inflateSync } from 'node:zlib';
import { Blob, BlobHeader } from './fileformat_pb';
import { PrimitiveBlock, type Relation } from './osmformat_pb';

const osmUrl = 'https://download.geofabrik.de/europe/france/ile-de-france-latest.osm.pbf';

export async function getOsmData() {
	const nodes = {} as Record<string, SimpleNode>;
	const ways = {} as Record<string, SimpleWay>;

	const res = await fetch(osmUrl);
	const osmStream = res.body;
	if (!osmStream) {
		return { nodes, ways };
	}

	const stream = osmStream
		.pipeThrough(BinToBlocksTransformer())
		.pipeThrough(BlocksToEntitiesTransformer());

	for await (const entity of stream) {
		if (entity.type === 'node') {
			nodes[entity.node.id.toString()] = entity.node;
		}
		if (entity.type === 'way') {
			ways[entity.way.id.toString()] = entity.way;
		}
	}

	return { nodes, ways };
}

export type OsmData = Awaited<ReturnType<typeof getOsmData>>;

function BinToBlocksTransformer() {
	let status: Status = 'readingLength';
	let needed = 4;
	let currentBuffer: Uint8Array | undefined;
	let currentBlobType: string | undefined;
	const result = new TransformStream<Uint8Array, Block>({
		transform: (chunk, controller) => {
			const currentBufferLength = currentBuffer?.length ?? 0;
			const buffer = new Uint8Array(currentBufferLength + chunk.length);
			if (currentBuffer) {
				buffer.set(currentBuffer);
			}
			buffer.set(chunk, currentBufferLength);
			currentBuffer = buffer;
			while (true) {
				if (!currentBuffer || currentBuffer.length < needed) {
					break;
				}
				switch (status) {
					case 'readingLength': {
						needed = new DataView(currentBuffer.buffer).getUint32(0);
						currentBuffer = currentBuffer.slice(4);
						status = 'readingBlobHeader';
						break;
					}
					case 'readingBlobHeader': {
						const blobHeader = BlobHeader.fromBinary(currentBuffer.slice(0, needed));
						currentBuffer = currentBuffer.slice(needed);
						needed = blobHeader.datasize ?? 0;
						currentBlobType = blobHeader.type;
						status = 'readingBlob';
						break;
					}
					case 'readingBlob': {
						const blob = Blob.fromBinary(currentBuffer.slice(0, needed));
						const rawData = decompressBlob(blob);
						if (rawData) {
							controller.enqueue({
								type: currentBlobType,
								rawData
							});
						}
						currentBuffer = currentBuffer.slice(needed);
						needed = 4;
						status = 'readingLength';
						break;
					}
				}
			}
		}
	});
	return result;
}

type Status = 'readingLength' | 'readingBlobHeader' | 'readingBlob';

function decompressBlob(blob: Blob): Uint8Array | undefined {
	switch (blob.data.case) {
		case 'raw':
			return blob.data.value;
		case 'zlibData':
			return inflateSync(blob.data.value);
		default:
			return undefined;
	}
}

type Block = {
	type?: string;
	rawData: Uint8Array;
};

function BlocksToEntitiesTransformer() {
	const result = new TransformStream<Block, Entity>({
		transform: ({ type, rawData }, controller) => {
			if (type === 'OSMData') {
				const block = PrimitiveBlock.fromBinary(rawData);
				const { primitivegroup, latOffset = 0n, lonOffset = 0n, granularity = 100 } = block;
				const unit = granularity * 1e-9;
				for (const group of primitivegroup) {
					for (const node of group.nodes) {
						if (node.id) {
							const id = node.id.toString();
							const lat = Number(node.lat ?? 0n) * unit - Number(latOffset);
							const lon = Number(node.lon ?? 0n) * unit - Number(lonOffset);
							controller.enqueue({
								type: 'node',
								node: {
									id,
									lat,
									lon
								}
							});
						}
					}
					if (group.dense) {
						for (let i = 0; i < group.dense.id.length; i++) {
							const id = group.dense.id[i].toString();
							const lat = Number(group.dense.lat[i] ?? 0n) * unit - Number(latOffset);
							const lon = Number(group.dense.lon[i] ?? 0n) * unit - Number(lonOffset);
							controller.enqueue({
								type: 'node',
								node: { id, lat, lon }
							});
						}
					}
					for (const way of group.ways) {
						if (way.id) {
							const id = way.id.toString();
							const refs = way.refs.map((x) => x.toString());
							controller.enqueue({ type: 'way', way: { id, refs } });
						}
					}
					for (const relation of group.relations) {
						controller.enqueue({ type: 'relation', relation });
					}
				}
			}
		}
	});
	return result;
}

type Entity =
	| {
			type: 'node';
			node: SimpleNode;
	  }
	| {
			type: 'way';
			way: SimpleWay;
	  }
	| {
			type: 'relation';
			relation: Relation;
	  };

type SimpleNode = {
	id: string;
	lat: number;
	lon: number;
};

type SimpleWay = {
	id: string;
	refs: string[];
};
