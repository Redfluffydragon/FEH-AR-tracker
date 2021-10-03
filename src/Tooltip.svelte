<script>
  import { onMount } from "svelte";

  import { dragged, showTooltips } from "./stores";

  export let props;

  let show = false;

  let type = props.touchOnly ? 'touchend' : 'click';

  onMount(() => {
    let element = document.getElementById(props.id) 
    element && props.text &&
    document.addEventListener(type, e => {
      if ($dragged || !$showTooltips) {
        return;
      }

      if (e.target.closest(`#${props.id}`) && !e.target.matches('input')) {
        show = !show;
      }
      else {
        show = false;
      }
    }, false);
  });
  
</script>


<span class="tooltip" class:hide="{!show}">{props.text}</span>

<style>
  .tooltip {
    background: var(--bg);
    padding: 0.4rem;
    position: absolute;
    border-radius: 7px;
    margin: 4px;
    z-index: 1;
    box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.5);
    justify-self: center;
  }

  .hide {
    display: none;
  }
</style>