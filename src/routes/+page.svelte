<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { Chart, Group, Rect, Spline, Svg, Text } from 'layerchart';
	import { Button, Drawer, Field, MenuField, SelectField } from 'svelte-ux';
	import dagre from '@dagrejs/dagre';
	import { cls } from '@layerstack/tailwind';
	import { mdiClose, mdiCog } from '@mdi/js';

	import Dagre from '$lib/Dagre.svelte';
	import CurveMenuField from '$lib/CurveMenuField.svelte';
	import TransformControls from '$lib/TransformControls.svelte';
	import { ancestors } from '$lib/utils.js';
	import type { ApiNodeData } from '$lib/types.js';
	import { fly, slide } from 'svelte/transition';

	let { data } = $props();

	const graph = {
		nodes: data.graph.nodes.map((n) => {
			return {
				id: n.node_name,
				label: n
			};
		}),
		edges: data.graph.edges
	};

	let direction: ComponentProps<Dagre>['direction'] = $state('left-right');
	let align: ComponentProps<Dagre>['align'] = $state('up-left');
	let nodeSeparation: ComponentProps<Dagre>['nodeSeparation'] = $state(50);
	let rankSeparation: ComponentProps<Dagre>['rankSeparation'] = $state(50);
	let curve: ComponentProps<CurveMenuField>['value'] = $state(undefined);

	let filterNodeId = $state<string | null>(null);
	let selectedNode = $state<(dagre.Node & ApiNodeData) | null>(null);
	let showSettings = $state(false);
</script>

<div>
	<div class="grid grid-cols-[1fr,1fr,auto] items-center gap-2 px-3 py-2 bg-surface-100 border-b">
		<SelectField
			label="Filter node"
			options={data.graph.nodes.map((n) => {
				return {
					label: n.node_name,
					value: n.node_name
				};
			})}
			bind:value={filterNodeId}
			dense
		/>
		<div></div>
		<Button
			icon={mdiCog}
			color={showSettings ? 'primary' : 'default'}
			variant="fill-light"
			on:click={() => (showSettings = !showSettings)}
		/>
	</div>

	<div class="h-[calc(100vh-128px)] p-4 overflow-hidden relative">
		{#if showSettings}
			<div
				class="absolute right-0 top-0 bottom-0 z-50 p-4 bg-surface-100/50 backdrop-blur-md border-l"
				transition:fly={{ x: '100%' }}
			>
				<div class="grid gap-3">
					<MenuField
						label="Direction"
						options={[
							{ label: 'Top → Bottom', value: 'top-bottom' },
							{ label: 'Bottom → Top', value: 'bottom-top' },
							{ label: 'Left → Right', value: 'left-right' },
							{ label: 'Right → Left', value: 'right-left' }
						]}
						bind:value={direction}
						menuIcon=""
						stepper
						dense
					/>

					<MenuField
						label="Align"
						options={[
							{ label: 'Up / Left', value: 'up-left' },
							{ label: 'Up / Right', value: 'up-right' },
							{ label: 'Down / Left', value: 'down-left' },
							{ label: 'Down / Right', value: 'down-right' }
						]}
						bind:value={align}
						menuIcon=""
						stepper
						dense
					/>

					<MenuField
						label="Node separation"
						options={[
							{ label: 'Compact', value: 10 },
							{ label: 'Default', value: 50 },
							{ label: 'Comfortable', value: 100 }
						]}
						bind:value={nodeSeparation}
						menuIcon=""
						stepper
						dense
					/>

					<MenuField
						label="Rank separation"
						options={[
							{ label: 'Compact', value: 10 },
							{ label: 'Default', value: 50 },
							{ label: 'Comfortable', value: 100 }
						]}
						bind:value={rankSeparation}
						menuIcon=""
						stepper
						dense
					/>
					<CurveMenuField label="Curve style" bind:value={curve} dense />
				</div>
			</div>
		{/if}
		<Chart
			transform={{
				mode: 'canvas',
				initialScrollMode: 'scale',
				tweened: { duration: 800, easing: cubicOut }
			}}
		>
			<TransformControls />
			<Svg>
				{#key filterNodeId}
					<Dagre
						data={graph}
						{direction}
						{align}
						{nodeSeparation}
						{rankSeparation}
						filterNodes={(nodeId, graph) => {
							if (filterNodeId) {
								// TODO: Do not grab upstream ancestors on each iteration
								const upstream = ancestors(graph, filterNodeId);
								return nodeId === filterNodeId || (upstream?.includes(nodeId) ?? false);
							} else {
								return true;
							}
						}}
					>
						{#snippet children({ nodes, edges }: { nodes: dagre.Node[]; edges: dagre.GraphEdge[] })}
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
								{#each nodes as node (node.label)}
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
												'fill-surface-200 stroke-2 stroke-primary/50 group-hover:fill-primary/10 group-hover:cursor-pointer'
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
						{/snippet}
					</Dagre>
				{/key}
			</Svg>
		</Chart>
	</div>
</div>

<Drawer open={selectedNode != null} on:close={() => (selectedNode = null)}>
	<Button icon={mdiClose} class="absolute right-0 m-1 p-1" on:click={() => (selectedNode = null)} />
	<div class="w-[480px] max-w-[95vw] p-4">
		<h2 class="mb-3 font-bold">Node details</h2>
		<div class="grid gap-2">
			<Field label="Name" dense>{selectedNode?.label}</Field>
			<Field label="Type" dense>{selectedNode?.node_type}</Field>
			<Field label="Tags" dense>
				<div class="flex flex-wrap gap-2 my-1">
					{#each selectedNode?.tags ?? [] as tag}
						<span
							class="text-xs px-2 border border-primary bg-primary-500/5 text-primary rounded-full font-semibold"
							>{tag}</span
						>
					{/each}
				</div>
			</Field>
		</div>
	</div>
</Drawer>
