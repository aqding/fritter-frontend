<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateFreetForm />
      <modal name="editing" height="90%">
        <EditMultifeedForm
          :multifeed="$store.state.multifeeds[$store.state.editingMultifeed]"
          :callback="hide"
        />
      </modal>

      <modal name="add" height="90%">
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

        <dropdown-menu direction="right" :withDropdownCloser="true">
          <button slot="trigger">Multifeeds</button>
          <div slot="header">Select a Multifeed</div>
          <ul slot="body">
            <li
              dropdown-closer
              @click="
                $store.commit('updateActiveMultifeed', 'All');
                $store.commit('updateFilteredContent', null);
              "
            >
              All
            </li>

            <li
              dropdown-closer
              @click="
                $store.commit('updateActiveMultifeed', 'Following');
                $store.commit('updateFilteredContent', $store.state.following);
              "
            >
              Following
            </li>
            <li
              dropdown-closer
              v-for="(multifeed, index) in $store.state.multifeeds"
            >
              <div
                @click="
                  $store.commit('updateActiveMultifeed', multifeed.name);
                  $store.commit('updateFilteredContent', multifeed.content);
                "
              >
                {{ multifeed.name }}
              </div>
              <button
                @click="
                  $store.commit('updateEditingMultifeed', index);
                  show();
                "
              >
                Edit
              </button>
            </li>

            <li dropdown-closer>
              <button @click="showAdd()">New Multifeed</button>
            </li>
          </ul>
          <!-- <div slot="footer">Dropdown Footer</div> -->
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
  },

  mounted() {},
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
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
