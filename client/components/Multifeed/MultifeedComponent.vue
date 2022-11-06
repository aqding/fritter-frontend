<template>
  <form>
    <h3>
      <input v-model="name" type="text" />
      <!-- {{ name }} -->
    </h3>

    <div>
      <div v-for="user in $store.state.users">
        <div>{{ user }}</div>
        <button v-if="content.includes(user)" @click="remove(user)">
          Remove
        </button>
        <button v-else @click="add(user)">Add</button>
      </div>
      <button
        @click="
          submit();
          callback();
        "
      >
        Confirm
      </button>
      <button
        v-if="!creating"
        @click="
          deleteMultifeed();
          callback();
        "
      >
        Delete
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: "MultifeedComponent",
  props: {
    multifeed: {
      type: Object,
    },
    callback: {
      type: Function,
    },
  },

  data() {
    return {
      creating: true,
      name: "",
      content: [],
      url: "/api/multifeed",
      method: "PUT",
    };
  },
  methods: {
    add(name) {
      this.content.push(name);
    },

    remove(name) {
      this.content.splice(this.content.indexOf(name), 1);
    },

    async deleteMultifeed() {
      const url = `/api/multifeed/${this.multifeed._id}`;
      const options = {
        method: "DELETE",
        credientials: "same-origin",
      };
      try {
        const r = await fetch(url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        const response = await r.json();
        console.log(response);
        console.log("SUCCESSFULLY DELETED");
        this.$store.commit("refreshMultifeeds");
        if (this.name === this.$store.state.activeMultifeed) {
          this.$store.commit("updateFilteredContent", null);
          this.$store.commit("updateActiveMultifeed", "All");
        }

        console.log("POST DELETION", this.$store.state.activeMultifeed);
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },

    async submit() {
      const url = this.url;
      const body = {
        name: this.name,
        content: this.content.map((username) =>
          this.$store.state.userMap.get(username)
        ),
      };

      if (this.multifeed) body.multifeedId = this.multifeed._id;

      const options = {
        method: this.method,
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body),
      };

      try {
        const r = await fetch(url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        const response = await r.json();
        console.log(response);
        this.$store.commit("refreshMultifeeds");
        this.$store.commit("updateFilteredContent", this.content);
        this.$store.commit("updateActiveMultifeed", this.name);
        console.log(this.$store.state.multifeeds);
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>
