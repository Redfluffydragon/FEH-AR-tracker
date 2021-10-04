import { writable } from 'svelte/store';

import { getEndDate } from "./utils";

/**
 * Get an item from localStorage or sessionStorage, and if it doesn't exist, set it to the default
 * @param {string} key The storage key for the item
 * @param {*} value The default value to be set if the store does not exist yet
 * @param {(localStorage | sessionStorage)} [type] Local or session storage
 * @returns The item from storage, or the default if there was nothing set
 */
function gotEm(key, value, type = localStorage) {
  const getthething = type.getItem(key);

  if (getthething == null) { // Nothing set yet
    type.setItem(key, JSON.stringify(value));
    return value;
  }

  // For in case it got set to something not in JSON format
  try {
    return JSON.parse(getthething);
  }
  catch {
    type.setItem(key, JSON.stringify(value));
    return value;
  }
}

const defaultData = {
  totalLift: 18000,
  liftGainPerOffense: [190, 190],
  liftLossPerDefense: [40, 40],
  offensesLeftInSeason: 16,
  lastDefenseDate: null,
  liftGoal: 20800,
};
const savedData = gotEm('thisWeekData', defaultData);
export const inputData = writable(savedData);

export const edit = writable(false);


const savedGoalColor = gotEm('goalColor', false);
export const goalColor = writable(savedGoalColor);

const savedMode = gotEm('darkMode', false);
export const darkMode = writable(savedMode);

const savedFontSize = gotEm('fontSize', 1);
export const fontSize = writable(savedFontSize);

const savedShowTooltips = gotEm('showTooltips', true);
export const showTooltips = writable(savedShowTooltips);

const savedAutoReset = gotEm('autoReset', false);
export const autoReset = writable(savedAutoReset);


const savedExportOptions = gotEm('exportOptions', {
  type: 'clipboard',
  onlyShown: false,
  exportHeaders: false,
  noFormatting: true,
})
export const exportOptions = writable(savedExportOptions);


export const dragged = writable(false);


const defaultShow = {
  season: true,
  seasonEndDate: true,
  totalLift: true,
  liftGainPerOffense: true,
  liftLossPerDefense: true,
  liftToGoal: true,
  offensesToGoal: true,
  offensesLeftInSeason: true,
  maxLift: true,
  minLift: true,
  defenseMargin: true,
  liftMargin: true,
  defensesCanLose: true,
  timeToFewerDefenses: true,
  lastDefenseDate: true,
  LLCTimeLeft: true,
  liftGoal: true,
};
export const dataKeys = Object.keys(defaultShow);
const savedShowColumns = gotEm('showColumns', defaultShow);
export const showColumns = writable(savedShowColumns);

export const columnData = {
  season: {
    name: 'Season',
    title: '',
  },
  seasonEndDate: {
    name: 'Season End Date',
    title: '',
  },
  totalLift: {
    name: 'Total Lift',
    title: '',
    userInput: true,
    min: 0,
    max: 21680, // Double check this
  },
  liftGainPerOffense: {
    name: 'Lift Gain per Offense',
    title: 'Lift gain per single offense - saves separately for both seasons',
    userInput: true,
    min: 100,
    max: 220,
  },
  liftLossPerDefense: {
    name: 'Lift Loss per Defense',
    title: 'Lift loss per full defense loss',
    userInput: true,
    min: 20,
    max: 100,
  },
  liftToGoal: {
    name: 'Lift to Goal',
    title: '',
  },
  offensesToGoal: {
    name: 'Offenses to Goal',
    title: 'Number of single offense matches needed to reach your goal',
  },
  offensesLeftInSeason: {
    name: 'Offenses Left',
    title: 'Number of single offense matches possible to play (16 is the most possible in a single season)',
    userInput: true,
    min: 0,
    max: 16,
  },
  maxLift: {
    name: 'Max lift',
    title: 'Maximum lift possible assuming perfect offense and defense from now',
  },
  minLift: {
    name: 'Min lift',
    title: 'Minimum lift possible assuming perfect offense from now (lose all defenses)',
  },
  defenseMargin: {
    name: 'Defense Margin',
    title: 'The number of full defense losses you can take and still make your goal, assuming perfect offense',
  },
  liftMargin: {
    name: 'Lift Margin',
    title: 'How much lift you will be over your goal assuming perfect offense and maximum defense lift loss',
  },
  defensesCanLose: {
    name: 'Defenses Can Lose',
    title: 'The number of defenses it is possible for you to lose lift on, based on the date of the last non-LLC defense you had',
  },
  timeToFewerDefenses: {
    name: 'Time to fewer defenses',
    title: 'Time until it\'s possible to lose one less defense than you can now',
  },
  lastDefenseDate: {
    name: 'Last non-LLC Defense',
    title: 'How long ago the last defense you had that was not covered by lift loss control was',
    userInput: true,
  },
  LLCTimeLeft: {
    name: 'LLC Time Left',
    title: 'Time left under lift loss control, based on the date of the last non-LLC defense you had',
  },
  liftGoal: {
    name: 'Goal',
    title: '',
    userInput: true,
  },
};

const defaultColumnOrder = [
  { id: 0, value: 'season' },
  { id: 1, value: 'seasonEndDate' },
  { id: 2, value: 'totalLift' },
  { id: 3, value: 'liftGainPerOffense' },
  { id: 4, value: 'liftLossPerDefense' },
  { id: 5, value: 'liftToGoal' },
  { id: 6, value: 'offensesToGoal' },
  { id: 7, value: 'offensesLeftInSeason' },
  { id: 8, value: 'maxLift' },
  { id: 9, value: 'minLift' },
  { id: 10, value: 'defenseMargin' },
  { id: 11, value: 'liftMargin' },
  { id: 12, value: 'defensesCanLose' },
  { id: 13, value: 'timeToFewerDefenses' },
  { id: 14, value: 'lastDefenseDate' },
  { id: 15, value: 'LLCTimeLeft' },
  { id: 16, value: 'liftGoal' },
];

const savedColumns = gotEm('columnOrder', defaultColumnOrder);

export const columnOrder = writable(savedColumns);


export const lastStoredSeason = writable(gotEm('lastStoredSeason', getEndDate()));

export const tiers = [21000, 20800, 20400, 20000, 19600, 19200, 18800, 18400, 18000, 16400, 16000, 13800, 13400, 13000, 12600, 12200, 11800, 11400, 11000, 9400, 8200, 7200, 6500, 6000, 5600, 5200, 4800, 4400, 4000, 3600, 3200, 2800, 2400, 2000, 1600, 1200, 800, 400, 0];