<script>
  import { onMount, tick } from 'svelte';

  export let data;

  import {
    edit,
    showColumns,
    thisWeekData,
    LLCTimeLeft,
    timeToFewerDefenses,
    defensesCanLose
  } from './stores';

  import {
		getEndDate,
		parseDate,
		getDefensesCanLose,
	} from './utils';

  $: calculatedValues = {
    season: 'Astra/Anima',
    seasonEndDate: parseDate(getEndDate()).slice(0, -5),
    liftToGoal: $thisWeekData.liftGoal - $thisWeekData.totalLift,
    offensesToGoal: Math.max(Math.ceil(($thisWeekData.liftGoal - $thisWeekData.totalLift) / $thisWeekData.liftGainPerOffense), 0),
    defenseMargin: Math.floor(($thisWeekData.liftGainPerOffense * $thisWeekData.offensesLeftInSeason + $thisWeekData.totalLift - $thisWeekData.liftGoal) / $thisWeekData.liftLossPerDefense),
    maxLift: $thisWeekData.totalLift + $thisWeekData.liftGainPerOffense * $thisWeekData.offensesLeftInSeason,
    minLift: ($thisWeekData.totalLift + $thisWeekData.liftGainPerOffense * $thisWeekData.offensesLeftInSeason) - $thisWeekData.liftLossPerDefense * getDefensesCanLose($thisWeekData.lastDefenseDate),
  }
</script>

{#if $edit || $showColumns[data.value]}
  <div class="column" id="{data.value}">
    <div class="header centerFlex" title="{data.title}">
      {#if data.value === 'timeToFewerDefenses'}
        Time to {$defensesCanLose - 1} defense{$defensesCanLose == 2 ? '' : 's'}
      {:else}
        {data.name}
      {/if}
    </div>
    {#if !$edit}
      <div id="{data.value + 'Cell'}" class="dataCell centerFlex">
        {#if data.userInput}
          {#if data.value === 'lastDefenseDate'}
            <input type="datetime-local" class="dateInput" bind:value="{$thisWeekData[data.value]}">
          {:else if
            data.value === 'totalLift' ||
            data.value === 'liftGainPerOffense' ||
            data.value === 'liftLossPerDefense' ||
            data.value === 'offensesLeftInSeason' ||
            data.value === 'liftGoal'}
            <input type="number" pattern="[0-9]*" class="thisSeasonInput" bind:value="{$thisWeekData[data.value]}">
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
      <div class="checkCell centerFlex">
        <input type="checkbox" name="{data.name}" class="editCheckbox" bind:checked="{$showColumns[data.value]}">
      </div>
    {/if}  
  </div>
{/if}

<style>
  .column {
    display: grid;
    grid-template-rows: 1fr 3rem;
    border: hsl(208, 85%, 64%) solid 2px;
    border-radius: 7px;
  }
  
  .header {
    border-bottom: hsl(208, 85%, 64%) solid 1px;
    border-radius: 7px 7px 0 0;
    padding: 7px 9px;
  }

  .dataCell {
    border-radius: 0 0 7px 7px;
    background: white;

  }

  .centerFlex {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  input {
    margin-top: 0.4rem;
    border-radius: 7px;
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
</style>