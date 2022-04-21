<script setup>
import SpinnerPart from "./parts/SpinnerPart.vue";
</script>

<template>
  <div class="wrap">
    <div class="hstack mb-4 justify-content-between">
      <h3 class="h3">Отзыв</h3>
      <div class="btn btn-secondary" @click="deletereview">Удалить</div>
    </div>
    <div class="review-edit vstack gap-4">
      <input
        type="text"
        placeholder="title"
        v-model="title"
        class="form-control"
      />
      <input
        type="text"
        placeholder="name"
        v-model="name"
        class="form-control"
      />
      <input
        type="text"
        placeholder="city"
        v-model="city"
        class="form-control"
      />
      <input
        type="date"
        placeholder="date"
        v-model="date"
        class="form-control"
      />

      <editor
        v-model="content"
        api-key="660vq0feuhjyub7s7o01nh9an48e4eq55ucbneldw55cr22l"
        :init="editorInit"
      />

      <label class="hstack gap-2"
        >Опубликовано:
        <input type="checkbox" class="form-check" v-model="isPublished" />
      </label>

      Изображения
      <div class="row image-row">
        <div
          class="col-md-2"
          v-for="(image, index) in images"
          :key="image"
          @click="images.splice(index, 1)"
        >
          <div class="image-wrapper">
            <img :src="image" alt="" />
          </div>
        </div>
      </div>
      <label for="">
        <div class="row">
          <div class="col-md-10">
            <input
              class="form-control"
              type="file"
              @change="onFileChange"
              multiple
            />
          </div>
        </div>
      </label>

      <div class="row g-5 mt-5 btn-group">
        <div class="col-md-6">
          <div
            class="btn btn-primary"
            @click="savereview"
            :disabled="saving == true"
          >
            <spinner-part :class="{ 'op-0': !saving }" /> Сохранить
          </div>
        </div>
        <div class="col-md-6">
          <div class="btn btn-secondary" @click="deletereview">Удалить</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
import axios from "axios";

export default {
  components: { editor: Editor },
  inject: ["host"],

  props: {
    reviewId: [Number, String],
  },
  data() {
    return {
      title: "",
      name: "",
      content: "",
      images: [],
      files: [],
      city: "",
      date: "",
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
        file_picker_callback: function (callback, value, meta) {
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
                document
                  .querySelector(".tox-control-wrap .tox-textfield")
                  .value = response.data;
              });
            };
            reader.readAsDataURL(file);
          };

          input.click();
        },
      },
    };
  },

  mounted: function () {
    console.log(this.globalVariable);
    console.log(this.reviewId);
    if (this.reviewId != "new") {
      axios({
        method: "post",
        url: this.host + "/admin/reviews/show",
        data: {
          id: this.reviewId,
        },
      }).then((msg) => {
        console.log(msg);
        this.title = msg.data.title;
        this.name = msg.data.name;
        this.content = msg.data.content;
        this.images = msg.data.images;
        this.city = msg.data.city;
        this.date = msg.data.date;
        console.log(msg.data.isPublished == 1);
        console.log(msg.data.isPublished);
        this.isPublished = msg.data.isPublished == 1;
      });
    }
  },

  methods: {
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.files = files;
      this.files = [];
      for (let i = 0; i < files.length; i++) {
        this.files.push(files[i]);
      }
    },
    savereview: function () {
      if (this.saving) return;

      console.log("saving");
      this.saving = true;
      if (this.files.length > 0) {
        console.log("files");
        console.log(this.files);
        console.log(this.files == []);
        this.files.forEach((file) => {
          let fd = new FormData();
          fd.append("file", file);

          axios({
            method: "post",
            url: this.host + "/admin/uploadFile",
            data: fd,
          }).then((response) => {
            console.log(response);
            this.images.push(response.data);
            this.real_save_review();
          });
        });
      } else {
        console.log("no files");
        this.real_save_review();
      }
    },

    real_save_review: function () {
      let data = {
        title: this.title,
        name: this.name,
        content: this.content,
        images: JSON.stringify(this.images),
        city: this.city,
        date: this.date,
        isPublished: this.isPublished,
      };

      let method = "create";
      if (this.reviewId != "new") {
        data.id = this.reviewId;
        method = "update";
      }
      axios({
        method: "post",
        url: this.host + "/admin/reviews/" + method,
        data: data,
      }).then((msg) => {
        console.log(msg);
        this.saving = false;
        this.$router.push("/panelAdmin/reviews");
      });
    },

    deletereview: function () {
      if (this.reviewId != "new") {
        axios({
          method: "post",
          url: this.host + "/admin/reviews/delete",
          data: {
            id: this.reviewId,
          },
        }).then((msg) => {
          console.log(msg);
          this.$router.push("/panelAdmin/reviews");
        });
      } else {
        this.$router.push("/panelAdmin/reviews");
      }
    },
  },
};
</script>
