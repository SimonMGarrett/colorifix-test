<template>
  <div
    :id="`form-card-${slideNumber}`"
    class="form-card self-start border border-gray-100 rounded shadow-lg cursor-pointer p-4 mx-4"
    :data-slider-card-indx="slideNumber"
    @click="requestGivenForm()"
  >
    <div class="form-card__form-id text-gray-300 p-0 m-0">
      <strong>Form ID:</strong> {{ cardData.name.trim() }}
    </div>

    <h3 class="form-card__form-name text-gray-800 p-0 no-top">
      {{ cardData.label }}
      <input
        type="radio"
        name="form_headers"
        :value="cardData.label"
        style="transform: scale(2)"
        class="ml-2"
      />
    </h3>

    <div
      class="form-card__form-description text-gray-700 py-4 border-b border-gray-200"
    >
      <strong>Description:</strong>
      <div>{{ cardData.description }}</div>
    </div>

    <form
      class="form-card__form bg-gray-50 border border-gray-100 py-4"
      :ref="cardData.name.trim()"
      @submit.prevent="submitForm($event, cardData.name.trim())"
    >
      <div v-for="(paramSet, psIndx) in formParameters" :key="psIndx">
        <!-- String -->
        <div
          v-if="paramSet.type === 'string'"
          class="w-full mb-2 flex justify-start content-center"
        >
          <label class="w-2/5" :for="`form-element-id-${psIndx}`">{{
            paramSet.label
          }}</label>
          <input
            class="w-2/5 ml-2"
            :name="paramSet.name"
            type="text"
            :required="paramSet.required === 'true'"
          />
        </div>
        <!-- Number -->
        <div
          v-else-if="paramSet.type === 'number'"
          class="w-full mb-2 flex justify-start content-center"
        >
          <label class="w-2/5" :for="`form-element-id-${psIndx}`">{{
            paramSet.label
          }}</label>
          <input
            class="w-2/5 ml-2"
            :name="paramSet.name"
            type="number"
            :required="paramSet.required === 'true'"
          />
        </div>
        <!-- Bool/Checkbox -->
        <div
          v-else-if="paramSet.type === 'bool'"
          class="w-full mb-2 flex justify-start content-center"
        >
          <label class="w-2/5" :for="`form-element-id-${psIndx}`">
            {{ paramSet.label }}
          </label>
          <div class="checkbox-wrapper w-2/5 pt-2">
            <input
              class="p-0 ml-2"
              style="line-height: 24px;"
              :name="paramSet.name"
              type="checkbox"
              :required="paramSet.required === 'true'"
            />
          </div>
        </div>
        <!-- Select -->
        <div
          v-else-if="paramSet.type === 'select'"
          class="w-full mb-2 flex justify-start content-center"
        >
          <label class="w-2/5" :for="`form-element-id-${psIndx}`">{{
            paramSet.label
          }}</label>
          <select
            class="w-2/5 ml-2"
            :name="paramSet.name"
            :required="paramSet.required === 'true'"
          >
            <option
              v-for="(option, optionIndx) in paramSet.options"
              :key="optionIndx"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex ">
        <div class="lhs w-2/5"></div>
        <button data-cy="submit-form" class="w-2/5 ml-2">Submit form</button>
      </div>

      <div class="hidden">
        {{ formParameters }}
      </div>
    </form>
  </div>
</template>

<script>
import $ from 'cash-dom'; // mini version of jQuery

export default {
  name: 'FormCard',

  props: {
    cardData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    websocket: {
      type: WebSocket,
      default: () => {
        return {};
      },
    },
    slideNumber: {
      type: Number,
      default: -1,
    },
    formParameters: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  methods: {
    /**
     * Request the parameters from which to build this form.
     */
    requestGivenForm() {
      // Hide all forms
      $('.form-card__form').each((indx, elem) => {
        $(elem).removeClass('active');
      });

      // Request data for for
      this.websocket.send(
        JSON.stringify({
          method: 'get_form_specs',
          params: { form_name: this.cardData.name },
        })
      );

      this.showForm();
    },

    /**
     * Show only this form (the view will construct it from it's parameters).
     */
    showForm() {
      // Chosen form is is exact component instance
      const chosenForm = this.$el.querySelector('.form-card__form');

      // Show only this form
      chosenForm.classList.add('active');

      // Set radio button
      const radioElem = $(chosenForm)
        .parent()
        .find('h3 > input')[0];
      radioElem.checked = true;
    },

    /**
     * Submit the data from the form to the backend.
     */
    submitForm(evt, formName) {
      const form = evt.target;
      const fd = new FormData(form);
      const data = Array.from(fd);

      const objectify = array => {
        return array.reduce(function(p, c) {
          p[c[0]] = c[1];
          return p;
        }, {});
      };

      this.websocket.send(
        JSON.stringify({
          method: 'submit_form',
          name: formName,
          params: { form_data: objectify(data) },
        })
      );

      const chosenForm = this.$el.querySelector('.form-card__form');
      chosenForm.innerHTML = '<div class="px-8 font-bold">THANK YOU!</div>';
      setTimeout(() => {
        location.reload();
      }, 3000);
    },

    // noop() {
    //   return true;
    // },
  },
};
</script>

<style>
.form-card {
  transform: scale(1, 1);
  transition: transform 0.3s ease-in-out;
}
.form-card:hover {
  transform: scale(1.04, 1.04);
}

.form-card__form {
  opacity: 0;
  transform: scale(1, 0);
  max-height: 0;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  overflow: hidden;
}
.form-card__form.active {
  opacity: 1;
  transform: scale(1, 1);
  max-height: 500px;
}
</style>
