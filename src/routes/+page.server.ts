import { getOsmData, type OsmData } from '$lib/server/osm';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const data = await getOsmData();
	const features = getFeaturesFromOsmData(data);
	return { features };
};

function getFeaturesFromOsmData({ nodes, ways }: OsmData) {
	const features = [
		{
			type: 'LineString',
			coordinates: [
				[2.270495438078882, 48.87119509370018],
				[2.32662823832689, 48.90136827391811],
				[2.3896089498212234, 48.898207229772055],
				[2.4087024275437443, 48.878315237835466],
				[2.4128808226654996, 48.832006185627876],
				[2.3642767485107186, 48.81713233905242],
				[2.3368933787421042, 48.81621995965449],
				[2.2745912967547497, 48.83472075741432],
				[2.2595260887322013, 48.83652491009437],
				[2.2526910328546705, 48.85318670408742],
				[2.278708080280836, 48.8766015443569]
			]
		}
	] as GeoJSON.LineString[];
	waysLoop: for (const way of Object.values(ways)) {
		const feature: GeoJSON.LineString = {
			type: 'LineString',
			coordinates: []
		};
		for (const ref of way.refs) {
			const nodeId = ref.toString();
			if (!(nodeId in nodes)) {
				// console.log(`Node ${nodeId} not found`);
				continue waysLoop;
			}
			const { lat, lon } = nodes[nodeId];
			feature.coordinates.push([lon, lat]);
		}
		features.push(feature);
	}
	return features;
}
