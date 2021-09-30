<script>
	import { onMount } from 'svelte';
	import { flip } from "svelte/animate";
  import { fly} from "svelte/transition";
	import { dndzone } from 'svelte-dnd-action';
  import Tooltip from './Tooltip.svelte';

	import {
    dataKeys,
		edit,
		showColumns,
		columnData,
		thisWeekData as data,
  } from './stores';

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
    return `${msToDate.getMonth() + 1}/${msToDate.getDate()}/${msToDate.getFullYear()} ${msToDate.toTimeString().slice(0, 5)}`;
  }

  function getLLCTimeLeft(lastDefenseDate) {
		if (!lastDefenseDate) {
			return 0;
		}
		lastDefenseDate = new Date(lastDefenseDate);
		const now = new Date();
		return Math.max((lastDefenseDate.valueOf() + 7.2e+7 - now), 0);
	}

	function getTimeToFewerDef(lastDefenseDate) {
		lastDefenseDate = new Date(lastDefenseDate);

		if (getDefCanLose(lastDefenseDate) <= 0) {
			return 'N/A';
		}
		return parseTime(getDefCanLose(lastDefenseDate, false) + getLLCTimeLeft(lastDefenseDate));
	}

  /**
   * Get the end date of the current season
   * @returns A date object
   */
  function getEndDate() {
    const now = new Date();
    const seasonEndDate = new Date();
    seasonEndDate.setDate(now.getDate() + (7 + 1 - now.getDay()) % 7);
    seasonEndDate.setHours(17, 0, 0); // have to correct for daylight saving time
    return seasonEndDate;
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
    seasonEndDate: parseDate(getEndDate()).slice(0, -5),
    liftToGoal: Math.max($data.liftGoal - $data.totalLift, 0),
    offensesToGoal:
      Math.max(Math.ceil(($data.liftGoal - $data.totalLift) / $data.liftGainPerOffense[season]), 0),
    defenseMargin:
      Math.floor(($data.liftGainPerOffense[season] * $data.offensesLeftInSeason + $data.totalLift - $data.liftGoal)
      / $data.liftLossPerDefense),
    maxLift: $data.totalLift + $data.liftGainPerOffense[season] * $data.offensesLeftInSeason,
    minLift: 
      ($data.totalLift + $data.liftGainPerOffense[season] * $data.offensesLeftInSeason) 
      - $data.liftLossPerDefense * getDefCanLose($data.lastDefenseDate),
    LLCTimeLeft: parseTime(getLLCTimeLeft($data.lastDefenseDate)),
		timeToFewerDefenses: getTimeToFewerDef($data.lastDefenseDate),
		defensesCanLose: getDefCanLose($data.lastDefenseDate),
  }

	function updateTimes() {
    // Don't update when editing, it makes it freeze
		!$edit && requestAnimationFrame(updateTimes);

		calcValues.LLCTimeLeft = parseTime(getLLCTimeLeft($data.lastDefenseDate));
		calcValues.timeToFewerDefenses = getTimeToFewerDef($data.lastDefenseDate);
		calcValues.defensesCanLose = getDefCanLose($data.lastDefenseDate);
    calcValues.seasonEndDate = parseDate(getEndDate()).slice(0, -5);

    season = getSeason(new Date());
    calcValues.season = season ? 'Light/Dark' : 'Astra/Anima';
    calcValues.seasonImgSrc = season ? 'img/light-and-dark.png' : 'img/astra-and-anima.png';
	}


	onMount(() => {
		updateTimes();
	});

  // For drag and drop
	$: items = $columnData;
	// const flipDurationMs = (d) => Math.sqrt(d) * 40; // DNDZones can't handle function for flipDuration?
	const flipDurationMs = 300;
	let dragDisabled = true;
  const dropTargetStyle = {outline: 'black solid 3px'};

	function handleDnd(e) {
		$columnData = e.detail.items;
	}

  let tempShowColumns = {};
	let tempColumnData = [];

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
    setTimeout(updateTimes, 500); // Otherwise the table doesn't redraw correctly
	}

	function cancelEdit() {
		for (let i of dataKeys) {
			$showColumns[i] = tempShowColumns[i];
		}
		tempColumnData.forEach((item, idx) => $columnData[idx] = item);

		$edit = false;
		dragDisabled = true;
    setTimeout(updateTimes, 500); // Otherwise the table doesn't redraw correctly
	}
</script>

<div use:dndzone="{{items, flipDurationMs, dragDisabled, dropTargetStyle}}" 
     on:consider="{handleDnd}" 
     on:finalize="{handleDnd}" 
     class="mainGrid">
  {#each items as item(item.id)}
      <div class="column" id="{item.value + 'Column'}" animate:flip="{{duration: flipDurationMs}}" class:hide="{!($edit || $showColumns[item.value])}" >
        <div class="header centerFlex" title="{item.title}">
          {#if item.value === 'timeToFewerDefenses'}
            Time to {Math.max(calcValues.defensesCanLose - 1, 0)} defense{calcValues.defensesCanLose == 2 ? '' : 's'}
          {:else}
            {item.name}
          {/if}
        </div>
        {#if !$edit}
          <div id="{item.value + 'Cell'}" in:fly="{{y: -30}}" class="dataCell centerFlex">
            {#if item.userInput}
              {#if item.value === 'lastDefenseDate'}
                <input type="datetime-local" class="dateInput" bind:value="{$data[item.value]}">
              {:else if
                item.value === 'totalLift' ||
                item.value === 'liftLossPerDefense' ||
                item.value === 'offensesLeftInSeason'}
                <input type="number" pattern="[0-9]*" class="thisSeasonInput" bind:value="{$data[item.value]}">
              {:else if item.value === 'liftGoal'}
                <select name="liftGoal" id="liftGoalInput" bind:value="{$data.liftGoal}">
                  <option value=20100>Tier 39</option>
                  <option value=20800>Tier 38</option>
                  <option value=20400>Tier 37</option>
                  <option value=20000>Tier 36</option>
                  <option value=19600>Tier 35</option>
                  <option value=19200>Tier 34</option>
                  <option value=18800>Tier 33</option>
                  <option value=18400>Tier 32</option>
                  <option value=18000>Tier 31</option>
                  <option value=16400>Tier 30</option>
                  <option value=16000>Tier 29</option>
                  <option value=13800>Tier 28</option>
                  <option value=13400>Tier 27</option>
                  <option value=13000>Tier 26</option>
                  <option value=12600>Tier 25</option>
                  <option value=12200>Tier 24</option>
                  <option value=11800>Tier 23</option>
                  <option value=11400>Tier 22</option>
                  <option value=11000>Tier 21</option>
                  <option value=9400>Tier 20</option>
                  <option value=8200>Tier 19</option>
                  <option value=7200>Tier 18</option>
                  <option value=6500>Tier 17</option>
                  <option value=6000>Tier 16</option>
                  <option value=5600>Tier 15</option>
                  <option value=5200>Tier 14</option>
                  <option value=4800>Tier 13</option>
                  <option value=4400>Tier 12</option>
                  <option value=4000>Tier 11</option>
                  <option value=3600>Tier 10</option>
                  <option value=3200>Tier 9</option>
                  <option value=2800>Tier 8</option>
                  <option value=2400>Tier 7</option>
                  <option value=2000>Tier 6</option>
                  <option value=1600>Tier 5</option>
                  <option value=1200>Tier 4</option>
                  <option value=800>Tier 3</option>
                  <option value=400>Tier 2</option>
                  <option value=0>Tier 1</option>
                </select>
              {:else if item.value === 'liftGainPerOffense'}
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
          <div in:fly="{{y: -30}}" class="centerFlex">
            <input type="checkbox" name="{item.name}" class="editCheckbox" bind:checked="{$showColumns[item.value]}">
          </div>
        {/if}
        {#if item.value === 'season'}
          <Tooltip props="{{id: item.value + 'Column', text: calcValues.season, touchOnly: true}}"/>
        {:else}
          <Tooltip props="{{id: item.value + 'Column', text: item.title, touchOnly: true}}"/>
        {/if}
      </div>
  {/each}
</div>

<div class="z-0">
  {#if $edit}
    <span class="editTip">Drag and drop to rearrange</span>
    <br>
    <button on:click="{saveEdit}" class="saveBtn">Save</button>
    <button on:click="{cancelEdit}">Cancel</button>
    <button on:click="{() => {for (let i of dataKeys) { $showColumns[i] = true; }}}">Show all</button>
    <button on:click="{() => { $columnData = $columnData.sort((i1, i2) => i1.id - i2.id) }}">Reset order</button>
  {:else}
    <button class="edit-btn" on:click="{startEdit}">Edit</button>
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

  .seasonIcon {
    width: 1.5rem;
    padding: 2px;
  }

  .editTip {
		display: inline-block;
		padding: 5px 7px;
		margin-bottom: 1rem;
		width: auto;
		background: var(--transparent-bg);
		border-radius: 3px;
	}

  .z-0 {
		z-index: 0;
	}
  
  .hide {
    display: none;
  }
</style>