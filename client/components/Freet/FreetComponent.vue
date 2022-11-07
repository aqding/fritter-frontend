<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="freet">
    <div>
      <header>
        <p class="author">
          <router-link
            class="author: unlink"
            v-if="$store.state.username"
            :to="'/profile/' + freet.author"
          >
            @{{ freet.author }}
          </router-link>
        </p>
        <i class="date">{{ freet.dateModified }}</i>
      </header>
      <textarea
        v-if="editing"
        class="content"
        :value="draft"
        @input="draft = $event.target.value"
      />
      <div v-else class="content">
        <p v-if="!hidden">
          {{ freet.content }}
        </p>
        <p v-else @click="setHidden">
          <i>This content has been hidden. Click to see it anyways.</i>
        </p>
      </div>
      <VotePanel ref="votes" :freetId="freet._id" :callback="setHidden" />

      <section class="alerts">
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
    </div>
    <div v-if="$store.state.username === freet.author" class="actions">
      <button v-if="editing" @click="submitEdit">Save</button>
      <button v-if="editing" @click="stopEditing">Cancel</button>
      <button v-if="!editing" @click="startEditing">Edit</button>
      <button @click="deleteFreet" class="red">Delete</button>
    </div>
    <FollowButton
      class="follow"
      v-if="freet.author !== $store.state.username && !$route.params.username"
      :author="freet.author"
      :authorId="freet.authorId"
    />
  </article>
</template>

<script>
import VotePanel from "@/components/Vote/VotePanel.vue";
import FollowButton from "@/components/Follow/FollowButton.vue";
import { Icon } from "@iconify/vue2";
export default {
  name: "FreetComponent",
  components: {
    VotePanel,
    FollowButton,
    Icon,
  },
  props: {
    freet: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      hidden: false,
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  mounted() {},

  methods: {
    setHidden() {
      this.hidden = !this.hidden;
    },
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: "DELETE",
        callback: () => {
          this.$store.commit("alert", {
            message: "Successfully deleted freet!",
            status: "success",
          });
        },
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error =
          "Error: Edited freet content should be different than current freet content.";
        this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: "PATCH",
        message: "Successfully edited freet!",
        body: JSON.stringify({ content: this.draft }),
        callback: () => {
          this.$set(this.alerts, params.message, "success");
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        },
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method,
        headers: { "Content-Type": "application/json" },
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit("refreshFreets");

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
.freet {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
  border-color: white;
  margin-bottom: 40px;
  border-radius: 20px;
  color: white;
  display: flex;
  justify-content: space-between;
}

.author {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 5px;
}

.date {
  font-size: 16px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 1.5rem;
}

.follow {
  margin-top: 1.5rem;
}
button {
  border-radius: 15px;
  height: 30px;
  width: 70px;
  color: white;
  transition: 0.5s;
  font-size: 14px;
}

button:hover {
  background-color: rgb(21, 120, 138);
}

textarea {
  resize: none;
  width: 300%;
  height: 4rem;
}

.red {
  background-color: rgb(209, 31, 31);
}

.red:hover {
  background-color: rgb(145, 22, 22);
}
</style>
