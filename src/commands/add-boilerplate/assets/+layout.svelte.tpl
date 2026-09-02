<script lang="ts">
  import "../styles/app.{{styleExtension}}";
  import { Quaff } from "@quaffui/quaff";

  let { children } = $props();

  Quaff.init();
</script>

<QLayout class="main-layout">
  {#snippet header()}
    <QHeader class="elevate-2">
      <QHeaderTitle>{{projectName}}</QHeaderTitle>
      <QBtn
        icon={Quaff.darkMode.isActive ? "light_mode" : "dark_mode"}
        flat
        onclick={Quaff.darkMode.toggle}
      />
      <QBtn icon="help" flat />
    </QHeader>
  {/snippet}

  {#snippet railbarLeft()}
    <QRailbar class="surface no-round" bordered width={120}>
      <QNavItem to="/" icon="home" label="Home" />
      <QNavItem href="https://quaff.dev" target="_blank" icon="menu_book" label="Quaff Docs" />
      <QNavItem
        href="https://github.com/quaffui/quaff"
        target="_blank"
        icon="open_in_new"
        label="Quaff GitHub"
      />
    </QRailbar>
  {/snippet}

  {#snippet content()}
    {@render children?.()}
  {/snippet}
</QLayout>
