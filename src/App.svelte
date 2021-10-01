<script>
	import { onMount } from "svelte";
	import MainTable from "./MainTable.svelte";
	import Modal from './Modal.svelte';

	import {
		showColumns,
		columnOrder,
		darkMode,
		goalColor,
		inputData,
		fontSize,
		showTooltips,
		autoReset,
		dragged,
		exportOptions,
		lastStoredSeason
  } from './stores';

	/**
	 * input last defense date by number of hours ago
	 * min and max for inputs?
	 */

	$: localStorage.setItem('showColumns', JSON.stringify($showColumns));
	$: localStorage.setItem('columnOrder', JSON.stringify($columnOrder));
	$: localStorage.setItem('thisWeekData', JSON.stringify($inputData));
	$: localStorage.setItem('goalColor', JSON.stringify($goalColor));
	$: localStorage.setItem('darkMode', JSON.stringify($darkMode));
	$: localStorage.setItem('fontSize', JSON.stringify($fontSize));
	$: localStorage.setItem('showTooltips', JSON.stringify($showTooltips));
	$: localStorage.setItem('exportOptions', JSON.stringify($exportOptions));
	$: localStorage.setItem('lastStoredSeason', JSON.stringify($lastStoredSeason));
	$: localStorage.setItem('autoReset', JSON.stringify($autoReset));

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
		closeText: 'Close',
		spinBtn: true,
	}

	// Linear function to limit the header font size to 3.5em so it doesn't go off screen
	$: document.body.style.setProperty('--header-scale', ($fontSize + 2) / $fontSize + 'em');
	$: document.body.style.setProperty('--font-size', $fontSize);

</script>
<div class="background"></div>

<div class="settings">
	<Modal props="{settingsProps}">
		<div slot="content" class="center fullWidth">
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
			<button class:active="{$autoReset}" on:click="{() => { $autoReset = !$autoReset }}">Auto reset at end of season</button>
			<br>
			<button>Input last defense by hours ago</button>
			<br>
			<button on:click="{() => localStorage.clear()}">Clear localStorage</button>
		</div>
	</Modal>
</div>

<main class="center">
	<h1>Fire Emblem Heroes | Aether Raids lift calculator</h1>

	<MainTable />

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
		--bg: #FFFFFF;
		--color: rgb(0, 0, 0);
		--heading-color: rgb(0, 0, 0);

		--btn-bg: rgb(244, 244, 244);
		--btn-color: rgb(51, 51, 51);
		--savebtn-bg: rgb(112, 188, 255);
		--active-highlight: inset 5px 5px 15px rgba(0, 0, 0, 0.3), inset -5px -5px 15px rgba(255, 255, 255, 0.3);
		--clicked-higlight: inset 0 0 5px rgba(0, 0, 0, 0.5);

		--transparent-bg: rgba(255, 255, 255, 0.8);
		--bg-img-src: url('img/BG_Alfheim.png');
		--invert: 0;

		--header-scale: 3em;
		--font-size: 1;

		--goal-lift-bg: var(--bg);
		--goal-offenses-bg: var(--bg);
		--goal-min-lift-bg: var(--bg);
		--goal-defense-margin-bg: var(--bg);
		--goal-max-lift-bg: var(--bg);

		background: var(--bg);
	}

	:global(body.dark-mode) {
		--bg: rgb(40, 40, 40);
		--color: rgb(200, 200, 200);
		--heading-color: rgb(255, 255, 255);
		
		--btn-bg: rgb(30, 30, 30);
		--btn-color: rgb(255, 255, 255);
		--savebtn-bg: rgb(24, 77, 201);
		--active-highlight: inset 5px 5px 15px rgb(0, 0, 0), inset -5px -5px 15px rgba(187, 187, 187, 0.1);
		--clicked-higlight: inset 0 0 5px rgb(0, 0, 0), inset 0 0 10px rgb(0, 0, 0);

		--transparent-bg: rgba(0, 0, 0, 0.8);
		--bg-img-src: url('img/FEH_Dokkalfheimr.png');
		--invert: 100%;
	}

	:global(input, select) {
		text-align: center;
    color: var(--color);
		background: var(--bg);
	}

	:global(input[type=checkbox]) {
		width: 0.7em;
		height: 0.7em;
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

	:global(button:not(:active):hover) {
		filter: brightness(0.95);
	}

	:global(button:not(:disabled):active) {
		filter: brightness(0.85);
		box-shadow: var(--clicked-higlight);
	}

	:global(.saveBtn) {
		background: var(--savebtn-bg);
	}

	main {
		padding: 1rem;
		width: 100%;
		gap: 1rem;
		min-height: 100%;
		box-sizing: border-box;
		flex-flow: column;
		display: flex;
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

	.settings {
		padding: 1rem;
		position: absolute;
	}

	.active {
		box-shadow: var(--active-highlight);
	}

	.center {
		text-align: center;
	}

	.fullWidth * {
		width: 100%;
	}
</style>