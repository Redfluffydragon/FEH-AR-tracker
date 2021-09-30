import { writable } from 'svelte/store';

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
  liftLossPerDefense: 40,
  offensesLeftInSeason: 16,
  lastDefenseDate: null,
  liftGoal: '20800',
};
const savedData = gotEm('thisWeekData', defaultData);
export const thisWeekData = writable(savedData);

export const edit = writable(false);


const savedSingleOffenseDisplay = gotEm('singleOffenseDisplay', true);
export const singleOffenseDisplay = writable(savedSingleOffenseDisplay);

const savedGoalColor = gotEm('goalColor', false);
export const goalColor = writable(savedGoalColor);

const savedMode = gotEm('darkMode', false);
export const darkMode = writable(savedMode);

const savedFontSize = gotEm('fontSize', 1);
export const fontSize = writable(savedFontSize);

const savedShowTooltips = gotEm('showTooltips', true);
export const showTooltips = writable(savedShowTooltips);

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
  defensesCanLose: true,
  timeToFewerDefenses: true,
  lastDefenseDate: true,
  LLCTimeLeft: true,
  liftGoal: true,
};
export const dataKeys = Object.keys(defaultShow);
const savedShowColumns = gotEm('showColumns', defaultShow);

export const showColumns = writable(savedShowColumns);

const defaultColumns = [
  {
    id: 0,
    name: 'Season',
    title: '',
    value: 'season',
  },
  {
    id: 1,
    name: 'Season End Date',
    title: '',
    value: 'seasonEndDate',
  },
  {
    id: 2,
    name: 'Total Lift',
    title: '',
    value: 'totalLift',
    userInput: true,
  },
  {
    id: 3,
    name: 'Lift Gain per Offense',
    title: 'Lift gain per single offense',
    value: 'liftGainPerOffense',
    userInput: true,
  },
  {
    id: 4,
    name: 'Lift Loss per Defense',
    title: 'Lift loss per full defense loss',
    value: 'liftLossPerDefense',
    userInput: true,
  },
  {
    id: 5,
    name: 'Lift to Goal',
    title: '',
    value: 'liftToGoal',
  },
  {
    id: 6,
    name: 'Offenses to Goal',
    title: 'Number of single offense matches needed to reach your goal',
    value: 'offensesToGoal',
  },
  {
    id: 7,
    name: 'Offenses Left',
    title: 'Number of single offense matches possible to play (16 is the most possible in a single season)',
    value: 'offensesLeftInSeason',
    userInput: true,
  },
  {
    id: 8,
    name: 'Max lift',
    title: 'Maximum lift possible assuming perfect offense and defense from now',
    value: 'maxLift',
  },
  {
    id: 9,
    name: 'Min lift',
    title: 'Minimum lift possible assuming perfect offense from now (lose all defenses)',
    value: 'minLift',
  },
  {
    id: 10,
    name: 'Defense Margin',
    title: 'The number of full defense losses you can take and still make your goal, assuming perfect offense',
    value: 'defenseMargin',
  },
  {
    id: 11,
    name: 'Defenses Can Lose',
    title: 'The number of defenses it is possible for you to lose lift on, based on the date of the last non-LLC defense you had',
    value: 'defensesCanLose',
  },
  {
    id: 12,
    name: 'Time to _ defenses',
    title: 'Time until it\'s possible to lose one less defense than you can now',
    value: 'timeToFewerDefenses',
  },
  {
    id: 13,
    name: 'Last non-LLC Defense',
    title: 'The date and time of the last defense you had that was not covered by lift loss control',
    value: 'lastDefenseDate',
    userInput: true,
  },
  {
    id: 14,
    name: 'LLC Time Left',
    title: 'Time left under lift loss control, based on the date of the last non-LLC defense you had',
    value: 'LLCTimeLeft',
  },
  {
    id: 15,
    name: 'Goal',
    title: '',
    value: 'liftGoal',
    userInput: true,
  },
];

const savedColumns = gotEm('columnData', defaultColumns);

export const columnData = writable(savedColumns);