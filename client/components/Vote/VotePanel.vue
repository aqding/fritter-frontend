<template>
  <div class="panel">
    <div>
      <UpvoteButton
        :freetId="freetId"
        :callback="changeUserVote"
        :userVote="userVote"
      />
    </div>
    <div>{{ this.upvotes - this.downvotes + this.userVote }}</div>
    <div>
      <DownvoteButton
        :freetId="freetId"
        :callback="changeUserVote"
        :userVote="userVote"
      />
    </div>
  </div>
</template>

<script>
import UpvoteButton from "@/components/Vote/UpvoteButton.vue";
import DownvoteButton from "@/components/Vote/DownvoteButton.vue";

export default {
  name: "VotePanel",
  components: {
    UpvoteButton,
    DownvoteButton,
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
  },
  data() {
    return {
      upvotes: 0,
      downvotes: 0,
      userVote: 0,
    };
  },
  created() {
    this.getVotes();
  },
  mounted() {},
  methods: {
    async getVotes() {
      const res = await fetch(`/api/vote/freet/${this.freetId}`);
      const votes = await res.json();
      this.upvotes = votes.filter((vote) => vote.vote === 1).length;
      this.downvotes = votes.filter((vote) => vote.vote === -1).length;
      const foundUserVote = votes.filter(
        (vote) => vote.userId === this.$store.state.id
      );
      this.userVote = foundUserVote.length !== 0 ? foundUserVote[0].vote : 0;
      if (this.userVote === 1) {
        this.upvotes -= 1;
      } else if (this.userVote === -1) {
        this.downvotes -= 1;
      }

      if (this.upvotes - this.downvotes + this.userVote < 0) this.callback();
    },

    changeUserVote(vote) {
      this.userVote = vote;
    },
  },
};
</script>

<style scoped>
.green {
  background-color: green;
}

.red {
  background-color: red;
}

.panel {
  display: flex;
  align-items: center;
  width: 5.5rem;
  justify-content: space-between;
}
</style>
