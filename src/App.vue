<script setup>
import { RouterLink, RouterView } from "vue-router";
// import { inject } from "vue";
</script>

<template>
  <body class="bg-light">
    <main>
      <div class="row">
        <div class="col-md-2 p-5 pt-5 vstack gap-3 bg-secondary">
          <!-- {{ $host }} -->
          <router-link class="text-light" to="/articles">Статьи</router-link>
          <router-link class="text-light" to="/reviews">Отзывы</router-link>
        </div>
        <div class="col-md-10 mt-5 py-3 px-5">
          <div class="container">
            <RouterView />
          </div>
        </div>
      </div>
    </main>
  </body>
</template>

<style>
@import "@/assets/style.css";
@import "@/assets/libcss/bootstrap.min.css";
</style>

<script>
export default {
  provide: {
    globalVariable: 123,
  },
  data() {
    return {
      abc: "12",
    };
  },
  // inject: ["globalVariable"],

  // mounted: function () {
  //   let globalVar = inject("globalVariable");
  //   console.log(globalVar);
  // },
};
</script>
