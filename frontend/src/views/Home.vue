<template>
  <div class="home text-left">
    <h1>Experimental Progress</h1>
    <h2 class="">Choose the form to fill in:</h2>

    <div class="scrolling-container">
      <div
        ref="formSwiper"
        class="scrolling-wrapper-flexbox flex flex-nowrap overflow-auto form-swiper border-t border-b border-gray-200 w-full py-2 my-4"
      >
        <div
          v-for="(cardData, indx) in allForms"
          :key="indx"
          class="form-card-outer flex-grow-0 flex-shrink-0 w-full md:w-3/5 lg:w-3/5 xl:w-2/5 p-0 m-0"
        >
          <form-card
            :card-data="cardData"
            :websocket="websocket"
            :slide-number="indx"
            :form-parameters="formParameters"
          />
        </div>
      </div>

      <div class="scroll scroll-left" @click="scroll(-320)">&lt;</div>
      <div class="scroll scroll-right" @click="scroll(320)">&gt;</div>
    </div>

    <button class="mr-2 mb-2" @click="requestAllForms()" type="button">
      Refresh forms
    </button>
  </div>
</template>

<script>
import FormCard from '@/components/FormCard.vue';

export default {
  name: 'Home',

  components: {
    FormCard,
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
    },

    scroll(amount) {
      console.log('HERE L'); // eslint-disable-line no-console
      const elem = document.querySelector('.scrolling-wrapper-flexbox');
      if (elem.scrollTo) {
        elem.scrollTo({
          top: 0,
          left: elem.scrollLeft + amount,
          behavior: 'smooth',
        });
      } else {
        elem.scrollLeft += amount;
      }
    },
  },
};
</script>

<style>
.scrolling-container {
  position: relative;
}
/* Little adjustments for our horizontal slider */
.scrolling-wrapper-flexbox {
  position: relative;
  -webkit-overflow-scrolling: touch;
}
.scrolling-wrapper-flexbox::-webkit-scrollbar {
  display: none;
}

.form-card-outer {
  position: relative;
}

.scroll {
  position: absolute;
  height: 32px;
  width: 32px;
  top: calc(50% - 16px);
  font-size: 22px;
  opacity: 0.5;
  border-radius: 100%;
  color: white;
  background-color: rgba(128, 128, 128, 0.8);
  text-align: center;
  cursor: pointer;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
}
.scroll:hover {
  opacity: 0.8;
}
.scroll-left {
  left: -12px;
}
.scroll-right {
  right: -12px;
}
</style>
