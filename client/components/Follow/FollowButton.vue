<template>
  <button class="unfollow" v-if="following.has(`${author}`)" @click="unfollow">
    Unfollow
  </button>

  <button v-else @click="follow">Follow</button>
</template>

<script>
export default {
  name: "FollowButton",
  props: {
    author: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
    },
  },
  computed: {
    following() {
      return this.$store.state.following;
    },
  },
  methods: {
    async follow() {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        message: "Successfully followed!",
        body: JSON.stringify({
          follower: this.$store.state.id,
          followee: this.authorId,
        }),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        },
      };
      console.log(options);
      try {
        const r = await fetch(`/api/follow`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        const newSet = this.$store.state.following;
        newSet.add(this.author);
        this.$store.commit("updateFollowing", newSet);
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async unfollow() {
      const options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        message: "Successfully unfollowed!",
        body: JSON.stringify({
          follower: this.$store.state.id,
          followee: this.authorId,
        }),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        },
      };
      try {
        const r = await fetch(`/api/follow`, options);
        if (!r.ok) {
          const res = await r.json();
          console.log(res);
          throw new Error(res.error);
        }

        const newSet = this.$store.state.following;
        newSet.delete(this.author);
        this.$store.commit("updateFollowing", newSet);
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
button {
  width: 70px;
  background-color: rgb(47, 187, 212);
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  transition: 0.5s;
  color: white;
  width: 90px;
  height: 30px;
  border-radius: 15px;
  margin-top: 10px;
}

button:hover {
  background-color: rgb(21, 120, 138);
}

.unfollow {
  background-color: rgb(209, 31, 31);
}

.unfollow:hover {
  background-color: rgb(145, 22, 22);
}
</style>
