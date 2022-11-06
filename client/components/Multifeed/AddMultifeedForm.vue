<script>
import MultifeedComponent from "@/components/Multifeed/MultifeedComponent.vue";

export default {
  name: "EditMultifeedForm",
  mixins: [MultifeedComponent],
  data() {
    return {
      name: "",
      content: [],
      method: "POST",
    };
  },
};
</script>
