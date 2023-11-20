<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
	import Batch from './batch/+page.svelte';
	import Planted from './planted/+page.svelte';
	import Harvested from './harvested/+page.svelte';

	import TempAndHumid from './temp&humid/+page.svelte';
	import { tabNum, updateTab } from './pageTab';
</script>
