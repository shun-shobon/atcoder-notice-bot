<template>
  <div id="line-signup">
    <b>{{ message }}</b>
    <button v-if="homeButton" class="home" @click="returnHome">
      ホームに戻る
    </button>
  </div>
</template>

<style lang="scss">
#line-signup {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  * {
    margin: 1rem 1rem;
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
  name: "LineSignup",
  data() {
    return {
      message: "処理中です。しばらくお待ち下さい...",
      homeButton: false,
    }
  },
  mounted(): void {
    const paramCode = this.$route.query.code
    const paramState = this.$route.query.state
    const storeState = this.$store.getters.getLoginState
    if (!paramCode || !paramState || !storeState || paramState !== storeState) {
      this.message = "エラーが発生しました。もう一度やり直してください。"
      this.homeButton = true
      return
    }
    this.axios
      .post(process.env.VUE_APP_LINE_TOKEN_ISSUE_URL, {
        code: paramCode,
      })
      .then(() => {
        this.message = "処理が完了しました。"
        this.homeButton = true
      })
      .catch(() => {
        this.message = "エラーが発生しました。もう一度やり直してください。"
        this.homeButton = true
      })
  },
  methods: {
    returnHome(): void {
      this.$router.push({ path: "/" })
    },
  },
})
</script>
