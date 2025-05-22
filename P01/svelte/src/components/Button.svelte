<script>
    let { 
        size = 'small',
        bgColor = 'inherit',
        textColor = 'inherit',
        shadow = false,
        disabled = false,
        ...restProps
    } = $props();
    // export let size = 'small';
    // export let shadow = false;
    // export let bgColor = 'inherit';
    // export let textColor = 'inherit';
    // export let disabled = false;
    
    let isLeftHovered = $state();
</script>

<button 
    onclick={() => {}}
    {disabled}
    style:--buttonBgColor={bgColor}
    style:--buttonTextColor={textColor}
    class:size-lg={size === 'large'}
    class:size-sm={size === 'small'}
    class:has-left={$$slots.leftContent}
    class:shadow
    {...restProps}
>
    {#if $$slots.leftContent}
        <div 
            class="left-content"
            onmouseenter={() => (isLeftHovered = true)}
            onmouseleave={() => (isLeftHovered = false)}
            role="presentation"
        >
            <slot name="leftContent" {isLeftHovered} />
        </div>
    {/if}
    <slot {isLeftHovered}>Falback</slot>
</button>

<style lang="scss">
    button {
        display: flex;
        align-items: center;
        border: none;
        background-color: var(--buttonBgColor);
        color: var(--buttonTextColor);
        font-weight: bold;
        border-radius: 5px;
        cursor: pointer;
        .left-content {
            margin-right: 10px;
        }
        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        &:hover {
            background-image: linear-gradient(rgba(0, 0, 0, 0.4) 0 0);
        }
        &:active {
            background-image: linear-gradient(rgba(255, 255, 255, 0.1) 0 0);
        }
        &.size-sm {
            padding: 15px 20px;
        }
        &.size-lg {
            padding: 20px 25px;
        }
        &.shadow {
            box-shadow: 0 10px rgba(1, 1, 1, 0.3);
        }
    }
</style>