<script>
	/**
	 * automatically display what season it is
	 * input last defense date by number of hours ago
	 * paste last defense date in?
	 * save different lift gain/loss by season
	 * better dark mode
	 * color scheme options
	 * cancel edit doesn't work with show all
	 * settings
	 * tooltips or something for mobile to see title text?
	 * don't store title text and stuff in localStorage? or add version control?
	 */

	import MainTable from "./MainTable.svelte";
	import Modal from './Modal.svelte';

	import {
		dataKeys,
		edit,
		showColumns,
		columnData,
		defaultShow,
		darkMode,
		thisWeekData,
  } from './stores';

	$: localStorage.setItem('showColumns', JSON.stringify($showColumns));
	$: localStorage.setItem('columnData', JSON.stringify($columnData));
	$: localStorage.setItem('thisWeekData', JSON.stringify($thisWeekData));

	let tempShowColumns = {};
	let tempColumnData = [];

	let dragDisabled = true;

	function startEdit() {
		for (let i of dataKeys) {
			tempShowColumns[i] = $showColumns[i];
		}
		$columnData.forEach((item, idx) => tempColumnData[idx] = item);
		
		$edit = true;
		setTimeout(() => { // Otherwise the drag and drop activates before the hidden columns are shown and it messes everything up
			dragDisabled = false;
		}, 20);
	}

	function saveEdit() {
		$edit = false;
		dragDisabled = true;
	}

	function cancelEdit() {
		for (let i of dataKeys) {
			$showColumns[i] = tempShowColumns[i];
		}
		tempColumnData.forEach((item, idx) => $columnData[idx] = item);

		$edit = false;
		dragDisabled = true;
	}
</script>

<img src="img/BG_Brave.webp" alt="Background art" class="background">

<main class="flex flexColumn">
	<h1>FEH AR season lift calculator</h1>

	<Modal props="{{
		imageBtn: true,
		title: 'Settings',
		src: 'img\\settings-icon.png',
	}}">

		<div slot="content">
			<button on:click="{
				() => {
					document.body.classList.toggle('dark-mode');
					$darkMode = !$darkMode;
					document.body.setAttribute('dark-mode', $darkMode);
				}
			}">Dark mode</button>
		</div>
	</Modal>

	<MainTable dragDisabled="{dragDisabled}" />

	<div class="z-0">
		{#if $edit}
			<span class="editTip">Drag and drop to rearrange</span>
			<br>
			<button on:click="{saveEdit}" class="saveBtn">Save</button>
			<button on:click="{cancelEdit}">Cancel</button>
			<button on:click="{() => {$showColumns = defaultShow}}">Show all</button>
		{:else}
			<button class="edit-btn" on:click="{startEdit}">Edit</button>
		{/if}
	</div>

	<div>
		<button on:click="{() => localStorage.clear()}">Clear localStorage</button>
	</div>

</main>

<style>
	:global(*) {
		font-weight: 100;
    color: #000;
    font-size: 1.02rem;
	}

	:global(body.dark-mode) {
		filter: invert(100%);
		/* filter: brightness(0.5); */
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
	}

	h1 {
		color: #000;
		text-transform: uppercase;
		font-size: 3rem;
		font-weight: 100;
		text-shadow: 0 0 15px black;
	}

	.editTip {
		display: inline-block;
		padding: 5px 7px;
		margin-bottom: 1rem;
		width: auto;
		background: rgba(231, 231, 231, 0.733);
		border-radius: 3px;
	}

	.flexColumn {
		flex-flow: column;
	}

	.flex {
		display: flex;
	}

	.z-0 {
		z-index: 0;
	}
</style>