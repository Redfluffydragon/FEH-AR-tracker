<script>
	/**
	 * Display what season it is
	 * input last defense date by number of hours ago
	 * save different lift gain/loss by season
	 * better dark mode
	 * add undo for rearranging
	 */

	import { dndzone } from 'svelte-dnd-action';

	import DataColumn from './DataColumn.svelte';
	import Modal from './Modal.svelte';

	import {
		edit,
		showColumns,
		thisWeekData
  } from './stores';

	$: localStorage.setItem('showColumns', JSON.stringify($showColumns));

	$: localStorage.setItem('thisWeekData', JSON.stringify($thisWeekData));

	let tempData = [];

	function startEdit() {
		$showColumns.forEach((item, idx) => tempData[idx] = item);
		$edit = true;
	}

	function saveEdit() {
		$edit = false;
	}

	function cancelEdit() {
		tempData.forEach((item, idx) => $showColumns[idx] = item);
		$edit = false;
	}

	let items = $thisWeekData;
	$: dragDisabled = !$edit;
	const flipDurationMs = 300;
	
	function handleDnd(e) {
		console.log(e.detail.items);
		items = e.detail.items;
		$thisWeekData = e.detail.items;
	}

	let settingsData = {
		title: 'Settings',
		src: 'img\\settings-icon.png',
		content: `
			<ul>
				<li>
					Dark mode
				</li>
				<li>
					
				</li>
			</ul>`,
	};
</script>

<main class="flex flexColumn">
	<h1>FEH AR season lift calculator</h1>

	<Modal data="{settingsData}" />

	<div use:dndzone="{{items, flipDurationMs, dragDisabled}}" on:consider="{handleDnd}" on:finalize="{handleDnd}" class="mainGrid">
		{#each items as data(data.id)}
			<DataColumn data="{data}" />
		{/each}
	</div>

	<div>
		{#if $edit}
			<button on:click="{saveEdit}">Save</button>
			<button on:click="{cancelEdit}">Cancel</button>
			<button on:click="{() => {$showColumns = new Array(16).fill(true)}}">Show all</button>
		{:else}
			<button class="edit-btn" on:click="{startEdit}">Edit</button>
		{/if}
	</div>

	<div class="left">
		<button on:click="{
			() => { 
				document.body.classList.toggle('dark-mode');
			}
		}">Dark mode</button>
	</div>

</main>

<style>
	:global(body.dark-mode) {
		background: #000;
		filter: invert(100%);
	}

	:global(body) {
		background: white;
	}

	:global(input) {
		text-align: center;
	}

	main {
		text-align: center;
		padding: 1em;
		width: 100%;
		box-sizing: border-box;
	}

	h1 {
		color: hsl(216, 85%, 64%);
		text-transform: uppercase;
		font-size: 3em;
		font-weight: 100;
	}

	.flexColumn {
		flex-flow: column;
	}

	.flex {
		display: flex;
	}

	.mainGrid {
		position: relative;
		display: grid;
		gap: 1.2ch 0.3ch;
		width: 100%;
		grid-template-columns: repeat(auto-fit, minmax(12ch, 1fr));
		align-self: center;
	}
 
	.edit-btn {
		margin-top: 1em;
	}
</style>