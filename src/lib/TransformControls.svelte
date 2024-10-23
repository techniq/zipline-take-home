<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { transformContext } from 'layerchart';
	import { Button, Icon, MenuButton, Tooltip } from 'svelte-ux';
	import { cls } from '@layerstack/tailwind';

	import {
		mdiArrowULeftTop,
		mdiMagnifyPlusOutline,
		mdiMagnifyMinusOutline,
		mdiImageFilterCenterFocus,
		mdiChevronDown,
		mdiResize,
		mdiArrowExpandAll,
		mdiCancel
	} from '@mdi/js';

	type Placement =
		| 'top-left'
		| 'top'
		| 'top-right'
		| 'left'
		| 'center'
		| 'right'
		| 'bottom-left'
		| 'bottom'
		| 'bottom-right';

	type Actions = 'zoomIn' | 'zoomOut' | 'center' | 'reset' | 'scrollMode';
	interface Props {
		placement?: Placement;
		orientation?: 'horizontal' | 'vertical';
		size?: ComponentProps<Button>['size'];
		show?: Actions[];
		class?: string;
	}

	let {
		placement = 'top-right',
		orientation = 'vertical',
		size = 'md',
		show = ['zoomIn', 'zoomOut', 'center', 'reset', 'scrollMode'],
		...restProps
	}: Props = $props();

	let menuPlacementByOrientationAndPlacement = $derived({
		horizontal: {
			'top-left': 'bottom-end',
			top: 'bottom-end',
			'top-right': 'bottom-end',
			left: 'bottom-end',
			center: 'bottom-end',
			right: 'bottom-end',
			'bottom-left': 'top-end',
			bottom: 'top-end',
			'bottom-right': 'top-end'
		},
		vertical: {
			'top-left': 'right-start',
			top: 'right-start',
			'top-right': 'left-start',
			left: 'right-start',
			center: 'right-start',
			right: 'left-start',
			'bottom-left': 'right-end',
			bottom: 'right-end',
			'bottom-right': 'left-end'
		}
	} as const);

	const transform = transformContext();
	const scrollMode = transform.scrollMode;
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class={cls(
		'bg-surface-200/50 rounded-full m-1 backdrop-blur z-10 flex',
		orientation === 'vertical' && 'flex-col',
		{
			'top-left': 'absolute top-0 left-0',
			top: 'absolute top-0 left-1/2 -translate-x-1/2',
			'top-right': 'absolute top-0 right-0',
			left: 'absolute top-1/2 left-0 -translate-y-1/2',
			center: 'absolute top-1/2 left-1/2 -translate-x-1/2  -translate-y-1/2',
			right: 'absolute top-1/2 right-0 -translate-y-1/2',
			'bottom-left': 'absolute bottom-0 left-0',
			bottom: 'absolute bottom-0 left-1/2 -translate-x-1/2',
			'bottom-right': 'absolute bottom-0 right-0'
		}[placement],
		restProps.class
	)}
	ondblclick={(e) => {
		// Stop from propagating to TransformContext
		e.stopPropagation();
	}}
>
	{#if show.includes('zoomIn')}
		<Tooltip title="Zoom in">
			<Button
				icon={mdiMagnifyPlusOutline}
				{size}
				on:click={() => transform.zoomIn()}
				class="text-surface-content"
			/>
		</Tooltip>
	{/if}

	{#if show.includes('zoomOut')}
		<Tooltip title="Zoom out">
			<Button
				icon={mdiMagnifyMinusOutline}
				{size}
				on:click={() => transform.zoomOut()}
				class="text-surface-content"
			/>
		</Tooltip>
	{/if}

	{#if show.includes('center')}
		<Tooltip title="Center">
			<Button
				icon={mdiImageFilterCenterFocus}
				{size}
				on:click={() => transform.translateCenter()}
				class="text-surface-content"
			/>
		</Tooltip>
	{/if}

	{#if show.includes('reset')}
		<Tooltip title="Reset">
			<Button
				icon={mdiArrowULeftTop}
				{size}
				on:click={() => transform.reset()}
				class="text-surface-content"
			/>
		</Tooltip>
	{/if}

	{#if show.includes('scrollMode')}
		<Tooltip title="Scroll mode">
			<MenuButton
				iconOnly
				options={[
					{ label: 'None', value: 'none', icon: mdiCancel },
					{ label: 'Zoom', value: 'scale', icon: mdiResize },
					{ label: 'Move', value: 'translate', icon: mdiArrowExpandAll }
				]}
				menuProps={{ placement: menuPlacementByOrientationAndPlacement[orientation][placement] }}
				menuIcon={null}
				value={$scrollMode}
				{size}
				on:change={(e) => transform.setScrollMode(e.detail.value)}
				class="text-surface-content"
			>
				{#snippet selection({ value }: any)}
					<Icon data={value?.icon ?? mdiChevronDown} />
				{/snippet}
			</MenuButton>
		</Tooltip>
	{/if}
</div>
