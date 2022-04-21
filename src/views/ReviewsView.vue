<template>
  <div class="wrap">
    <div class="hstack mb-4 justify-content-between">
      <h3 class="h3">Отзывы</h3>
      <router-link to="/panelAdmin/reviews/new" class="btn btn-primary"
        >Новая запись</router-link
      >
    </div>
    <div class="row g-5">
      <div v-for="review in reviews" :key="review" class="col-md-4">
        <div class="border rounded bg-light p-3">
          <h4 class="h4">{{ review.title }}</h4>
          <ul class="desc mb-2">
            <li>имя: {{ review.name }}</li>
            <li>город: {{ review.city }}</li>
          </ul>
          <router-link
            :to="'/panelAdmin/reviews/' + review.id"
            class="btn btn-primary"
            >Редактировать</router-link
          >
        </div>
      </div>
    </div>

    <div v-if="page < last_page" @click="showMore" class="btn btn-primary">
      Показать еще
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      reviews: [],
      page: 1,
      last_page: 1,
    };
  },
  inject: ["host"],
  mounted: function () {
    axios({
      method: "post",
      url: this.host + "/admin/reviews/get",
      data: {},
    }).then((msg) => {
      this.reviews = msg.data.data;
      this.last_page = msg.data.last_page;
    });
  },

  methods: {
    showMore: function () {
      axios({
        method: "post",
        url: this.host + "/admin/reviews/get?page=" + ++this.page,
        data: {},
      }).then((msg) => {
        console.log(this.reviews);
        console.log(msg.data.data);
        this.reviews = this.reviews.concat(msg.data.data);
      });
    },

    delete_review(id) {
      axios({
        method: "post",
        url: this.host + "/admin/reviews/delete",
        data: {
          id: id,
        },
      }).then((msg) => {
        console.log(msg);
        this.$forceUpdate();
      });
    },
  },
};
</script>
