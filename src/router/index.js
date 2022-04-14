import { createRouter, createWebHistory } from "vue-router";
import ArticlesView from "../views/ArticlesView.vue";
import ArticleView from "../views/ArticleView.vue";
import ReviewsView from "../views/ReviewsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/articles",
      name: "ArticlesView",
      component: ArticlesView,
    },
    {
      path: "/articles/:id",
      name: "ArticleView",
      component: ArticleView,
      props: true,
    },
    {
      path: "/reviews",
      name: "ReviewsView",
      component: ReviewsView,
    },
  ],
});

export default router;
