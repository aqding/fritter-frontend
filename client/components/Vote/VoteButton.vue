<template>
  <button @click="submitVote">
    {{ this.vote }}
  </button>
</template>

<script>
export default {
  name: "VoteButton",
  data() {
    return {
      vote: "Upvote",
    };
  },
  methods: {
    async submitVote() {
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
        this.callback(response.vote);
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>
