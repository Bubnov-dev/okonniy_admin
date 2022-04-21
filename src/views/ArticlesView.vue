<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="wrap">
    <div class="hstack mb-4 justify-content-between">
      <h3 class="h3">Статьи</h3>
      <router-link to="/panelAdmin/articles/new" class="btn btn-primary"
        >Новая запись</router-link
      >
    </div>
    <div class="row g-5">
      <div v-for="article in articles" :key="article" class="col-md-4">
        <div class="border rounded bg-light p-3">
          <h4 class="h4">{{ article.title }}</h4>
          <div class="desc mb-2">
            {{ article.description }}
          </div>
          <router-link
            :to="'/panelAdmin/articles/' + article.id"
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
      articles: [],
      page: 1,
      last_page: 1,
    };
  },
  inject: ["host"],
  mounted: function () {
    axios({
      method: "post",
      url: this.host + "/admin/articles/get",
      data: {},
    }).then((msg) => {
      this.articles = msg.data.data;
      this.last_page = msg.data.last_page;
    });
  },

  methods: {
    showMore: function () {
      axios({
        method: "post",
        url: this.host + "/admin/articles/get?page=" + ++this.page,
        data: {},
      }).then((msg) => {
        console.log(this.articles);
        console.log(msg.data.data);
        this.articles = this.articles.concat(msg.data.data);
      });
    },

    delete_article(id) {
      axios({
        method: "post",
        url: this.host + "/admin/articles/delete",
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
