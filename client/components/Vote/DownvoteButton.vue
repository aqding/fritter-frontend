<script>
import VoteButton from "@/components/Vote/VoteButton.vue";

export default {
  name: "DownvoteButton",
  mixins: [VoteButton],
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
      url: "/api/vote",
      method: "PUT",
      hasBody: true,
      body: {
        userId: this.$store.state.id,
        freetId: this.freetId,
        vote: -1,
      },
      vote: "Downvote",
    };
  },
};
</script>
