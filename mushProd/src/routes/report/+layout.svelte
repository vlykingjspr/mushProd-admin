<script lang="ts">
	import { page } from '$app/stores';
	import { Tab, TabAnchor, TabGroup } from '@skeletonlabs/skeleton';
</script>

<TabGroup active="variant-filled-primary">
	<TabAnchor href="/report/growing-bag" selected={$page.url.pathname === '/report/growing-bag'}>
		<div class="flex item-center">
			<span class="material-symbols-outlined pr-1"> weight </span>

			<span>Growing Bags</span>
		</div>
	</TabAnchor>

	<TabAnchor href="/report/harvest-data" selected={$page.url.pathname === '/report/harvest-data'}>
		<div class="flex item-center">
			<span class="material-symbols-outlined pr-1"> potted_plant </span>
			<span>Harvest</span>
		</div>
	</TabAnchor>
	<TabAnchor
		href="/report/temp-humid-data"
		selected={$page.url.pathname === '/report/temp-humid-data'}
	>
		<div class="flex item-center">
			<span class="material-symbols-outlined pr-1"> thermostat </span>
			<span>Temperature & Humidity</span>
		</div>
	</TabAnchor>
	<TabAnchor
		href="/report/mushroom-yield-data"
		selected={$page.url.pathname === '/report/mushroom-yield-data'}
	>
		<div class="flex item-center">
			<span class="material-symbols-outlined pr-1"> psychiatry </span>
			<span>Mushroom & Yield Prediction</span>
		</div>
	</TabAnchor>
</TabGroup>
<slot />
