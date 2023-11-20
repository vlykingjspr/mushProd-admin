<script lang="ts">
	import { page } from '$app/stores';
	import { Tab, TabAnchor, TabGroup } from '@skeletonlabs/skeleton';
</script>

<TabGroup active="variant-filled-primary">
	<TabAnchor href="/records/batch" selected={$page.url.pathname === '/records/batch'}>
		<i class="fa-solid fa-seedling fa-md pr-1" /><span>Batch</span>
	</TabAnchor>

	<TabAnchor href="/records/temp&humid" selected={$page.url.pathname === '/records/temp&humid'}>
		<i class="fa-solid fa-temperature-high fa-md pr-1" /><span>Temperature & Humidity</span>
	</TabAnchor>
</TabGroup>
<slot />
