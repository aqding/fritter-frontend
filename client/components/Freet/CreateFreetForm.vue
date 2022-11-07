<template>
  <form @submit.prevent="submit">
    <article v-if="fields.length">
      <div v-for="field in fields" :key="field.id">
        <textarea
          placeholder="What's on your mind?"
          v-if="field.id === 'content'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <div class="buttonContainer"><button type="submit">Freet</button></div>

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
  name: "CreateFreetForm",
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
  data() {
    return {
      url: "/api/freets",
      method: "POST",
      hasBody: true,
      fields: [{ id: "content", label: "Content", value: "" }],
      title: "What's on your mind?",
      refreshFreets: true,
      callback: () => {
        const message = "Successfully created a freet!";
        this.$set(this.alerts, message, "success");
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
};
</script>

<style scoped>
form {
  border: 1px solid #111;
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

form h3 {
  margin-top: 0;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 8rem;
  border-radius: 20px;
  padding: 10px;
  resize: none;
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
.buttonContainer {
  display: flex;
  justify-content: right;
  padding-top: 1rem;
}
</style>
