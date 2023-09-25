<script>
    import '../app.css'; // Ensure that Tailwind will be enabled across the entire app
    import Header from "$lib/Header.svelte";
</script>

<div class="h-screen w-screen flex flex-col bg-zinc-800">
    <Header />
    <slot />
</div>