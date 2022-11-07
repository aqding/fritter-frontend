<template>
  <form class="formBackground">
    <div class="formContent">
      <div>
        <input v-model="name" type="text" placeholder="Multifeed Name" />
      </div>

      <div class="userContainer">
        <div class="row" v-for="user in $store.state.users">
          <div class="userName">@{{ user }}</div>
          <button
            class="red"
            v-if="content.includes(user)"
            @click="remove(user)"
          >
            Remove
          </button>
          <button v-else @click="add(user)">Add</button>
        </div>
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
        class="red"
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

<style scoped>
.formBackground {
  background-color: rgb(30, 30, 30);
  height: 100%;
  overflow: scroll;
}

.formContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4rem;
  gap: 2rem;
}

input {
  background-color: rgb(30, 30, 30);
  border: 1px solid;
  border-color: rgb(118, 118, 118);
  border-radius: 10px;
  height: 40px;
  font-size: 24px;
  padding: 8px;
  text-align: center;
  margin-bottom: 2rem;
}

.row {
  display: flex;
  width: 60%;
  justify-content: space-between;
  gap: 2rem;
  align-items: center;
}

.userContainer {
  display: flex;
  flex-direction: column;
  width: 80%;
  align-items: center;
  gap: 1rem;
}

.userName {
  font-size: 25px;
}
button {
  border-radius: 30px;
  height: 40px;
  width: 80px;
  color: white;
  transition: 0.5s;
}
button:hover {
  background-color: rgb(21, 120, 138);
}

.red {
  background-color: rgb(209, 31, 31);
}

.red:hover {
  background-color: rgb(145, 22, 22);
}
</style>
