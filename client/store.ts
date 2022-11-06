import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    id: null,
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    following: new Set([]),
    multifeeds: [],
    activeMultifeed: "All",
    filteredContent: new Set([]),
    editingMultifeed: null,
    users: [],
    userMap: new Map([]),
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setId(state, id) {
      /**
       * Update the stored id to the specified one.
       * @param id - new id to set
       */
      state.id = id;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter
        ? `/api/users/${state.filter}/freets`
        : "/api/freets";
      const res = await fetch(url).then(async (r) => r.json());
      state.freets = res;
    },

    updateFollowing(state, following) {
      state.following = new Set([...following]);
    },

    updateMultifeeds(state, multifeeds) {
      state.multifeeds = multifeeds;
    },

    async refreshMultifeeds(state) {
      console.log("REFRESHING MULTIFEEDS");
      const url = `/api/multifeed/user?author=${state.id}`;
      const res = await fetch(url).then(async (r) => r.json());
      state.multifeeds = res;
    },

    updateActiveMultifeed(state, multifeed) {
      state.activeMultifeed = multifeed;
    },

    updateFilteredContent(state, content) {
      if (!content) {
        state.filteredContent = new Set([]);
      } else {
        state.filteredContent = new Set([...content]);
      }
    },

    updateEditingMultifeed(state, index) {
      state.editingMultifeed = index;
    },

    updateUsers(state, users) {
      state.users = users;
      state.users.splice(state.users.indexOf(state.username), 1);
    },

    updateUserMap(state, userMap) {
      state.userMap = userMap;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()],
});

export default store;
