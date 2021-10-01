<script>
	import { onMount } from 'svelte';
	import { flip } from "svelte/animate";
  import { fly } from "svelte/transition";
	import { dndzone } from 'svelte-dnd-action';
  import Tooltip from './Tooltip.svelte';
	import Modal from './Modal.svelte';

	import {
    dataKeys,
		edit,
    darkMode,
    goalColor,
		showColumns,
		columnOrder,
    columnData,
		inputData as data,
    exportOptions,
    lastStoredSeason,
    autoReset,
    tiers
  } from './stores';

  import { getEndDate } from "./utils";

  /**
   * Take a duration in milliseconds and convert it to hh:mm:ss format
   * @param {A duration in milliseconds} milliseconds
   * @returns A time string
   */
  function parseTime(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = ('0' + Math.floor((milliseconds % 3600000) / 60000)).slice(-2);
    const seconds = ('0' + Math.floor((milliseconds % 60000) / 1000)).slice(-2);
    return `${hours}:${minutes}:${seconds}`;
  }

  /**
   * Convert a time in milliseconds to a human-readable string
   * @param {Number} milliseconds
   * @returns A date string
   */
  function parseDate(milliseconds) {
    const msToDate = new Date(milliseconds);
    return `${msToDate.getMonth() + 1}/${msToDate.getDate()}/${msToDate.getFullYear()}`;
  }

  /**
   * Get the time left under lift loss control from the date of the last defense not under LLC.
   * @param {Date} lastDefenseDate The date of the last defense not under LLC.
   *
   */
  function getLLCTimeLeft(lastDefenseDate) {
		if (!lastDefenseDate) {
			return 0;
		}
		lastDefenseDate = new Date(lastDefenseDate);
		const now = new Date();
		return Math.max((lastDefenseDate.valueOf() + 7.2e+7 - now), 0);
	}

  /**
   * Get the time until you can lose one less defense than you can now.
   * @param {Date} lastDefenseDate
   */
	function getTimeToFewerDef(lastDefenseDate) {
		lastDefenseDate = new Date(lastDefenseDate);

		if (getDefCanLose(lastDefenseDate) <= 0) {
			return 'N/A';
		}
		return parseTime(getDefCanLose(lastDefenseDate, false) + getLLCTimeLeft(lastDefenseDate));
	}

  /**
   * Get the current AR season from the input date
   * @param {Date} date
   * @returns 1 for Light/Dark season, 0 for Astra/Anima season
   */
  function getSeason(date) {
    // Mon Sep 20 2021 23:00:00 GMT+0000 - end of recent light season as of the time of this writing
    const knownLightSeason = new Date(1632178800000);

    // Subtract known season, then divide by ms in a week and truncate to get how many weeks it's been since then.
    // % 2 because it alternates
    return (Math.trunc((date - knownLightSeason) / 6.048e8) % 2);
  }

  let season = getSeason(new Date());

  /**
   * Get the number of defenses it is possible to lose based on the current time and the time of the last defense that counted
   * @param {Date} lastDefenseDate
   * @param {Boolean} round Whether or not to round the number returned
   * @returns Number
   */
  function getDefCanLose(lastDefenseDate, forDisplay = true) {
    lastDefenseDate = new Date(lastDefenseDate);

    const now = new Date();
    const LLCTimeLeft = Math.max((lastDefenseDate ? lastDefenseDate.valueOf() + 7.2e+7 - now : 0), 0);
    const defensesCanLose = (getEndDate().valueOf() - now - LLCTimeLeft);

    // Subtract one when not-for-display just so it matches LLC time left - don't know why it's like this (modulus probably)
    return forDisplay ? Math.ceil(defensesCanLose / 7.2e7) : defensesCanLose % 7.2e7 - 1;
  }

  $: calcValues = {
    season: season ? 'Light/Dark' : 'Astra/Anima',
    seasonImgSrc: season ? 'img/light-and-dark.png' : 'img/astra-and-anima.png',
    seasonEndDate: parseDate($lastStoredSeason),
    liftToGoal: Math.max($data.liftGoal - $data.totalLift, 0),
    offensesToGoal:
      Math.max(Math.ceil(($data.liftGoal - $data.totalLift) / $data.liftGainPerOffense[season]), 0),
    defenseMargin:
      Math.max(Math.floor(($data.liftGainPerOffense[season] * $data.offensesLeftInSeason + $data.totalLift - $data.liftGoal)
      / $data.liftLossPerDefense[season]), 0),
    maxLift: $data.totalLift + $data.liftGainPerOffense[season] * $data.offensesLeftInSeason,
    minLift:
      ($data.totalLift + $data.liftGainPerOffense[season] * $data.offensesLeftInSeason)
      - $data.liftLossPerDefense[season] * getDefCanLose($data.lastDefenseDate),
    LLCTimeLeft: parseTime(getLLCTimeLeft($data.lastDefenseDate)),
		timeToFewerDefenses: getTimeToFewerDef($data.lastDefenseDate),
		defensesCanLose: getDefCanLose($data.lastDefenseDate),
  }
  
  function reset() {
    if ($data.totalLift >= 20800) {
      $data.totalLift = 18000;
      $data.liftGoal = 20800;
    }
    else if ($data.totalLift > 16000) {
      $data.totalLift = 11800;
      $data.liftGoal = 13400;
    }
    else if ($data.totalLift >= 13400) {
      $data.totalLift = 18000;
      $data.liftGoal = 20800;
    }
    else if ($data.totalLift >= 11000) {
      $data.totalLift = 11000;
      $data.liftGoal = 13400;
    }
    else if ($data.totalLift >= 9400) {
      $data.totalLift = 9400;
      $data.liftGoal = 11000;
    }
    else if ($data.totalLift >= 8200) {
      $data.totalLift = 8200;
      $data.liftGoal = 9400;
    }
    else if ($data.totalLift >= 7200) {
      $data.totalLift = 7200;
      $data.liftGoal = 8200;
    }
    else if ($data.totalLift >= 6500) {
      $data.totalLift = 6500;
      $data.liftGoal = 7200;
    }
    else if ($data.totalLift >= 6000) {
      $data.totalLift = 6000;
      $data.liftGoal = 6500;
    }
    else if ($data.totalLift >= 4400) {
      $data.totalLift = Math.floor($data.totalLift / 400);
      $data.liftGoal = $data.totalLift + 400;
    }
    else {
      $data.liftGoal = Math.floor($data.totalLift / 400) + 400;
    }

    $data.offensesLeftInSeason = 16;
    $data.lastDefenseDate = null;
    $lastStoredSeason = getEndDate().valueOf();
  }

	function updateTimes() {
    // Don't update when editing, it makes everything freeze
		!$edit && requestAnimationFrame(updateTimes);

		calcValues.LLCTimeLeft = parseTime(getLLCTimeLeft($data.lastDefenseDate));
		calcValues.timeToFewerDefenses = getTimeToFewerDef($data.lastDefenseDate);
		calcValues.defensesCanLose = getDefCanLose($data.lastDefenseDate);

    season = getSeason(new Date($lastStoredSeason - 1000));

    const now  = new Date();
    if ($autoReset && now.valueOf() > $lastStoredSeason) {
      reset();
    }
	}

	onMount(() => {
		updateTimes();
	});

  // For editing: drag-n-drop and show/hide columns
	$: items = $columnOrder;
	// const flipDurationMs = (d) => Math.sqrt(d) * 40; // DNDZones can't handle function for flipDuration?
	const flipDurationMs = 300;
	let dragDisabled = true;
  const dropTargetStyle = {outline: 'black solid 3px'};

	function handleDnd(e) {
		$columnOrder = e.detail.items;
	}

  let tempShowColumns = {};
	let tempColumnOrder = [];

	function startEdit() {
		for (let i of dataKeys) {
			tempShowColumns[i] = $showColumns[i];
		}
		$columnOrder.forEach((item, idx) => tempColumnOrder[idx] = item);
		
		$edit = true;
		// Otherwise the drag and drop activates before the hidden columns are shown and it messes everything up
		setTimeout(() => {
			dragDisabled = false;
		}, 20);
	}

	function saveEdit() {
		$edit = false;
		dragDisabled = true;
    setTimeout(updateTimes, 500); // Otherwise the table doesn't redraw correctly
	}

	function cancelEdit() {
		for (let i of dataKeys) {
			$showColumns[i] = tempShowColumns[i];
		}
		tempColumnOrder.forEach((item, idx) => $columnOrder[idx] = item);

		$edit = false;
		dragDisabled = true;
    setTimeout(updateTimes, 500); // Otherwise the table doesn't redraw correctly
	}

  // Goal higlighting
  $: goodColor = $darkMode ? 'rgb(0, 80, 0)' : 'rgb(117, 255, 117)';
  $: badColor = $darkMode ? 'rgb(80, 0, 0)' : 'rgb(255, 100, 100)';

  $: document.body.style.setProperty('--goal-lift-bg',
    calcValues.liftToGoal <= 0 && $goalColor ? goodColor : 'var(--bg)');
  $: document.body.style.setProperty('--goal-offenses-bg',
    calcValues.offensesToGoal > $data.offensesLeftInSeason && $goalColor ? badColor : 'var(--bg)');
  $: document.body.style.setProperty('--goal-min-lift-bg',
    calcValues.minLift >= $data.liftGoal && $goalColor ? goodColor : 'var(--bg)');
  $: document.body.style.setProperty('--goal-defense-margin-bg',
    calcValues.defenseMargin >= calcValues.defensesCanLose && $goalColor ? goodColor : 'var(--bg)');
  $: document.body.style.setProperty('--goal-max-lift-bg',
    calcValues.maxLift < $data.liftGoal && $goalColor ? badColor : 'var(--bg)');

  // For exporting
  function getAllData() {
    const dataArr = [];

    if ($exportOptions.exportHeaders) {
      const headerRow = [];
      for (let i of $columnOrder) {
        if (!$exportOptions.onlyShown || ($exportOptions.onlyShown && $showColumns[i.value])) {
          headerRow.push(columnData[i.value].name);
        }
      }
      dataArr.push(headerRow);
    }

    const dataRow = [];
    for (let i of $columnOrder) {
      if (!$exportOptions.onlyShown || ($exportOptions.onlyShown && $showColumns[i.value])) {
        if (i.value === 'lastDefenseDate' ||
          i.value === 'totalLift' ||
          i.value === 'offensesLeftInSeason' ||
          i.value === 'liftGoal') {
          dataRow.push($data[i.value]);
        }
        else if (i.value === 'liftGainPerOffense' || i.value === 'liftLossPerDefense') {
          dataRow.push($data[i.value][season]);
        }
        else {
          dataRow.push(calcValues[i.value]);
        }
      }
    }
    dataArr.push(dataRow);

    return dataArr;
  }

  function exportCSV() {
    const dataArr = getAllData();
    let csv = 'data:text/csv;charset=utf-8,' + dataArr.map(i => i.join(',')).join('\n');

    const encodedURI = encodeURI(csv);
    const csvLink = document.createElement("a");
    csvLink.setAttribute("href", encodedURI);
    csvLink.setAttribute('download', `AR_season_${calcValues.seasonEndDate.replace(/\//g, '-')}.csv`);
    document.body.appendChild(csvLink);
    csvLink.click();
    csvLink.remove();
  }

  function copyToClipboard() {
    const dataArr = getAllData();
    const table = document.createElement('table');
    
    for (let i of dataArr) {
      const newRow = document.createElement('tr');
      for (let j of i) {
        const newCell = document.createElement('td');
        newCell.textContent = j;
        newRow.appendChild(newCell);
      }
      table.appendChild(newRow);
    }

    $exportOptions.noFormatting && (table.style.all = 'unset');

    document.body.appendChild(table);

    let range;
    let selection;
    if (document.createRange && window.getSelection) {
      range = document.createRange();
      selection = window.getSelection();
      selection.removeAllRanges();
      range.selectNodeContents(table);
      selection.addRange(range);
    }

    try {
      document.execCommand('Copy');
    } catch (e) {
      alert(`Error: ${e}. Could not copy to clipboard.`)
    }
    table.remove();
  }
</script>

<div use:dndzone="{{items, flipDurationMs, dragDisabled, dropTargetStyle}}"
     on:consider="{handleDnd}"
     on:finalize="{handleDnd}"
     class="mainGrid">
  {#each items as item(item.id)}
      <div class="column" id="{item.value + 'Column'}" animate:flip="{{duration: flipDurationMs}}" class:hide="{!($edit || $showColumns[item.value])}" >
        <div class="header centerFlex" title="{columnData[item.value].title}">
          {#if item.value === 'timeToFewerDefenses'}
            Time to {Math.max(calcValues.defensesCanLose - 1, 0)} Defense{calcValues.defensesCanLose == 2 ? '' : 's'}
          {:else}
            {columnData[item.value].name}
          {/if}
        </div>
        {#if !$edit}
          <div id="{item.value + 'Cell'}" in:fly="{{y: -30}}" class="dataCell centerFlex {item.value + 'Cell'}">
            {#if item.userInput}
              {#if item.value === 'lastDefenseDate'}
                <input type="datetime-local" class="dateInput" bind:value="{$data[item.value]}">
              {:else if
                item.value === 'totalLift' ||
                item.value === 'offensesLeftInSeason'}
                <input type="number" pattern="[0-9]*" class="thisSeasonInput" bind:value="{$data[item.value]}">
              {:else if item.value === 'liftGoal'}
                <select name="liftGoal" id="liftGoalInput" bind:value="{$data[item.value]}">
                  {#each tiers as tier, i(i)}
                    <option value="{tier}">Tier {tiers.length - i}</option>
                  {/each}
                </select>
              {:else if item.value === 'liftGainPerOffense' || item.value === 'liftLossPerDefense'}
                <input type="number" pattern="[0-9]*" class="thisSeasonInput" bind:value="{$data[item.value][season]}">
              {/if}
            {:else}
              {#if item.value === 'season'}
                <img src={calcValues.seasonImgSrc} alt="{calcValues.season} season icons" class="seasonIcon" title="{calcValues[item.value]}">
              {:else}
                {calcValues[item.value]}
              {/if}
            {/if}
          </div>
        {:else}
          <div in:fly="{{y: 30}}" class="centerFlex">
            <input type="checkbox" name="{columnData[item.value].name}" class="editCheckbox" bind:checked="{$showColumns[item.value]}">
          </div>
        {/if}
        {#if item.value === 'season'}
          <Tooltip props="{{id: item.value + 'Column', text: calcValues.season, touchOnly: true}}"/>
        {:else}
          <Tooltip props="{{id: item.value + 'Column', text: columnData[item.value].title, touchOnly: true}}"/>
        {/if}
      </div>
  {/each}
</div>

{#if $edit}
  <div>
    <span class="editTip z-0">Drag and drop to rearrange</span>
  </div>
{/if}

<div class="z-0 centerFlex editBtns">
  {#if $edit}
    <button on:click="{saveEdit}" class="saveBtn">Save</button>
    <button on:click="{cancelEdit}">Cancel</button>
    <button on:click="{() => {for (let i of dataKeys) { $showColumns[i] = true; }}}">Show all</button>
    <button on:click="{() => { $columnOrder = $columnOrder.sort((i1, i2) => i1.id - i2.id) }}">Reset order</button>
  {:else}
    <button class="edit-btn" on:click="{startEdit}">Edit</button>
    <Modal props="{{
      title: 'Export',
      goBtn: 'Export',
      goFunc: () => {
        $exportOptions.type === 'csv' ? exportCSV() : copyToClipboard();
      }
      }}">
      <div slot="content">
        <select name="" id="exportOptions" bind:value="{$exportOptions.type}">
          <option value="clipboard">Copy to clipboard as a table</option>
          <option value="csv">Export as CSV</option>
        </select>
        <br>
        <br>
        <div class="checkboxList">
          <label for="exportAll">
            <input type="checkbox" name="" id="exportAll" bind:checked="{$exportOptions.onlyShown}">
            Export only shown columns
          </label>
          <label for="exportHeaders">
            <input type="checkbox" name="" id="exportHeaders" bind:checked="{$exportOptions.exportHeaders}">
            Export headers
          </label>
          <label for="exportNoFormatting" title="Only makes a difference for copying to the clipboard">
            <input type="checkbox" name="" id="exportNoFormatting" bind:checked="{$exportOptions.noFormatting}">
            Remove formatting
          </label>
        </div>
      </div>
    </Modal>
    <Modal props="{{
      btnText: 'Reset',
      title: 'Are you sure you want to reset?',
      goBtn: 'Reset',
      goFunc: reset,
    }}" />
  {/if}
</div>

<style>
  .mainGrid {
		background: var(--transparent-bg);
		box-shadow: 5px 5px 50px rgba(0, 0, 0, 0.5);
		padding: 1rem;
		position: relative;
		display: grid;
		gap: 1ch 0.3ch;
		width: calc(100% - 1rem);
		grid-template-columns: repeat(auto-fit, minmax(12ch, 1fr));
		align-self: center;
		border-radius: 7px;
	}

	.column {
    display: grid;
    position: relative;
    grid-template-rows: 1fr 3em;
    border: hsl(208, 85%, 64%) solid 2px;
    border-radius: 7px;
    transition: opacity 0.5s linear visibility 0s;
  }

  .header {
    border-bottom: hsl(208, 85%, 64%) solid 1px;
    border-radius: 7px 7px 0 0;
    padding: 7px 9px;
  }

  .dataCell {
    border-radius: 0 0 7px 7px;
    background: var(--bg);
  }

  .centerFlex {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  input, select {
    border-radius: 7px;
  }

  input[type=datetime-local]::-webkit-calendar-picker-indicator {
    filter: invert(var(--invert));
    cursor: pointer;
  }

  input[type=number]::-webkit-inner-spin-button {
    opacity: 1;
  }

  .thisSeasonInput {
		width: 90%;
		min-width: 10ch;
	}

  .dateInput {
		width: 23.5ch;
	}

  #lastDefenseDateColumn {
    grid-column: auto / span 2;
  }

  .liftToGoalCell {
    background: var(--goal-lift-bg);
  }

  .offensesToGoalCell {
    background: var(--goal-offenses-bg);
  }

  .minLiftCell {
    background: var(--goal-min-lift-bg);
  }

  .defenseMarginCell, #defensesCanLoseCell {
    background: var(--goal-defense-margin-bg);
  }

  .maxLiftCell {
    background: var(--goal-max-lift-bg);
  }

  .seasonIcon {
    width: 1.5rem;
    padding: 2px;
  }

  .editTip {
    position: relative;
		padding: 5px 7px;
		margin-bottom: 1rem;
		width: auto;
		background: var(--transparent-bg);
		border-radius: 3px;
	}

  .checkboxList {
    text-align: left;
    padding: 0.3rem;
  }

  .editBtns {
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .z-0 {
		z-index: 0;
	}

  .hide {
    display: none;
  }
</style>