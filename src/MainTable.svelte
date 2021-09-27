<script>
  export let dragDisabled;

	import { onMount } from 'svelte';
	import { flip } from "svelte/animate";
  import { fly} from "svelte/transition";
	import { dndzone } from 'svelte-dnd-action';

	import {
		edit,
		showColumns,
		columnData,
		thisWeekData,
		LLCTimeLeft,
		timeToFewerDefenses,
		defensesCanLose
  } from './stores';

  import {
		parseTime,
		parseDate,
		getDefensesCanLose,
		getEndDate,
	} from "./utils";

  function getLLCTimeLeft(lastDefenseDate) {
		if (!lastDefenseDate) {
			return 0;
		}
		lastDefenseDate = new Date(lastDefenseDate);
		const now = new Date();
		return Math.max((lastDefenseDate.valueOf() + 7.2e+7 - now), 0);
	}

	function getTimeToFewerDefenses(lastDefenseDate) {
		lastDefenseDate = new Date(lastDefenseDate);

		if (getDefensesCanLose(lastDefenseDate) <= 0) {
			return 'N/A';
		}
		return parseTime(getDefensesCanLose(lastDefenseDate, false) + getLLCTimeLeft(lastDefenseDate));
	}

	function updateTimes() {
		requestAnimationFrame(updateTimes);

		$LLCTimeLeft = parseTime(getLLCTimeLeft($thisWeekData.lastDefenseDate));
		$timeToFewerDefenses = getTimeToFewerDefenses($thisWeekData.lastDefenseDate);
		$defensesCanLose = getDefensesCanLose($thisWeekData.lastDefenseDate);
	}

	onMount(() => {
		updateTimes();
    // for some reason Svelte doesn't make it show the bound value on first load of the page
    document.getElementById('liftGoalInput').value = $thisWeekData.liftGoal;
	});

  $: calculatedValues = {
    season: 'Astra/Anima',
    seasonEndDate: parseDate(getEndDate()).slice(0, -5),
    liftToGoal: Math.max($thisWeekData.liftGoal - $thisWeekData.totalLift, 0),
    offensesToGoal: Math.max(Math.ceil(($thisWeekData.liftGoal - $thisWeekData.totalLift) / $thisWeekData.liftGainPerOffense), 0),
    defenseMargin: Math.floor(($thisWeekData.liftGainPerOffense * $thisWeekData.offensesLeftInSeason + $thisWeekData.totalLift - $thisWeekData.liftGoal) / $thisWeekData.liftLossPerDefense),
    maxLift: $thisWeekData.totalLift + $thisWeekData.liftGainPerOffense * $thisWeekData.offensesLeftInSeason,
    minLift: ($thisWeekData.totalLift + $thisWeekData.liftGainPerOffense * $thisWeekData.offensesLeftInSeason) - $thisWeekData.liftLossPerDefense * getDefensesCanLose($thisWeekData.lastDefenseDate),
  }

	$: items = $columnData;
	// const flipDurationMs = (d) => Math.sqrt(d) * 40; // DNDZones can't handle function for flipDuration?
	const flipDurationMs = 300;

	function handleDnd(e) {
		$columnData = e.detail.items;
	}
</script>

<div use:dndzone="{{items, flipDurationMs, dragDisabled}}" on:consider="{handleDnd}" on:finalize="{handleDnd}" class="mainGrid">
  {#each items as data(data.id)}
      <div class="column" id="{data.value}" animate:flip="{{duration: flipDurationMs}}" class:hide="{!($edit || $showColumns[data.value])}" >
        <div class="header centerFlex" title="{data.title}">
          {#if data.value === 'timeToFewerDefenses'}
            Time to {$defensesCanLose - 1} defense{$defensesCanLose == 2 ? '' : 's'}
          {:else}
            {data.name}
          {/if}
        </div>
        {#if !$edit}
          <div id="{data.value + 'Cell'}" in:fly="{{y: -30}}" class="dataCell centerFlex">
            {#if data.userInput}
              {#if data.value === 'lastDefenseDate'}
                <input type="datetime-local" class="dateInput" bind:value="{$thisWeekData[data.value]}">
              {:else if
                data.value === 'totalLift' ||
                data.value === 'liftGainPerOffense' ||
                data.value === 'liftLossPerDefense' ||
                data.value === 'offensesLeftInSeason'}
                <input type="number" pattern="[0-9]*" class="thisSeasonInput" bind:value="{$thisWeekData[data.value]}">
              {:else if data.value === 'liftGoal'}
                <select name="liftGoal" id="liftGoalInput" bind:value="{$thisWeekData.liftGoal}">
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
              {/if}
            {:else if data.value === 'timeToFewerDefenses'}
              {$timeToFewerDefenses}
            {:else if data.value === 'LLCTimeLeft'}
              {$LLCTimeLeft}
            {:else if data.value === 'defensesCanLose'}
              {$defensesCanLose}
            {:else}
              {#if data.value === 'season'}
                <img src="img/astra-and-anima.png" alt="Astra and anima season icons" class="seasonIcon" title="{calculatedValues[data.value]}">
              {:else}
                {calculatedValues[data.value]}
              {/if}
            {/if}
          </div>
        {:else}
          <div in:fly="{{y: -30}}" class="centerFlex">
            <input type="checkbox" name="{data.name}" class="editCheckbox" bind:checked="{$showColumns[data.value]}">
          </div>
        {/if}  
      </div>
  {/each}
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
    grid-template-rows: 1fr 3rem;
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
    margin-top: 0.4rem;
    border-radius: 7px;
  }
  
  input[type=datetime-local]::-webkit-calendar-picker-indicator {
    filter: invert(var(--invert));
  }

  input[type='number']::-webkit-inner-spin-button { 
    opacity: 1;
  }

  .thisSeasonInput {
		width: 90%;
		min-width: 10ch;
	}

  .dateInput {
		width: 23.5ch;
	}

  #lastDefenseDate {
    grid-column: auto / span 2;
  }

  .seasonIcon {
    width: 1.5rem;
    padding: 2px;
  }
  
  .hide {
    display: none;
  }
</style>