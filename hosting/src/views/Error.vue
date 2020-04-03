<template>
  <div id="error">
    <h1>404 not found</h1>
    <b>存在しないページにアクセスしました。</b>
    <button class="home" @click="returnHome">ホームに戻る</button>
  </div>
</template>

<style lang="scss">
#error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  * {
    margin: 1rem 1rem;
  }
  h1 {
    font-size: 3rem;
  }
  .home {
    border: 0;
    border-radius: 5px;
    background: #a2a2a2;
    color: #fff;
    padding: 0.5rem 2rem;
    font-size: 1.5rem;
    min-width: 10rem;
    cursor: pointer;
    &:hover {
      background: #787878;
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 0 4px #f0f0f0;
    }
  }
}
</style>

<script lang="ts">
import { Vue } from "vue-property-decorator"

export default Vue.extend({
  name: "Error",
  methods: {
    returnHome() {
      this.$router.push({ path: "/" })
    },
  },
})
</script>
