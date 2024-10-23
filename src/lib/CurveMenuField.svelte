<script lang="ts">
	import * as d3shapes from 'd3-shape';

	import { MenuField } from 'svelte-ux';
	import { entries } from '@layerstack/utils';

	interface Props {
		value?: any | undefined;
		showOpenClosed?: boolean;
		[key: string]: any;
	}

	let {
		value = $bindable(d3shapes['curveLinear']),
		showOpenClosed = false,
		...rest
	}: Props = $props();

	const options = entries(d3shapes)
		.filter(([key]) => {
			return (
				key.startsWith('curve') &&
				(showOpenClosed ? true : !key.endsWith('Open') && !key.endsWith('Closed')) &&
				!key.includes('Bundle') // Not compatibile with area
			);
		})
		.map(([key, value]) => {
			return {
				label: key.replace('curve', ''),
				value: value
			};
		});
</script>

<MenuField label="Curve" {options} bind:value stepper classes={{ menuIcon: 'hidden' }} {...rest} />
