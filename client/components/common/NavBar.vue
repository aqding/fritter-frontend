<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
      <img src="../../public/logo.svg" class="invert" />
      <h1 class="title">Fritter</h1>
    </div>
    <div class="right">
      <router-link to="/" class="unlink row">
        <Icon
          class="icon"
          icon="carbon:home"
          color="white"
          width="30"
          height="30"
        />
        <div>Home</div>
      </router-link>
      <router-link
        class="unlink row"
        v-if="$store.state.username"
        :to="'/profile/' + $store.state.username"
      >
        <Icon
          class="icon"
          icon="akar-icons:person"
          color="white"
          width="30"
          height="30"
        />
        <div>Profile</div>
      </router-link>
      <router-link
        v-if="$store.state.username"
        class="unlink row"
        to="/account"
      >
        <Icon
          class="icon"
          icon="akar-icons:gear"
          color="white"
          width="30"
          height="30"
        />
        <div>Account</div>
      </router-link>
      <router-link v-else class="unlink row" to="/login">
        <Icon
          icon="ion:enter-outline"
          class="icon"
          color="white"
          width="30"
          height="30"
        />
        <div>Login</div>
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>
<script>
import { Icon } from "@iconify/vue2";
export default {
  components: {
    Icon,
  },
};
</script>
<style scoped>
.icon {
  margin-right: 10px;
}
nav {
  padding-top: 3%;
  padding-left: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.title {
  font-size: 50px;
  margin: 0 5px;
}

img {
  height: 32px;
}

.left {
  display: flex;
  align-items: center;
}

.right {
  font-size: 20px;
  display: flex;
  flex-direction: column;
  gap: 50px;
  grid-auto-flow: column;
  margin-top: 4rem;
}

.right a {
  margin-left: 5px;
}

.alerts {
  width: 25%;
}

.invert {
  filter: invert(100%);
}

.row {
  display: flex;
  align-items: center;
  font-size: 26px;
}

.row:hover {
  color: rgb(47, 187, 212);
  text-decoration: none;
}
</style>
