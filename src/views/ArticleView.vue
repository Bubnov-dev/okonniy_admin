<script setup>
import SpinnerPart from "../views/parts/SpinnerPart.vue";
</script>

<template>
  <div class="wrap">
    <div class="hstack mb-4 justify-content-between">
      <h3 class="h3">Статья</h3>
      <div class="btn btn-secondary" @click="deleteArticle">Удалить</div>
    </div>
    <div class="article-edit vstack gap-4">
      <input
        type="text"
        placeholder="title"
        v-model="title"
        class="form-control"
      />
      <textarea
        v-model="description"
        name=""
        id=""
        cols="30"
        rows="3"
        placeholder="description"
        class="form-control"
      ></textarea>

      <textarea
        v-model="meta_description"
        name=""
        id=""
        cols="30"
        rows="3"
        placeholder="meta description"
        class="form-control"
      ></textarea>

      <editor
        v-model="content"
        api-key="660vq0feuhjyub7s7o01nh9an48e4eq55ucbneldw55cr22l"
        :init="editorInit"
      />

      <label class="hstack gap-2"
        >Опубликовано:
        <input type="checkbox" class="form-check" v-model="isPublished" />
      </label>

      <label for="">
        Главное изображение
        <div class="row">
          <img :src="main_img" class="col-md-2" alt="" />
          <div class="col-md-10">
            <input class="form-control" type="file" @change="onFileChange" />
          </div>
        </div>
      </label>

      <div class="row g-5 btn-group">
        <div class="col-md-6">
          <div
            class="btn btn-primary"
            @click="saveArticle"
            :disabled="saving == false"
          >
            <spinner-part :class="{ 'op-0': !saving }" /> Сохранить
          </div>
        </div>
        <div class="col-md-6">
          <div class="btn btn-secondary" @click="deleteArticle">Удалить</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
import axios from "axios";
// import { $ } from "jquery";

export default {
  components: { editor: Editor },
  inject: ["host"],

  props: {
    articleId: [Number, String],
  },
  data() {
    return {
      title: "",
      description: "",
      meta_description: "",
      content: "",
      file: null,
      main_img: "",
      isPublished: false,
      saving: false,
      editorInit: {
        height: 500,
        menubar: false,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount",
        ],
        toolbar:
          "undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | image | removeformat | help",
        file_picker_types: "image",
        relative_urls: false,
        image_prepend_url: this.$hostname,
        images_upload_base_path: this.$hostname,
        image_description: false,
        file_picker_callback: (callback, value, meta) => {
          this.file_picker(callback, value, meta);
        },
      },
    };
  },

  mounted: function () {
    console.log(this.globalVariable);
    console.log(this.articleId);
    if (this.articleId != "new") {
      axios({
        method: "post",
        url: this.host + "/admin/articles/show",
        data: {
          id: this.articleId,
        },
      }).then((msg) => {
        console.log(msg);
        this.title = msg.data.title;
        this.description = msg.data.description;
        this.meta_description = msg.data.meta_description;
        this.content = msg.data.content;
        this.main_img = msg.data.main_img;
        this.isPublished = msg.data.isPublished;
      });
    }
  },

  methods: {
    file_picker(callback, value, meta) {
      console.log(document.getElementsByClassName("tox-lock tox-button"));
      document.getElementsByClassName("tox-lock tox-button")[0].click();
      console.log(callback);
      console.log(value);
      console.log(meta);
      var input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.onchange = function () {
        var file = this.files[0];
        console.log(file);
        var reader = new FileReader();
        reader.onload = function () {
          // чтение файла в formData
          let fd = new FormData();
          if (file !== null) {
            fd.append("file", file);
          }
          var host = window.location.origin;
          axios({
            method: "post",
            url: host + "/admin/uploadFile",

            data: fd,
          }).then((response) => {
            console.log(response.data.data);
            document.querySelector(".tox-control-wrap .tox-textfield").value =
              response.data;
          });
        };
        reader.readAsDataURL(file);
      };

      input.click();
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.file = files[0];
    },
    saveArticle: function () {
      if (this.saving) return;
      this.saving = true;
      let fd = new FormData();
      let file = this.file;
      if (file !== null) {
        fd.append("file", file);
      } else {
        if (this.main_img != "") {
          this.real_save_article();
          return;
        } else {
          alert("Загрузите изображение");
          this.saving = false;
          return;
        }
      }
      axios({
        method: "post",
        url: this.host + "/admin/uploadFile",
        data: fd,
      }).then((response) => {
        console.log(response);
        this.main_img = response.data;
        this.real_save_article();
      });
    },

    real_save_article: function () {
      let data = {
        title: this.title,
        description: this.description,
        meta_description: this.meta_description,
        content: this.content,
        main_img: this.main_img,
        isPublished: this.isPublished,
      };

      console.log(data);
      console.log(this.title);

      let method = "create";
      if (this.articleId != "new") {
        data.id = this.articleId;
        method = "update";
      }
      axios({
        method: "post",
        url: this.host + "/admin/articles/" + method,
        data: data,
      }).then((msg) => {
        console.log(msg);
        this.saving = false;
        this.$router.push("/panelAdmin/articles");
      });
    },

    deleteArticle: function () {
      if (this.articleId != "new") {
        axios({
          method: "post",
          url: this.host + "/admin/articles/delete",
          data: {
            id: this.articleId,
          },
        }).then((msg) => {
          console.log(msg);
          this.$router.push("/panelAdmin/articles");
        });
      } else {
        this.$router.push("/panelAdmin/articles");
      }
    },
  },
};
</script>
