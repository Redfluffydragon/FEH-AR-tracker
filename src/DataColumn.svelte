<script>
  export let data;

  import {
    totalLift,
    liftGainPerOffense,
    liftLossPerDefense,
    offensesLeftInSeason,
    lastDefenseDate,
    liftGoal,
    edit,
    showColumns
  } from './stores';

  import {
		getEndDate,
		parseDate,
		getLLCTimeLeft,
		getDefensesCanLose,
		getTimeToFewerDefenses,
	} from './utils';

  $: values = {
    season: 'Anima/Astra',
    seasonEndDate: parseDate(getEndDate()).slice(0, -5),
    liftToGoal: $liftGoal - $totalLift,
    offensesToGoal: Math.max(Math.ceil(($liftGoal - $totalLift) / $liftGainPerOffense), 0),
    defenseMargin: Math.floor(($liftGainPerOffense * $offensesLeftInSeason + $totalLift - $liftGoal) / $liftLossPerDefense),
    maxLift: $totalLift + $liftGainPerOffense * $offensesLeftInSeason,
    minLift: ($totalLift + $liftGainPerOffense * $offensesLeftInSeason) - $liftLossPerDefense * getDefensesCanLose($lastDefenseDate),
    defensesCanLose: getDefensesCanLose($lastDefenseDate),
    timeToFewerDefenses: getTimeToFewerDefenses($lastDefenseDate),
    LLCTimeLeft: getLLCTimeLeft($lastDefenseDate, true),
  }
</script>

{#if $edit || $showColumns[data.id]}
  <div class="column" id="{data.value}">
    <div class="header centerFlex" title="{data.title}" class:pointer="{$edit}">
      <label for="{data.name}" class:pointer="{$edit}">
        {data.name}
      </label>
    </div>
    {#if !$edit}
      <div class="dataCell centerFlex">
        {#if data.userInput}
          {#if data.name === 'Last non-LLC Defense'}
            <input type="datetime-local" class="dateInput" bind:value="{$lastDefenseDate}">
          {:else if data.name === 'Total Lift'}
            <input type="number" pattern="[0-9]*" class="thisSeasonInput" bind:value="{$totalLift}">
          {:else if data.name === 'Lift Gain per Offense'}
            <input type="number" pattern="[0-9]*" class="thisSeasonInput" bind:value="{$liftGainPerOffense}">
          {:else if data.name === 'Lift Loss per Defense'}
            <input type="number" pattern="[0-9]*" class="thisSeasonInput" bind:value="{$liftLossPerDefense}">
          {:else if data.name === 'Offenses Left in Season'}
            <input type="number" pattern="[0-9]*" class="thisSeasonInput" bind:value="{$offensesLeftInSeason}">
          {:else if data.name === 'Lift Goal'}
            <input type="number" pattern="[0-9]*" class="thisSeasonInput" bind:value="{$liftGoal}">
          {/if}
        {:else}
          {values[data.value]}
        {/if}
      </div>
    {:else}
      <div class="checkCell">
        <input type="checkbox" name="{data.name}" class="editCheckbox" bind:checked="{$showColumns[data.id]}">
      </div>
    {/if}  
  </div>
{/if}


<style>
  .column {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    gap: 2px;
  }
  
  .header {
    background-color: hsl(202, 85%, 64%);
    border-radius: 5px;
    padding: 7px 9px;
  }

  .centerFlex {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .thisSeasonInput {
		width: 100%;
		min-width: 12ch;
	}

  .dateInput {
		width: 24.3ch;
	}

  #lastDefenseDate {
    grid-column: auto / span 2;
  }

  .pointer {
    cursor: pointer;
  }
</style>