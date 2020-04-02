<template>
  <div id="home">
    <b class="description">
      AtCoderのコンテストについてお知らせします。現在はLINEのみ対応です。
    </b>
    <button class="signup-line" @click="signupLine">LINEで登録</button>
  </div>
</template>

<style lang="scss">
#home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  * {
    margin: 1rem 1rem;
  }
  .signup-line {
    border: 0;
    border-radius: 5px;
    background: #02b202;
    color: #fff;
    padding: 0.5rem 2rem;
    font-size: 1.5rem;
    min-width: 10rem;
    cursor: pointer;
    &:hover {
      background: #00a300;
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 0 4px #c2e7bd;
    }
    &[disabled] {
      color: #dddddd;
      background: #808080;
      cursor: not-allowed;
    }
  }
}
</style>

<script lang="ts">
import { Vue } from "vue-property-decorator"

export default Vue.extend({
  name: "Home",
  methods: {
    signupLine(): void {
      const url = "https://notify-bot.line.me/oauth/authorize"
      const state = Math.random()
        .toString(36)
        .slice(-10)
      const params = new URLSearchParams()
      params.append("response_type", "code")
      params.append("client_id", process.env.VUE_APP_LINE_CLIENT_ID)
      params.append("redirect_uri", location.href + "line/signup")
      params.append("scope", "notify")
      params.append("state", state)
      this.$store.dispatch("setLoginState", { loginState: state })
      location.href = `${url}?${params.toString()}`
    },
  },
})
</script>
