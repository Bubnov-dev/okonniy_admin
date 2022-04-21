import { createRouter, createWebHistory } from "vue-router";
import ArticlesView from "../views/ArticlesView.vue";
import ArticleView from "../views/ArticleView.vue";
import ReviewsView from "../views/ReviewsView.vue";
import ReviewView from "../views/ReviewView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/panelAdmin/articles",
      name: "ArticlesView",
      component: ArticlesView,
    },
    {
      path: "/panelAdmin/articles/:articleId",
      name: "ArticleView",
      component: ArticleView,
      props: true,
    },
    {
      path: "/panelAdmin/reviews",
      name: "ReviewsView",
      component: ReviewsView,
    },
    {
      path: "/panelAdmin/reviews/:reviewId",
      name: "review",
      component: ReviewView,
      props: true,
    },
  ],
});

export default router;
