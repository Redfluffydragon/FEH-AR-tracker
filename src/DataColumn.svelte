<script>
  export let data;

  import {
    edit,
    showColumns,
    thisWeekData
  } from './stores';

  import {
		getEndDate,
		parseDate,
		getLLCTimeLeft,
		getDefensesCanLose,
		getTimeToFewerDefenses,
	} from './utils';

  $: calculatedValues = {
    season: 'Astra/Anima',
    seasonEndDate: parseDate(getEndDate()).slice(0, -5),
    liftToGoal: $thisWeekData.liftGoal - $thisWeekData.totalLift,
    offensesToGoal: Math.max(Math.ceil(($thisWeekData.liftGoal - $thisWeekData.totalLift) / $thisWeekData.liftGainPerOffense), 0),
    defenseMargin: Math.floor(($thisWeekData.liftGainPerOffense * $thisWeekData.offensesLeftInSeason + $thisWeekData.totalLift - $thisWeekData.liftGoal) / $thisWeekData.liftLossPerDefense),
    maxLift: $thisWeekData.totalLift + $thisWeekData.liftGainPerOffense * $thisWeekData.offensesLeftInSeason,
    minLift: ($thisWeekData.totalLift + $thisWeekData.liftGainPerOffense * $thisWeekData.offensesLeftInSeason) - $thisWeekData.liftLossPerDefense * getDefensesCanLose($thisWeekData.lastDefenseDate),
    defensesCanLose: getDefensesCanLose($thisWeekData.lastDefenseDate),
    timeToFewerDefenses: getTimeToFewerDefenses($thisWeekData.lastDefenseDate),
    LLCTimeLeft: getLLCTimeLeft($thisWeekData.lastDefenseDate, true),
  }
</script>

{#if $edit || $showColumns[data.value]}
  <div class="column" id="{data.value}">
    <div class="header centerFlex" title="{data.title}">
      {data.name}
    </div>
    {#if !$edit}
      <div id="{data.value + 'Cell'}" class="dataCell centerFlex">
        {#if data.userInput}
          {#if data.value === 'lastDefenseDate'}
            <input type="datetime-local" class="dateInput" bind:value="{$thisWeekData[data.value]}">
          {:else if data.value === 'totalLift'}
            <input type="number" pattern="[0-9]*" class="thisSeasonInput" bind:value="{$thisWeekData[data.value]}">
          {:else if data.value === 'liftGainPerOffense'}
            <input type="number" pattern="[0-9]*" class="thisSeasonInput" bind:value="{$thisWeekData[data.value]}">
          {:else if data.value === 'liftLossPerDefense'}
            <input type="number" pattern="[0-9]*" class="thisSeasonInput" bind:value="{$thisWeekData[data.value]}">
          {:else if data.value === 'offensesLeftInSeason'}
            <input type="number" pattern="[0-9]*" class="thisSeasonInput" bind:value="{$thisWeekData[data.value]}">
          {:else if data.name === 'Lift Goal'}
            <input type="number" pattern="[0-9]*" class="thisSeasonInput" bind:value="{$thisWeekData[data.value]}">
          {/if}
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
  * {
    font-weight: 100;
    color: #000;
    font-size: 1.02em;
  }

  .column {
    display: grid;
    grid-template-rows: 1fr 3rem;
    /* gap: 2px; */
    border: hsl(208, 85%, 64%) solid 2px;
    border-radius: 7px;
  }
  
  .header {
    /* background-color: rgb(204, 204, 204); */
    /* background: #00000018; */
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
    /* position: absolute;
    width: 12.5%;
    height: 100%;
    top: 0;
    right: 0; */
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

  .pointer {
    cursor: pointer;
  }

  .grab {
    cursor: grab;
  }
</style>