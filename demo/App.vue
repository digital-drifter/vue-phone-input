<template>
    <div id="app">
        <vue-phone-input name="phone_number"

                         v-model="phoneNumber">
        </vue-phone-input>
    </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  @Component
  export default class App extends Vue {
    public phoneNumber: string = ''

    public allowedCountries: string[] = ['us', 'jp', 'gb', 'fr', 'sa']
  }
</script>
