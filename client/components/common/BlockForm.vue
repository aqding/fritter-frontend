<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <h3>{{ title }}</h3>
    <article v-if="fields.length">
      <div v-for="field in fields" :key="field.id">
        <label :for="field.id">{{ field.label }}:</label>
        <input
          :type="field.id === 'password' ? 'password' : 'text'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
      </div>
    </article>
    <article v-else>
      <p>
        <i>{{ content }}</i>
      </p>
    </article>
    <button class="red" v-if="!fields.length" type="submit">Confirm</button>
    <button v-else type="submit">Confirm</button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>
export default {
  name: "BlockForm",
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: "", // Url to submit form to
      method: "GET", // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      refreshFreets: false, // Whether or not stored freets should be updated after form submission
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null, // Function to run after successful form submission
    };
  },
  methods: {
    async submit() {
      /**
       * Submits a form with the specified options from data().
       */
      const options = {
        method: this.method,
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
      };
      if (this.hasBody) {
        options.body = JSON.stringify(
          Object.fromEntries(
            this.fields.map((field) => {
              const { id, value } = field;
              field.value = "";
              return [id, value];
            })
          )
        );
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.setUsername) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : { user: null };
          this.$store.commit(
            "setUsername",
            res.user ? res.user.username : null
          );
          this.$store.commit("setId", res.user ? res.user._id : null);
        }

        if (this.refreshFreets) {
          this.$store.commit("refreshFreets");
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, "error");
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
form {
  border: 1px solid #111;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

input {
  background-color: rgb(30, 30, 30);
  border: 1px solid;
  border-color: rgb(118, 118, 118);
  border-radius: 10px;
  height: 40px;
  font-size: 16px;
  padding: 8px;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
  width: 20%;
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
