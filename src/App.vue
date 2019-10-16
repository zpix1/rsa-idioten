<template>
  <div id="app" class="container">
    <MainView></MainView>
  </div>
</template>

<script>
import MainView from './components/MainView.vue'

export default {
  name: 'app',
  components: {
    MainView
  }
}
</script>

<style>
.container {
  max-width: 1000px;
  margin: 0 auto;
  font-family: "Computer Modern Sans", sans-serif;
}
</style>