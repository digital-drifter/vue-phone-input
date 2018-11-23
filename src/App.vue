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

<style lang="stylus">
    list-options-height = 210px
    list-width = 100%
    min-height = 24px

    .vue-phone-input__wrapper
        background-color transparent
        background-image linear-gradient(#009688,#009688), linear-gradient(#d2d2d2,#d2d2d2)
        background-position bottom,50% calc(100% - 1px)
        background-repeat no-repeat
        background-size 0 2px, 100% 1px
        display inline-block
        flex-direction column
        min-height min-height

        input
            border none

            .is-valid
                background-color rgba(200,230,201,1)

            &:not(.is-valid)
                background-color rgba(255,205,210,.3)

        div
            position relative

            div
                align-items center
                color rgba(96,125,139,.6)
                display flex
                flex-direction row
                font-style italic
                min-width 42px
                text-align center
                width 42px

            input
                height min-height
                min-height min-height

            .list-wrapper
                box-shadow 2px 3px 10px -2px
                position absolute
                height min-height + list-options-height
                top 100%
                width 100%

                input, ul
                    display flex
                    flex-direction column
                    margin 0
                    padding 0
                    width list-width

                input
                    border none

                ul
                    background-color rgba(144,164,174,.1)
                    font-style italic
                    list-style-type none
                    margin-block-end unset
                    margin-block-start unset
                    height list-options-height
                    overflow auto
                    padding-inline-end unset
                    padding-inline-start unset
                    margin 0
                    position absolute
                    /*top 100%*/
                    z-index 10

                    li
                        text-align start

                        &.active
                            background-color rgba(144,164,174,.5)

                            span
                                color white !important

                    li:hover
                        background-color rgba(144,164,174,.1)
                        cursor pointer

        .list-enter-active, .list-leave-active, .list-move
            transition  all .5s cubic-bezier(.55, 0, .1, 1) // 800ms linear out-in // cubic-bezier(0.59, 0.12, 0.34, 0.95)
            // transition-property opacity, transform

        .list-enter
            opacity 0
            transform scale(0)
            // transform translateX(50px) scaleY(0.5)

//.list-enter-to
//  opacity 1
// transform translateX(0) scaleY(1)

        .list-leave-active
            opacity 0
            position absolute
            transform scale(0)

// .list-leave-to
//   opacity 0
// transform scaleY(0)
// transform-origin center top
</style>
