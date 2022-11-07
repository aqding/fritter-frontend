<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <h1 class="title">Home</h1>
      <header>
        <h2>Welcome, {{ $store.state.username }}!</h2>
      </header>
      <CreateFreetForm />
      <modal name="editing" height="70%">
        <EditMultifeedForm
          :multifeed="$store.state.multifeeds[$store.state.editingMultifeed]"
          :callback="hide"
        />
      </modal>

      <modal name="add" height="70%">
        <AddMultifeedForm :callback="hideAdd" />
      </modal>
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
            Viewing: {{ $store.state.activeMultifeed }}
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right"></div>

        <dropdown-menu
          v-if="$store.state.username"
          direction="right"
          :withDropdownCloser="true"
        >
          <button class="multifeedButton" slot="trigger">Multifeeds</button>
          <ul slot="header" class="multifeedPanel">
            <div class="panelTitle">Multifeed Selection</div>
            <div class="multifeedList">
              <li
                class="row"
                dropdown-closer
                @click="
                  $store.commit('updateActiveMultifeed', 'All');
                  $store.commit('updateFilteredContent', null);
                "
              >
                All
              </li>

              <li
                class="row"
                dropdown-closer
                @click="
                  $store.commit('updateActiveMultifeed', 'Following');
                  $store.commit(
                    'updateFilteredContent',
                    $store.state.following
                  );
                "
              >
                Following
              </li>
              <li
                class="row"
                dropdown-closer
                v-for="(multifeed, index) in $store.state.multifeeds"
              >
                <div
                  class="multifeedName"
                  @click="
                    $store.commit('updateActiveMultifeed', multifeed.name);
                    $store.commit('updateFilteredContent', multifeed.content);
                  "
                >
                  {{ multifeed.name }}
                </div>
                <Icon
                  icon="akar-icons:gear"
                  color="white"
                  width="30"
                  height="30"
                  @click.native="
                    $store.commit('updateEditingMultifeed', index);
                    show();
                  "
                />
              </li>

              <li class="add" dropdown-closer>
                <button @click="showAdd()">New</button>
              </li>
            </div>
          </ul>
        </dropdown-menu>
      </header>
      <section v-if="$store.state.freets.length">
        <div v-for="freet in freets">
          <FreetComponent
            v-if="
              $store.state.activeMultifeed === 'All' ||
              filteredContent.has(freet.author)
            "
            :key="freet.id"
            :freet="freet"
          />
        </div>
      </section>
      <article v-else>
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import CreateFreetForm from "@/components/Freet/CreateFreetForm.vue";
import MultifeedComponent from "@/components/Multifeed/MultifeedComponent.vue";
import EditMultifeedForm from "@/components/Multifeed/EditMultifeedForm.vue";
import AddMultifeedForm from "@/components/Multifeed/AddMultifeedForm.vue";
import { Slide, FallDown } from "vue-burger-menu";
import DropdownMenu from "v-dropdown-menu";
import "v-dropdown-menu/dist/v-dropdown-menu.css";
import VModal from "vue-js-modal";
import { Icon } from "@iconify/vue2";

export default {
  name: "FreetPage",
  components: {
    FreetComponent,
    CreateFreetForm,
    Slide,
    FallDown,
    DropdownMenu,
    VModal,
    MultifeedComponent,
    EditMultifeedForm,
    AddMultifeedForm,
    Icon,
  },
  computed: {
    filteredContent() {
      return this.$store.state.filteredContent;
    },
    freets() {
      return this.$store.state.freets;
    },
  },
  methods: {
    show() {
      this.$modal.show("editing");
    },
    hide() {
      this.$modal.hide("editing");
    },
    showAdd() {
      this.$modal.show("add");
    },
    hideAdd() {
      this.$modal.hide("add");
    },

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

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header,
header > * {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  margin-right: 10px;
}

section .scrollbox {
  padding-top: 3%;
  overflow-y: scroll;
}

.title {
  font-size: 50px;
}

.multifeedButton {
  width: 100px;
  height: 40px;
  border-radius: 20px;
  color: white;
  background-color: rgb(47, 187, 212);
  transition: 0.5s;
  margin: 0;
}

.multifeedButton:hover {
  background-color: rgb(21, 120, 138);
}

.multifeedPanel {
  background-color: rgb(30, 30, 30);
  margin: 0px;
  padding: 0px;
  height: 30vh;
}

.panelTitle {
  text-align: center;
  font-size: 25px;
  padding: 10px;
}
.multifeedList {
  display: flex;
  flex-direction: column;
  overflow: scroll;
  gap: 9px;
}

.row {
  display: flex;
  justify-content: space-between;
  height: 24px;
  align-items: center;
  padding-right: 4px;
  padding-left: 4px;
  cursor: pointer;
}

.multifeedName {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 80%;
}

.multifeedList::-webkit-scrollbar {
  display: none;
}

.add {
  display: flex;
  justify-content: center;
  margin-top: 6px;
}

button {
  border-radius: 30px;
  height: 40px;
  width: 60px;
  color: white;
  transition: 0.5s;
}

button:hover {
  background-color: rgb(21, 120, 138);
}
</style>
