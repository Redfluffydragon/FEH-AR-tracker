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
		fontSize,
		showTooltips,
		dragged
  } from './stores';

	/**
	 * modal to view lift gain per season?
	 * Last defense date:
		* input last defense date by number of hours ago
		* paste last defense date in?
	 * Settings:
		* green total lift if greater than lift goal? Red if it's not possible to make it?
	 * don't store title text and stuff in localStorage? or add version control?
	 * Save past seasons
		* set starting lift for next season based on total lift from the previous season
		* set liftGoal based on last season's lift?
	 * fix defense margin when it's no longer possible to reach your goal - currently displays too high (not zero)
	 */

	$: localStorage.setItem('showColumns', JSON.stringify($showColumns));
	$: localStorage.setItem('columnData', JSON.stringify($columnData));
	$: localStorage.setItem('thisWeekData', JSON.stringify($thisWeekData));
	$: localStorage.setItem('darkMode', JSON.stringify($darkMode));
	$: localStorage.setItem('fontSize', JSON.stringify($fontSize));
	$: localStorage.setItem('showTooltips', JSON.stringify($showTooltips));

	onMount(() => {
		$darkMode && document.body.classList.add('dark-mode');

		document.addEventListener('touchmove', () => {
			$dragged = true;
		}, false);

		document.addEventListener('touchstart', () => {
			$dragged = false;
		}, false);
	});

	const settingsProps = {
		title: 'Settings',
		imageBtn: true,
		src: 'img/settings-icon.png',
	}

	// Linear function to limit the header font size to 3.5em so it doesn't go off screen
	$: document.body.style.setProperty('--header-scale', ($fontSize + 2) / $fontSize + 'em');
	$: document.body.style.setProperty('--font-size', $fontSize);

</script>
<div class="background"></div>

<Modal props="{settingsProps}">
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
		<br>
		<input type="range" min=1 max=1.5 step=0.05 id="fontSizeSlider" bind:value="{$fontSize}">
		<label for="fontSizeSlider">Font size: {Math.round($fontSize * 100)}%</label>
		<br>
		<button class:active="{!$showTooltips}" on:click="{() => { $showTooltips = !$showTooltips }}">Hide (touch-only) tooltips</button>
		<br>
		<button on:click="{() => localStorage.clear()}">Clear localStorage</button>
	</div>
</Modal>

<main class="flex flexColumn">
	<h1>Fire Emblem Heroes | Aether Raids lift calculator</h1>

	<MainTable />

	<br>
	<br>
	<br>
</main>

<style>
	:global(*) {
		font-weight: 100;
    font-size: calc(1.02rem * var(--font-size));
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

		--header-scale: 3em;
		--font-size: 1;

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
		margin-bottom: 0.5rem;
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
		font-size: var(--header-scale);
		font-weight: 100;
		text-shadow:
		0 0 2px var(--bg),
		0 0 5px var(--bg),
		0 0 10px var(--bg);
		margin-top: calc(0.67em * var(--font-size));
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