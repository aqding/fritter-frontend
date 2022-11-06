<script>
import MultifeedComponent from "@/components/Multifeed/MultifeedComponent.vue";

export default {
  name: "EditMultifeedForm",
  mixins: [MultifeedComponent],
  data() {
    return {
      name: this.multifeed.name,
      content: this.multifeed.content,
      method: "PUT",
      creating: false,
    };
  },
};
</script>
