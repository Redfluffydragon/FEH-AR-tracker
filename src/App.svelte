<script>
	/**
	 * Automatically display what season it is
	 * input last defense date by number of hours ago
	 * paste last defense date in?
	 * save different lift gain/loss by season
	 * better dark mode
	 * add undo for rearranging
	 * color scheme options
	 * update time stuff with requestAnimationFrame
	 */

	import { dndzone } from 'svelte-dnd-action';

	import DataColumn from './DataColumn.svelte';
	import Modal from './Modal.svelte';

	import {
		dataKeys,
		edit,
		showColumns,
		columnData,
		defaultShow,
		darkMode,
		thisWeekData
  } from './stores';

	$: localStorage.setItem('showColumns', JSON.stringify($showColumns));
	$: localStorage.setItem('thisWeekData', JSON.stringify($thisWeekData));

	let tempData = {};
	let dragDisabled = true;

	function startEdit() {
		for (let i in dataKeys) {
			tempData[i] = $showColumns[i];
		}
		// tempData = $showColumns.map(i => i);
		// $showColumns.forEach((item, idx) => tempData[idx] = item);
		$edit = true;
		setTimeout(() => { // Otherwise the dndZone activates before the hidden columns are shown and it messes everything up
			dragDisabled = false;
		}, 20);
	}

	function saveEdit() {
		$edit = false;
		dragDisabled = true;
	}

	function cancelEdit() {
		// $showColumns = tempData.map(i => i);
		// tempData.forEach((item, idx) => $showColumns[idx] = item);
		for (let i in dataKeys) {
			$showColumns[i] = tempData[i];
		}
		$edit = false;
		dragDisabled = true;
	}

	$: items = $columnData;
	const flipDurationMs = 300;
	
	function handleDnd(e) {
		// console.log(e.detail.items);
		// items = e.detail.items;
		$columnData = e.detail.items;
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

<img src="img/BG_Brave.webp" alt="" class="background">

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
			<button on:click="{saveEdit}" class="saveBtn">Save</button>
			<button on:click="{cancelEdit}">Cancel</button>
			<button on:click="{() => {$showColumns = defaultShow}}">Show all</button>
		{:else}
			<button class="edit-btn" on:click="{startEdit}">Edit</button>
		{/if}
	</div>

	<div class="left">
		<button on:click="{
			() => {
				document.body.classList.toggle('dark-mode');
				$darkMode = !$darkMode;
				document.body.setAttribute('dark-mode', $darkMode);
			}
		}">Dark mode</button>
	</div>

	<div>
		<button on:click="{() => localStorage.clear()}">Clear localStorage</button>
		<br>
		Edit: {$edit}
		<br>
		dragDisabled: {dragDisabled}
	</div>

</main>

<style>
	:global(body.dark-mode) {
		/* background: linear-gradient(90deg, rgb(20, 20, 20), black); */
		filter: invert(100%);
	}

	:global(input) {
		text-align: center;
	}

	:global(.saveBtn) {
		background: rgb(112, 188, 255);
	}

	.background {
		position: fixed;
		z-index: -1;
		overflow: hidden;
	}

	main {
		text-align: center;
		padding: 1rem;
		width: 100%;
		gap: 1rem;
		min-height: 100%;
		box-sizing: border-box;
		/* background: linear-gradient(135deg, white, lightgray); */
		/* background-image: url("img/BG-Brave.webp"); */
	}

	h1 {
		/* color: hsl(216, 85%, 64%); */
		color: #000;
		text-transform: uppercase;
		font-size: 3rem;
		font-weight: 100;
		text-shadow: 0 0 15px black;
	}

	.flexColumn {
		flex-flow: column;
	}

	.flex {
		display: flex;
	}

	.mainGrid {
		background: rgba(255, 255, 255, 0.9);
		padding: 1rem;
		position: relative;
		display: grid;
		gap: 1ch 0.3ch;
		width: calc(100% - 1rem);
		grid-template-columns: repeat(auto-fit, minmax(12ch, 1fr));
		align-self: center;
		border-radius: 7px;
	}

	body[dark-mode = true] {
		filter: invert(0%);
	}
</style>