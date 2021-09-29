<script>
	import { onMount } from "svelte";
	import MainTable from "./MainTable.svelte";
	import Modal from './Modal.svelte';

	import {
		showColumns,
		columnData,
		darkMode,
		goalColor,
		thisWeekData,
		singleOffenseDisplay,
  } from './stores';

	/**
	 * automatically display what season it is
	   * save different lift gain/loss by season
	 * input last defense date by number of hours ago
	 * paste last defense date in?
	 * settings
	   * green total lift if greater than lift goal? Red if it's not possible to make it?
	   * display number of double vs single offense matches
		 * scale? for readability
	 * tooltips or something for mobile to see title text?
	 * don't store title text and stuff in localStorage? or add version control?
	 * Save past seasons
	   * set starting lift for next season based on total lift from the previous season
		 * set liftGoal based on last season's lift?
	 * fix defense margin when it's no longer possible to reach your goal
	 */

	$: localStorage.setItem('showColumns', JSON.stringify($showColumns));
	$: localStorage.setItem('columnData', JSON.stringify($columnData));
	$: localStorage.setItem('thisWeekData', JSON.stringify($thisWeekData));
	$: localStorage.setItem('darkMode', JSON.stringify($darkMode));
	$: localStorage.setItem('singleOffenseDisplay', JSON.stringify($singleOffenseDisplay));

	onMount(() => {
		$darkMode && document.body.classList.add('dark-mode');
	});

	const settingsProps = {
		title: 'Settings',
		imageBtn: true,
		src: 'img/settings-icon.png',
	}
</script>
<div class="background"></div>

<Modal props="{settingsProps}">
	<div slot="content">
		<button class:active="{!$singleOffenseDisplay}" on:click="{() => {
			$singleOffenseDisplay = !$singleOffenseDisplay;
		}}">Display number of double offense matches</button>

		<br>

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
		<br>
		<input type="range" min=1 max=2 step=0.05 value=1 id="zoomSlider">
		<label for="zoomSlider">Zoom</label>
	</div>
</Modal>

<main class="flex flexColumn">
	<h1>FEH AR season lift calculator</h1>

	<MainTable />

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
		--bg-img-src: url('img/BG_Alfheim.png');
		--invert: 0;

		background: var(--bg);
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
		--bg-img-src: url('img/FEH_Dokkalfheimr.png');
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

	.active {
		box-shadow: inset 0 0 15px 3px var(--active-highlight);
	}

	.flexColumn {
		flex-flow: column;
	}

	.flex {
		display: flex;
	}
</style>