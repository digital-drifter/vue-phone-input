<template>
    <div id="app">
        <vue-phone-input name="phone_number" v-model="phoneNumber"></vue-phone-input>
        <p>{{ phoneNumber }}</p>
    </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  @Component
  export default class App extends Vue {
    public phoneNumber: string = ''
  }
</script>
