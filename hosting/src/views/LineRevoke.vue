<template>
  <div id="line-revoke">
    <b>{{ message }}</b>
    <div v-if="choiceButtons" class="choice-buttons">
      <button class="accept-button" @click="pushAcceptButton">はい</button>
      <button class="cancel-button" @click="pushCancelButton">いいえ</button>
    </div>
    <button v-if="homeButton" class="home-button" @click="returnHome">
      ホームに戻る
    </button>
  </div>
</template>

<style lang="scss">
#line-revoke {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  * {
    margin: 1rem 1rem;
  }
  .choice-buttons {
    padding: 0 2rem;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  button {
    border: 0;
    border-radius: 5px;
    color: #fff;
    padding: 0.5rem 2rem;
    font-size: 1.5rem;
    min-width: 10rem;
    cursor: pointer;
    &:focus {
      outline: none;
    }
  }
  .accept-button {
    background: #02b202;
    &:hover {
      background: #00a300;
    }
    &:hover {
      box-shadow: 0 0 0 4px #c2e7bd;
    }
  }
  .home-button,
  .cancel-button {
    background: #a2a2a2;
    &:hover {
      background: #787878;
    }
    &:focus {
      box-shadow: 0 0 0 4px #f0f0f0;
    }
  }
}
</style>

<script lang="ts">
import { Vue } from "vue-property-decorator"

export default Vue.extend({
  name: "LineRevoke",
  data() {
    return {
      message: "通知の解除をしますか？",
      choiceButtons: true,
      homeButton: false,
    }
  },
  methods: {
    pushAcceptButton(): void {
      const id = this.$route.params.id
      this.message = "処理中です。しばらくお待ち下さい。"
      this.choiceButtons = false
      if (!id) {
        this.message = "エラーが発生しました。もう一度やり直してください。"
        this.choiceButtons = false
        this.homeButton = true
      }
      this.axios
        .post(process.env.VUE_APP_LINE_TOKEN_REVOKE_URL, { id })
        .then(() => {
          this.message = "処理が完了しました。"
          this.choiceButtons = false
          this.homeButton = true
        })
        .catch(() => {
          this.message = "エラーが発生しました。もう一度やり直してください。"
          this.choiceButtons = false
          this.homeButton = true
        })
    },
    pushCancelButton(): void {
      this.$router.push({ path: "/" })
    },
    returnHome(): void {
      this.$router.push({ path: "/" })
    },
  },
})
</script>
