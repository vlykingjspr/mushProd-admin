<script>
	import { currentPageTitle } from '$lib/stores/stores';
	import { LightSwitch } from '@skeletonlabs/skeleton';
</script>

<div class="flex justify-between items-center">
	<h1 class="font-bold ml-8 mt-4 text-5xl">{$currentPageTitle}</h1>
	<!-- <div class="mr-5">
		<LightSwitch />
	</div> -->
</div>
