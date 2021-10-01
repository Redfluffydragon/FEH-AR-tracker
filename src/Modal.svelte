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

<button class="openBtn" class:imgBtn="{props.imageBtn}" class:spinBtn="{props.spinBtn}" class:spinOpen="{(show && props.spinBtn)}" on:click="{showHide}">
  {#if props.imageBtn}
    <img class="icon-img" src="{props.src}" alt="{props.title} button"/>
  {:else}
    {props.btnText || props.title}
  {/if}
</button>

{#if show}
  <div class="shadow" transition:fade="{{duration: 200}}">
    <div class="modal" transition:fly="{{y: -200}}">
      <h3>{props.title}</h3>
      <slot name="content"></slot>
      <br>
      <slot name="actionBtns">
        <div>
          {#if props.goBtn}
            <button on:click="{() => {
              props.goFunc();
              showHide();
              }}" class="saveBtn biggerBtn">{props.goBtn}</button>
          {/if}
            <button on:click="{showHide}" class="closeBtn">{props.closeText || 'Cancel'}</button>
        </div>
      </slot>
    </div>
  </div>
{/if}


<style>
  .openBtn {
    z-index: 0;
	}

  .imgBtn {
    width: 2em;
		height: 2em;
    background-color: transparent;
    border-radius: 50%;
    padding: 0;
    transition: transform 0.3s;
  }

  .imgBtn:not(:disabled):active {
    box-shadow: none;
  }

  .spinBtn:not(:disabled):active {
    transform: rotate(30deg);
  }

  .spinOpen {
    transform: rotate(60deg);
  }

  .icon-img {
    width: 100%;
    height: 100%;
    filter: invert(var(--invert));
  }

  .biggerBtn {
    padding: 9px 12px;
  }

  .closeBtn {
    background: var(--bg);
    border: 2px solid silver;
    border-radius: 4px;
    box-sizing: border-box;
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
    box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.5);
    padding: 20px;
    border-radius: 7px;
    max-width: 80vw;
    height: min-content;
    z-index: 2;
    min-width: 25vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>