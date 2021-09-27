<script>
	import { onMount } from "svelte";
	import MainTable from "./MainTable.svelte";
	import Modal from './Modal.svelte';

	import {
		dataKeys,
		edit,
		showColumns,
		columnData,
		defaultShow,
		darkMode,
		goalColor,
		thisWeekData,
  } from './stores';

	/**
	 * automatically display what season it is
	   * save different lift gain/loss by season
	 * input last defense date by number of hours ago
	 * paste last defense date in?
	 * settings
	   * better dark mode
	   * green total lift if greater than lift goal?
	 * tooltips or something for mobile to see title text?
	 * don't store title text and stuff in localStorage? or add version control?
	 * display number of double vs single offense matches
	 * Save all past seasons
	   * set starting lift for next season based on total lift from the previous season
	 * fix defense margin when it's no longer possible to reach your goal
	 * change dndzone highlight color
	 * liftGoal input doesn't display value when page is first loaded
	 */

	$: localStorage.setItem('showColumns', JSON.stringify($showColumns));
	$: localStorage.setItem('columnData', JSON.stringify($columnData));
	$: localStorage.setItem('thisWeekData', JSON.stringify($thisWeekData));
	$: localStorage.setItem('darkMode', JSON.stringify($darkMode));

	onMount(() => {
		$darkMode && document.body.classList.add('dark-mode');
	})

	let tempShowColumns = {};
	let tempColumnData = [];

	let dragDisabled = true;

	function startEdit() {
		for (let i of dataKeys) {
			tempShowColumns[i] = $showColumns[i];
		}
		$columnData.forEach((item, idx) => tempColumnData[idx] = item);
		
		$edit = true;
		// Otherwise the drag and drop activates before the hidden columns are shown and it messes everything up
		setTimeout(() => {
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

<img src="{$darkMode ? 'img/FEH_Dokkalfheimr.png' : 'img/BG_Alfheim.png'}" alt="Background art" class="background">

<main class="flex flexColumn">
	<h1>FEH AR season lift calculator</h1>

	<Modal props="{{
		imageBtn: true,
		title: 'Settings',
		src: 'img/settings-icon.png',
	}}">

		<div slot="content">
			<button class:active="{$goalColor}" on:click="{() => {
				$goalColor = !$goalColor;
			}}">Color display for goal</button>
			<br>
			<button class:active="{$darkMode}" on:click="{
				() => {
					$darkMode ? document.body.classList.remove('dark-mode') : document.body.classList.add('dark-mode');
					$darkMode = !$darkMode;
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
    font-size: 1.02rem;
    color: var(--color);
	}

	:global(body) {
		--bg: rgb(255, 255, 255);
		--color: rgb(0, 0, 0);
		--heading-color: rgb(0, 0, 0);
		--btn-bg: rgb(244, 244, 244);
		--btn-color: rgb(51, 51, 51);
		--savebtn-bg: rgb(112, 188, 255);
		--active-highlight: rgb(150, 150, 150);
		--transparent-bg: rgba(255, 255, 255, 0.8);
		--invert: 0;
	}

	:global(body.dark-mode) {
		--bg: rgb(40, 40, 40);
		--color: rgb(200, 200, 200);
		--heading-color: rgb(255, 255, 255);
		--btn-bg: rgb(30, 30, 30);
		--btn-color: rgb(255, 255, 255);
		--savebtn-bg: rgb(24, 77, 201);
		--active-highlight: rgb(0, 0, 0);
		--transparent-bg: rgba(0, 0, 0, 0.8);
		--invert: 100%;
	}

	:global(input, select) {
		text-align: center;
    color: var(--color);
		background: var(--bg);
	}

	:global(button) {
		color: var(--btn-color);
		background: var(--btn-bg);
		cursor: pointer;
		outline: none;
		border: none;
		padding: 7px 10px;
	}

	:global(button:hover) {
		filter: brightness(0.95);
	}

	:global(button:not(:disabled):active) {
		filter: brightness(0.85);
	}

	:global(.saveBtn) {
		background: var(--savebtn-bg);
	}

	.background {
		position: fixed;
		z-index: -1;
		overflow: hidden;
		min-height: 100%;
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
		color: var(--heading-color);
		text-transform: uppercase;
		font-size: 3rem;
		font-weight: 100;
		text-shadow: 0 0 15px var(--color);
	}

	.editTip {
		display: inline-block;
		padding: 5px 7px;
		margin-bottom: 1rem;
		width: auto;
		background: var(--transparent-bg);
		border-radius: 3px;
	}

	.active {
		box-shadow: inset 0 0 15px 3px var(--active-highlight);
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