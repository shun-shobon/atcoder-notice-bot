<template>
  <div id="app">
    <header>
      <router-link class="logo" to="/">
        <h1>AtCoder Notify</h1>
      </router-link>
    </header>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
@import url("https://use.typekit.net/bwl2bme.css");

$header-height: 4rem;

#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Hiragino Sans", "Noto Sans CJK JP", "Original Yu Gothic", "Yu Gothic",
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
    "Noto Sans Emoji";

  header {
    width: 100vw;
    height: $header-height;
    display: flex;
    align-items: center;
    position: fixed;
    z-index: 10;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.4);
    padding: 0 2rem;

    .logo {
      font-family: paralucent-stencil, sans-serif;
      font-weight: 500;
      font-style: normal;
      font-size: 2rem;
      color: #636363;
      text-decoration: none;
    }
  }

  .content {
    padding-top: $header-height;
  }
}

@font-face {
  font-family: "Original Yu Gothic";
  src: local("Yu Gothic Medium");
  font-weight: 100;
}

@font-face {
  font-family: "Original Yu Gothic";
  src: local("Yu Gothic Medium");
  font-weight: 200;
}

@font-face {
  font-family: "Original Yu Gothic";
  src: local("Yu Gothic Medium");
  font-weight: 300;
}

@font-face {
  font-family: "Original Yu Gothic";
  src: local("Yu Gothic Medium");
  font-weight: 400;
}

@font-face {
  font-family: "Original Yu Gothic";
  src: local("Yu Gothic Bold");
  font-weight: bold;
}
</style>
