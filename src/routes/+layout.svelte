<script lang="ts">
	import { AppBar, AppLayout, NavItem, settings, ThemeSelect } from 'svelte-ux';
	import '../app.css';
	import { page } from '$app/stores';
	import { mdiHome } from '@mdi/js';

	let { children } = $props();

	settings({
		components: {
			AppLayout: {
				classes: {
					aside: 'border-r',
					nav: 'bg-surface-300 py-2'
				}
			},
			AppBar: {
				classes:
					'bg-primary text-primary-content shadow-md [text-shadow:1px_1px_2px_theme(colors.primary-700)]'
			},
			NavItem: {
				classes: {
					root: 'text-sm text-surface-content/70 pl-6 py-2 hover:bg-surface-100/70 relative',
					active:
						'text-primary bg-surface-100 font-medium before:absolute before:bg-primary before:rounded-full before:w-1 before:h-2/3 before:left-[6px] shadow z-10'
				}
			}
		}
	});
</script>

<AppLayout>
	<svelte:fragment slot="nav">
		<NavItem text="Home" icon={mdiHome} path="/" currentUrl={$page.url} />
	</svelte:fragment>

	<AppBar title="Example">
		<div slot="actions">
			<ThemeSelect />
		</div>
	</AppBar>

	<main>
		{@render children()}
	</main>
</AppLayout>
