<script>
  export let duration;
  export let name;

  import { onMount } from "svelte";
  import { parseTime } from "./utils";

  /**
   * Takes a hours, minutes, seconds array and converts it to total milliseconds
   * @param {(number[]|string[])} time
   */
   function toMs(...time) {
    time = time.map(i => parseInt(i) ? parseInt(i) : 0); // Make NaN zero instead of NaN
    return parseInt(time[0]) * 3600000 + parseInt(time[1]) * 60000 + parseInt(time[2]) * 1000;
  }

  function focusIn(e) {
    e.target.select();
  }

  function focusOut(e) {
    if (e.target.value === '') {
      e.target.value = '00';
    }
    for (let i of inputs) {
      if (i.value === '--') {
        i.value = '00';
      }
    }
    const zero = parseInt(parsedDuration.join('').replace(/-/g, ''));

    if (zero === 0) {
      for (let i of inputs) {
        i.value = '--';
      }
      duration = null;
    }
    else {
      duration = Date.now() - toMs(inputs[0].value, inputs[1].value, inputs[2].value);
    }
    update();
  }

  function input(e) {
    const startSelStart = e.target.selectionStart;

    // Disallow anything besides numerals
    e.target.value = e.target.value.replace(/[^0-9]/g, '');

    if (e.target.matches('.minutes') || e.target.matches('.seconds')) {
      if (e.inputType.match('delete')) {
        if (e.target.value === '' || parseInt(e.target.value) === 0) {
          e.target.value = '--';
        }
      }
      else if (e.target.value.match(/^[1-9][0-9]/)) {
        // If the input is already full, prevent further input by setting it to the previously stored value
        e.target.value = parsedDuration[e.target.matches('.minutes') ? 1 : 2];
        e.target.selectionStart = e.target.selectionEnd = startSelStart;
      }

      e.target.value = ('00' + e.target.value).slice(-2);

      // Only need to mess with the selection for minutes and seconds
      const endSelStart = e.target.selectionStart;

      // Expected to move 1 for deleting and adding
      if (Math.abs(startSelStart - endSelStart) !== 1 && e.target.value !== '--') {
        e.target.selectionStart = e.target.selectionEnd = endSelStart - 1;
      }
    }
    
    duration = Date.now() - toMs(inputs[0].value, inputs[1].value, inputs[2].value);
  }

  function update() {
    !document.activeElement.matches('.time') && requestAnimationFrame(update);
    parsedDuration = duration ? parseTime(Date.now() - duration, true, true) : ['--', '--', '--'];
  }

  let parsedDuration = duration ? parseTime(Date.now() - duration, true) : ['--', '--', '--'];
  let inputs;

  onMount(() => {
    inputs = document.getElementsByClassName('time');
    update();
  });
</script>


<div class="wrapper">
  <input class="hours time" name="{name} Hours" on:focusin="{focusIn}" on:input="{input}" on:focusout="{focusOut}" bind:value="{parsedDuration[0]}" pattern="[0-9]*" maxlength="2"
  />:<input class="minutes time" name="{name} Minutes" on:focusin="{focusIn}" on:input="{input}" on:focusout="{focusOut}" bind:value="{parsedDuration[1]}" pattern="[0-9]*" maxlength="3" 
  />:<input class="seconds time" name="{name} Seconds" on:focusin="{focusIn}" on:input="{input}" on:focusout="{focusOut}" bind:value="{parsedDuration[2]}" pattern="[0-9]*" maxlength="3" />
</div>

<style>
  .wrapper {
    box-sizing: border-box;
    border-radius: 7px;
    border: 1px solid #ccc;
    padding: 0.4rem;
    width: 10ch;
  }

  .time {
    padding: 0;
    width: 2ch;
    border: none;
    outline: none;
    border-radius: 0;
  }

  .hours {
    text-align: right;
  }
</style>