<template>
  <div @click="submitVote">
    <Icon
      v-if="this.userVote === 1"
      icon="bxs:upvote"
      width="30"
      height="30"
      color="orange"
    />
    <Icon v-else icon="bx:upvote" width="30" height="30" />
  </div>
</template>

<script>
import { Icon } from "@iconify/vue2";
export default {
  name: "UpvoteButton",
  components: {
    Icon,
  },
  props: {
    freetId: {
      type: String,
      required: true,
    },
    callback: {
      type: Function,
      required: true,
    },
    userVote: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      url: "/api/vote",
      method: "PUT",
      hasBody: true,
      body: {
        userId: this.$store.state.id,
        freetId: this.freetId,
        vote: 1,
      },
      vote: "Upvote",
      userVote: this.userVote,
    };
  },
  methods: {
    async submitVote() {
      this.callback(this.userVote === 1 ? 0 : 1);
      const options = {
        method: this.method,
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(this.body),
      };

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        const response = await r.json();
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>
