<script lang="ts">
	import { page } from '$app/stores';
	import { Tab, TabAnchor, TabGroup } from '@skeletonlabs/skeleton';
</script>

<TabGroup active="variant-filled-primary">
	<TabAnchor href="/records/batch" selected={$page.url.pathname === '/records/batch'}>
		<div class="flex item-center">
			<span class="material-symbols-outlined pr-1"> psychiatry </span><span>Batch</span>
		</div>
	</TabAnchor>

	<TabAnchor href="/records/temp&humid" selected={$page.url.pathname === '/records/temp&humid'}>
		<div class="flex item-center">
			<span class="material-symbols-outlined pr-1"> thermostat </span>
			<span>Temperature & Humidity</span>
		</div>
	</TabAnchor>
</TabGroup>
<slot />
