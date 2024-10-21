<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Chart, Group, Rect, Spline, Svg, Text } from 'layerchart';
	import { Button, Drawer, MenuField } from 'svelte-ux';
	import { cls } from '@layerstack/tailwind';
	import { mdiClose } from '@mdi/js';

	import Dagre from '$lib/Dagre.svelte';
	import CurveMenuField from '$lib/CurveMenuField.svelte';

	// const graph: ComponentProps<Dagre>['graph'] = {
	// 	nodes: [
	// 		{ name: 'kspacey', label: { label: 'Kevin Spacey', width: 144, height: 100 } },
	// 		{ name: 'swilliams', label: { label: 'Saul Williams', width: 160, height: 100 } },
	// 		{ name: 'bpitt', label: { label: 'Brad Pitt', width: 188, height: 100 } },
	// 		{ name: 'hford', label: { label: 'Harrison Ford', width: 168, height: 100 } },
	// 		{ name: 'lwilson', label: { label: 'Luke Wilson', width: 144, height: 100 } },
	// 		{ name: 'kbacon', label: { label: 'Kevin Bacon', width: 121, height: 100 } }
	// 	],
	// 	edges: [
	// 		{ sourceId: 'kspacey', targetId: 'swilliams' },
	// 		{ sourceId: 'swilliams', targetId: 'kbacon' },
	// 		{ sourceId: 'bpitt', targetId: 'kbacon' },
	// 		{ sourceId: 'hford', targetId: 'lwilson' },
	// 		{ sourceId: 'lwilson', targetId: 'kbacon' }
	// 	]
	// };
	const graph: ComponentProps<Dagre>['graph'] = {
		nodes: [
			{ name: 'A' },
			{ name: 'B' },
			{ name: 'C' },
			{ name: 'D' },
			{ name: 'E' },
			{ name: 'F' },
			{ name: 'G' },
			{ name: 'H' },
			{ name: 'I' }
		],
		edges: [
			{ sourceId: 'A', targetId: 'B' },
			{ sourceId: 'C', targetId: 'B' },
			{ sourceId: 'B', targetId: 'E' },
			{ sourceId: 'B', targetId: 'F' },
			{ sourceId: 'D', targetId: 'E' },
			{ sourceId: 'D', targetId: 'F' },
			{ sourceId: 'E', targetId: 'H' },
			{ sourceId: 'G', targetId: 'H' },
			{ sourceId: 'H', targetId: 'I' }
		]
	};

	// TODO: Switch to $state() after solving node re-layout issue
	let direction: ComponentProps<Dagre>['direction'] = 'left-right';
	let align: ComponentProps<Dagre>['align'] = 'up-left';
	let nodeSeparation: ComponentProps<Dagre>['nodeSeparation'] = 50;
	let curve: ComponentProps<CurveMenuField>['value'] = undefined;

	// TODO: Fix type
	// let selectedNode: (typeof graph)['nodes'][number] | null = null;
	let selectedNode: any = null;
</script>

<div>
	<div class="grid grid-cols-[1fr,1fr,1fr,1fr] gap-2 px-3 py-2 bg-surface-100 border-b">
		<MenuField
			label="Direction"
			bind:value={direction}
			options={[
				{ label: 'Top → Bottom', value: 'top-bottom' },
				{ label: 'Bottom → Top', value: 'bottom-top' },
				{ label: 'Left → Right', value: 'left-right' },
				{ label: 'Right → Left', value: 'right-left' }
			]}
			menuIcon=""
			stepper
			dense
		/>

		<MenuField
			label="Align"
			bind:value={align}
			options={[
				{ label: 'Up / Left', value: 'up-left' },
				{ label: 'Up / Right', value: 'up-right' },
				{ label: 'Down / Left', value: 'down-left' },
				{ label: 'Down / Right', value: 'down-right' }
			]}
			menuIcon=""
			stepper
			dense
		/>

		<MenuField
			label="Node Separation"
			bind:value={nodeSeparation}
			options={[
				{ label: 'Compact', value: 10 },
				{ label: 'Default', value: 50 },
				{ label: 'Comfortable', value: 100 }
			]}
			menuIcon=""
			stepper
			dense
		/>

		<CurveMenuField bind:value={curve} dense />
	</div>

	<div class="h-[600px] p-4">
		<Chart>
			<Svg>
				<Dagre {graph} {direction} {align} {nodeSeparation} let:nodes let:edges>
					<g class="edges">
						{#each edges as edge}
							<Spline
								data={edge.points}
								x="x"
								y="y"
								class="stroke-surface-content/30"
								tweened
								{curve}
							/>
						{/each}
					</g>

					<g class="nodes">
						{#each nodes as node}
							<Group
								x={node.x - node.width / 2}
								y={node.y - node.height / 2}
								tweened
								class="group"
								on:click={() => {
									selectedNode = node;
								}}
							>
								<Rect
									width={node.width}
									height={node.height}
									class={cls(
										'fill-surface-200 stroke-1 stroke-primary/50 group-hover:fill-primary/10 group-hover:cursor-pointer'
									)}
									rx={10}
								/>

								<Text
									value={node.label}
									x={node.width / 2}
									y={node.height / 2}
									dy={-2}
									textAnchor="middle"
									verticalAnchor="middle"
									class={cls('text-xs pointer-events-none')}
								/>
							</Group>
						{/each}
					</g>
				</Dagre>
			</Svg>
		</Chart>
	</div>
</div>

<Drawer open={selectedNode != null} on:close={() => (selectedNode = null)}>
	<Button icon={mdiClose} class="absolute right-0 m-1 p-1" on:click={() => (selectedNode = null)} />
	<div class="w-[480px] max-w-[95vw] p-6">
		<div class="mb-3 font-bold">Node details</div>
		{selectedNode.label}
	</div>
</Drawer>
