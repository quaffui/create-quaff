<script lang="ts">
	import '../styles/app.{{styleExtension}}';
	import { Quaff } from '@quaffui/quaff';

	let { children } = $props();
</script>

<QLayout class="main-layout">
	{#snippet header()}
		<QHeader class="elevate-2">
			<QToolbarTitle>{{projectName}}</QToolbarTitle>
			<QBtn
				icon={Quaff.darkMode.isActive ? 'light_mode' : 'dark_mode'}
				flat
				round
				onclick={Quaff.darkMode.toggle}
			/>
			<QBtn icon="help" flat />
		</QHeader>
	{/snippet}
	{#snippet railbarLeft()}
		<QRailbar class="surface no-round" bordered width={120}>
			<QList>
				<QItem to="/">
					<QIcon name="home" />
					<QItemSection>Home</QItemSection>
				</QItem>
				<QItem href="https://quaff.dev" target="_blank">
					<QIcon name="menu_book" />
					<QItemSection>Quaff Docs</QItemSection>
				</QItem>
				<QItem href="https://github.com/quaffui/quaff" target="_blank">
					<QIcon name="open_in_new" />
					<QItemSection>Quaff GitHub</QItemSection>
				</QItem>
			</QList>
		</QRailbar>
	{/snippet}
	{#snippet content()}
		{@render children?.()}
	{/snippet}
</QLayout>
