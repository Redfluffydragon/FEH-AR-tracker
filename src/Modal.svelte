<script>
  export let props;

	import { fade, fly } from 'svelte/transition';

  let show = false;
  function showHide() {
    show = !show;
  }

  function saveEdit() {
    
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

<button class="openBtn" on:click="{showHide}">
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
        <button on:click="{showHide}" class="saveBtn">Save</button>
        <button on:click="{showHide}">Cancel</button>
      </div>
    </div>
  </div>
{/if}


<style>
  .openBtn {
		position: absolute;
		width: 2em;
		height: 2em;
    background-color: transparent;
    border-radius: 50%;
    padding: 0;
	}

  .icon-img {
    width: 100%;
    height: 100%;
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
    padding-top: 3em;
    z-index: 1;
  }

  .modal {
    position: relative;
    background-color: white;
    box-shadow: 10px 10px 15px rgba(30, 30, 30, 0.5);
    padding: 20px;
    border-radius: 15px;
    width: clamp(min-content, 30vw, 90vw);
    height: min-content;
    z-index: 2;
    min-width: 25vw;
  }
</style>