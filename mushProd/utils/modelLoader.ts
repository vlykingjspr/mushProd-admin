// YourSvelteComponent.svelte

import { onMount } from 'svelte';
import { loadModel, LoadedModel } from '../utils/modelLoader';

let myModel: any;
let scalerX: any;
let scalerY: any;

onMount(async () => {
    const { model, scalerX, scalerY }: LoadedModel = loadModel();
    myModel = model;
    scalerX = scalerX;
    scalerY = scalerY;
});


