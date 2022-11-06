<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>{{ $route.params.username }}</h2>
      </header>
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login"> Sign in </router-link>
          to create, edit, and delete freets.
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
export default {
  name: "ProfilePage",
  data() {
    return { freets: [] };
  },
  components: { FreetComponent },
  methods: {
    getFreets() {
      this.freets = this.$store.state.freets.filter(
        (freet) => freet.author === this.$route.params.username
      );
    },
  },
  mounted() {
    this.getFreets();
  },
};
</script>
