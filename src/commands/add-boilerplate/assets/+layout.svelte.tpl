<script lang="ts">
	import '../styles/app.{{styleExtension}}';
	import { Quaff } from '@quaffui/quaff';
</script>

<QLayout class="main-layout" leftRailbarWidth="120">
	<QHeader slot="header" class="elevate-2">
		<QToolbarTitle>{{projectName}}</QToolbarTitle>
		<QBtn
			icon={$Quaff.dark.isActive ? 'light_mode' : 'dark_mode'}
			flat
			round
			on:click={$Quaff.dark.toggle}
		/>
		<QBtn icon="help" flat />
	</QHeader>
	<QRailbar slot="railbarLeft" class="surface no-round" bordered>
		<QList>
			<QItem to="/">
				<QIcon name="home" />
				<QItemSection>Home</QItemSection>
			</QItem>
			<QItem href="https://github.com/quaffui/quaff" target="_blank">
				<QIcon name="open_in_new" />
				<QItemSection>Quaff GitHub</QItemSection>
			</QItem>
		</QList>
	</QRailbar>
	<div slot="content">
		<slot />
	</div>
</QLayout>
