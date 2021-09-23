import { writable } from 'svelte/store';

import { gotEm } from './utils';

export const totalLift = writable(18000);
export const liftGainPerOffense = writable(190);
export const liftLossPerDefense = writable(40);
export const offensesLeftInSeason = writable(16);
export const lastDefenseDate = writable(null);
export const liftGoal = writable(20800);
export const edit = writable(false);

const defaultShow = new Array(16).fill(true);
const savedColumns = gotEm('showColumns', defaultShow);

export const showColumns = writable(savedColumns);

const defaultData = [
  {
    id: 0,
    show: true,
    name: 'Season',
    title: '',
    value: 'season',
  },
  {
    id: 1,
    show: true,
    name: 'Season End Date',
    title: '',
    value: 'seasonEndDate',
  },
  {
    id: 2,
    show: true,
    name: 'Total Lift',
    title: 'Manually input',
    value: 'totalLift',
    userInput: true,
  },
  {
    id: 3,
    show: true,
    name: 'Lift Gain per Offense',
    title: 'Lift gain per single offense, not double',
    value: 'liftGainPerOffense',
    userInput: true,
  },
  {
    id: 4,
    show: true,
    name: 'Lift Loss per Defense',
    title: 'Lift loss per full defense loss',
    value: 'liftLossPerDefense',
    userInput: true,
  },
  {
    id: 5,
    show: true,
    name: 'Lift to Goal',
    value: 'liftToGoal',
  },
  {
    id: 6,
    show: true,
    name: 'Offenses to Goal',
    title: 'Number of single offense matches needed to reach your lift goal',
    value: 'offensesToGoal',
  },
  {
    id: 7,
    show: true,
    name: 'Offenses Left in Season',
    title: 'Number of single offense matches possible to play (manually input)',
    value: 'offensesLeftInSeason',
    userInput: true,
  },
  {
    id: 8,
    show: true,
    name: 'Max lift',
    title: 'Maximum lift possible assuming perfect offense',
    value: 'maxLift',
  },
  {
    id: 9,
    show: true,
    name: 'Min lift',
    title: 'Minimum lift possible assuming perfect offense (lose all defenses)',
    value: 'minLift',
  },
  {
    id: 10,
    show: true,
    name: 'Defense Margin',
    title: 'The number of full defense losses you can take and still make your goal, assuming perfect offense',
    value: 'defenseMargin',
  },
  {
    id: 11,
    show: true,
    name: 'Defenses Can Lose',
    title: 'The number of defenses it is possible for you to lose lift on, based on the date of the last non-LLC defense you had',
    value: 'defensesCanLose',
  },
  {
    id: 12,
    show: true,
    name: 'Time to _ defenses',
    title: 'Time until you can lose one less defense',
    value: 'timeToFewerDefenses',
  },
  {
    id: 13,
    show: true,
    name: 'Last non-LLC Defense',
    title: 'The date of the last defense you had that was not covered by lift loss control (manually input)',
    value: 'lastDefenseDate',
    userInput: true,
  },
  {
    id: 14,
    show: true,
    name: 'LLC Time Left',
    title: 'Time left under lift loss control, based on the date of the last non-LLC defense you had',
    value: 'LLCTimeLeft',
  },
  {
    id: 15,
    show: true,
    name: 'Lift Goal',
    title: 'Your lift goal (manually input)',
    value: 'liftGoal',
    userInput: true,
  },
];
const savedData = gotEm('thisWeekData', defaultData);

export const thisWeekData = writable(savedData);