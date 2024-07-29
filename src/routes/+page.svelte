<script lang="ts">
	import * as d3 from 'd3';
	import type { PageData } from './$types';

	const IDF_CENTER = [1.1477438, 48.4776984] as [number, number];

	export let data: PageData;
	console.log(data);

	const path = d3.geoPath(d3.geoMercator().center(IDF_CENTER).scale(10000));
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<svg width={975} height={610}>
	{#each data.features as way}
		<path d={path(way)} stroke="black" fill="none" stroke-width={1} />
	{/each}
</svg>
