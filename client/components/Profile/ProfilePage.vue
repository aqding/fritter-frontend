<template>
  <main>
    <section v-if="$store.state.username">
      <h1 class="name">{{ $route.params.username }}</h1>
      <div>
        {{ freets.length }} {{ freets.length === 1 ? "freet" : "freets" }}
      </div>

      <FollowButton
        v-if="$route.params.username !== $store.state.username"
        :author="$route.params.username"
        :authorId="$store.state.userMap.get($route.params.username)"
      />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login" class="unlink"> Sign in </router-link>to
          create Freets, view profiles, follow friends, and more!
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            {{ this.$route.params.username }}'s Freets
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
      </header>
      <section v-if="freets.length">
        <FreetComponent
          v-for="freet in freets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <article v-else>
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import FollowButton from "@/components/Follow/FollowButton.vue";
export default {
  name: "ProfilePage",
  data() {
    return { freets: [] };
  },
  components: { FreetComponent, FollowButton },
  methods: {
    getFreets() {
      this.freets = this.$store.state.freets.filter(
        (freet) => freet.author === this.$route.params.username
      );
    },
  },
  mounted() {
    this.getFreets();
    console.log(this.$store.state.users);
  },
};
</script>

<style scoped>
.name {
  font-size: 50px;
  margin-bottom: 0px;
}
</style>
