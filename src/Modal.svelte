<script>
  export let props;

	import { fade, fly } from 'svelte/transition';

  let show = false;
  function showHide() {
    show = !show;
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      show = false;
    }
  }, false);

  document.addEventListener('click', e => {
    if (e.target.matches('.shadow')) {
      show = false;
    }
  }, false);
</script>

<button class="openBtn" class:imgBtn="{props.imageBtn}" on:click="{showHide}">
  {#if props.imageBtn} 
    <img class="icon-img" src="{props.src}" alt="{props.title} button"/>
  {:else}
    {props.title}
  {/if}
</button>

{#if show}
  <div class="shadow" transition:fade="{{duration: 200}}">
    <div class="modal" transition:fly="{{y: -200}}">
      <h3>{props.title}</h3>
      <slot name="content"></slot>
      <br>
      <div>
        <button on:click="{showHide}" class="saveBtn">Close</button>
        <!-- <button on:click="{showHide}">Close</button> -->
      </div>
    </div>
  </div>
{/if}


<style>
  .openBtn {
		position: absolute;
    margin: 1rem;
	}

  .imgBtn {
    width: 2em;
		height: 2em;
    background-color: transparent;
    border-radius: 50%;
    padding: 0;
  }

  .icon-img {
    width: 100%;
    height: 100%;
    filter: invert(var(--invert));
  }

  .shadow {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(35, 35, 35, 0.5);
    display: flex;
    justify-content: center;
    z-index: 1;
  }

  .modal {
    position: relative;
    top: 3rem;
    background-color: var(--bg);
    box-shadow: 10px 10px 15px rgba(30, 30, 30, 0.5);
    padding: 20px;
    border-radius: 7px;
    max-width: 80vw;
    height: min-content;
    z-index: 2;
    min-width: 25vw;
    text-align: center;
  }
</style>