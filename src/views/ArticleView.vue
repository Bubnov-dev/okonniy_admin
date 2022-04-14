<template>
  <div class="wrap">
    <div class="hstack mb-4 justify-content-between">
      <h3 class="h3">Редактирование статьи</h3>
      <div class="btn btn-primary">Удалить</div>
    </div>
    <div class="article-edit vstack gap-4">
      <input type="text" placeholder="title" class="form-control" />
      <textarea
        name=""
        id=""
        cols="30"
        rows="3"
        placeholder="description"
        class="form-control"
      ></textarea>

      <textarea
        name=""
        id=""
        cols="30"
        rows="5"
        placeholder="content"
        class="form-control"
      ></textarea>

      <editor
        api-key="660vq0feuhjyub7s7o01nh9an48e4eq55ucbneldw55cr22l"
        :init="editorInit"
      />

      <label class="hstack gap-2"
        >Опубликовано:
        <input type="checkbox" class="form-check" />
      </label>
    </div>
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
import axios from "axios";
import { $ } from "jquery";

export default {
  components: { editor: Editor },
  inject: ["globalVariable"],

  data() {
    return {
      title: "",

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
        // image_dimensions: false,
        file_picker_callback: function (callback, value, meta) {
          $(".tox-lock.tox-button").click();
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
              axios({
                method: "post",
                url: "http://65.21.185.61/time-tracking/images/upload",
                headers: {
                  Authorization:
                    "Token " +
                    (localStorage.getItem("auth_token") ||
                      sessionStorage.getItem("auth_token")),
                  "X-CSRFToken": $('[name="csrfmiddlewaretoken"]').attr(
                    "value"
                  ),
                },
                data: fd,
              }).then((response) => {
                console.log(response.data.data);
                $(".tox-control-wrap .tox-textfield").val(response.data.data);
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
  },
};
</script>
