<template>
  <div class="home text-left">
    <h1>Experimental Progress</h1>
    <h2 class="">Choose the form to fill in:</h2>

    <touch-scroll-swiper ref="ts-swiper">
      <form-card
        v-for="(cardData, indx) in allForms"
        :key="indx"
        class="swiper-card flex-grow-0 flex-shrink-0 w-full md:w-3/5 lg:w-3/5 xl:w-2/5"
        :card-data="cardData"
        :websocket="websocket"
        :slide-number="indx"
        :form-parameters="formParameters"
      />
    </touch-scroll-swiper>

    <button class="mr-2 mb-2" @click="requestAllForms()" type="button">
      Refresh forms
    </button>
  </div>
</template>

<script>
import FormCard from '@/components/FormCard.vue';
import TouchScrollSwiper from '../components/TouchScrollSwiper.vue';

export default {
  name: 'Home',

  components: {
    FormCard,
    TouchScrollSwiper,
  },

  /**
   * Data for this view to use.
   */
  data() {
    return {
      input: '',
      allForms: [],
      formParameters: [],
      websocket: null,
    };
  },

  mounted() {
    /**
     * As soon as this view has loaded, start to listen on the WebSocket.
     */
    this.startWebSocketListener();
  },

  methods: {
    /**
     * Start the WebSocket here in the client. Listen for messages
     * and respond appropriately, using methods below.
     */
    startWebSocketListener() {
      this.websocket = new WebSocket('ws://localhost:8088/forms');
      const innerthis = this;

      // Connected
      innerthis.websocket.onopen = () => {
        this.requestAllForms();
      };

      // Message
      innerthis.websocket.onmessage = evt => {
        // console.log('-- Message event:', evt); // eslint-disable-line no-console
        const response = JSON.parse(evt.data);
        // console.log('   message =', response); // eslint-disable-line no-console
        // console.log('   method =', response.method); // eslint-disable-line no-console

        // Message handlers
        if (response.method === 'get_form_names') {
          // All forms
          // TODO - check status and act on error
          const allFormsResponse = JSON.parse(response.data);
          this.showAllForms(allFormsResponse);
        } else if (response.method === 'get_form_specs') {
          // A given form
          // TODO - check status and act on error
          this.formParameters = response.data.parameters;
        } else if (response.method === 'submit_form') {
          // Submit a form
          // TODO - check all went well with the form submission
        }
      };
    },

    /**
     * Ask the backend for the outline details about each form.
     */
    requestAllForms() {
      this.websocket.send(
        JSON.stringify({
          method: 'get_form_names',
          params: {},
        })
      );
    },

    /**
     * Once the data has come back from the backend, send it to the view to show all forms.
     */
    showAllForms(allFormsResponse) {
      this.allForms = [];
      allFormsResponse.forEach(f => {
        this.allForms.push({
          name: f.name,
          label: f.label,
          description: f.description,
        });
      });

      const innerthis = this;
      this.$nextTick(() => {
        innerthis.$refs['ts-swiper'].recheckSlides();
      });
    },
  },
};
</script>
