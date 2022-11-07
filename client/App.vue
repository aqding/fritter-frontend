<template>
  <div id="app" class="background layout">
    <NavBar class="fadeInFast" />
    <router-view class="contentArea fadeInSlow" />
  </div>
</template>

<script>
import NavBar from "@/components/common/NavBar.vue";

export default {
  name: "App",
  components: { NavBar },
  beforeCreate() {
    // Sync stored username to current session
    fetch("/api/users/session", {
      credentials: "same-origin", // Sends express-session credentials with request
    })
      .then((res) => res.json())
      .then((res) => {
        const user = res.user;
        this.$store.commit("setUsername", user ? user.username : null);
      });

    // Clear alerts on page refresh
    this.$store.state.alerts = {};
  },
  methods: {
    async getFollowing() {
      const url = `/api/follow/following/${this.$store.state.id}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit(
          "updateFollowing",
          new Set(res.following.map((follow) => follow.followeeName))
        );
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },

    async getMultifeeds() {
      const url = `/api/multifeed/user?author=${this.$store.state.id}`;
      console.log(url);
      try {
        const r = await fetch(url);
        const res = await r.json();
        console.log(res);
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit("updateMultifeeds", res);
        this.$store.commit("updateActiveMultifeed", "All");
        this.$store.commit("updateFilteredContent", null);
        console.log(this.$store.state.multifeeds);
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },

    async getFreetsInit() {
      const url = "/api/freets";
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit("updateFreets", res);
        console.log(this.$store.state.freets);
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },

    async getUsersInit() {
      const url = "/api/users";
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        console.log(res);
        const newMap = new Map(
          res.map((object) => [object.username, object._id])
        );
        this.$store.commit("updateUserMap", newMap);
        this.$store.commit(
          "updateUsers",
          res.map((user) => user.username)
        );
        console.log(this.$store.state.users);
        console.log(this.$store.state.userMap);
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },

  mounted() {
    this.getFreetsInit();
    this.getFollowing();
    this.getMultifeeds();
    this.getUsersInit();
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  height: 100vh;
  flex-direction: column;
  display: flex;
  padding: 0;
  margin: 0;
  font-size: 1.2em;
}

main {
  padding: 0 5em 5em;
}

input,
textarea {
  background-color: rgb(15, 15, 15);
  color: white;
  outline: none;
}

.layout {
  display: flex;
  width: 100vw;
  justify-content: space-between;
}

.alerts {
  position: absolute;
  z-index: 99;
  bottom: 0;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 10%);
  width: 100%;
  text-align: center;
}

.alerts article {
  border-radius: 5px;
  padding: 10px 20px;
  color: #fff;
}

.contentArea {
  overflow: scroll;
  width: 70%;
  margin-right: 10rem;
  padding-right: 10%;
}
.background {
  background-color: rgb(15, 15, 15);
  color: white;
  height: 100vh;
}
.alerts p {
  margin: 0;
}

.alerts .error {
  background-color: rgb(166, 23, 33);
}

.alerts .success {
  background-color: rgb(45, 135, 87);
}

.unlink {
  text-decoration: none;
  color: white;
}

.unlink:hover {
  text-decoration: underline;
}

button {
  background-color: rgb(47, 187, 212);
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}

.fadeInFast {
  animation: fadeIn 2s;
}

.fadeInSlow {
  animation: fadeInSlow 2s;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeInSlow {
  0% {
    opacity: 0;
  }
  33% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
