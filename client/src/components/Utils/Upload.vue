<template>
  <div>
    <h1>Upload Material:</h1>
    <form enctype="multipart/form-data" novalidate>
      <div class="dropbox">
        <input
          type="file"
          multiple
          :name="uploadFieldName"
          :disabled="isSaving"
          @change="
            filesChange($event.target.name, $event.target.files);
            fileCount = $event.target.files.length;
          "
          accept="image/*"
          class="input-file"
        />
        <p v-if="isInitial">
          Drag your file(s) here to begin<br />
          or click to browse
        </p>
        <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
        <p v-if="isSuccess">
          Upload Successful.
        </p>
      </div>
    </form>
    <ul class="pictures">
      <li v-for="picture in pictures" v-bind:key="picture.id">
        <img
          style="margin-bottom:5px;"
          :src="BASE_URL + picture.name"
          alt="picture image"
        />
        <br />
        <button v-on:click.prevent="delFile(picture)">Delete</button>
      </li>
    </ul>
    <div class="clearfix"></div>
  </div>
</template>

<script>
import UploadService from "@/services/UploadService";
const STATUS_INITAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;
export default {
  data() {
    return {
      BASE_URL: "http://localhost:8081/assets/uploads/",
      error: null,
      //uploadedFiles:[]
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "userPhoto",
      uploadedFileNames: [],
      pictures: [],
      pictureIndex: 0
    };
  },
  methods: {
    async delFile(material) {
      let result = confirm("want to delete?");
      if (result) {
        let dataJSON = {
          fileName: material.name
        };
        await UploadService.delete(dataJSON);

        for (let i = 0; i < this.pictures.length; i++) {
          if (this.pictures[i].id === material.id) {
            this.pictures.splice(i, 1);
            this.materalIndex--;
            break;
          }
        }
      }
    },
    navigateTo(route) {
      console.log(route);
      this.$router.push(route);
    },
    wait(ms) {
      return x => {
        return new Promise(resolve => setTimeout(() => resolve(x), ms));
      };
    },
    reset() {
      //reset form to inital state
      this.currentStatus = STATUS_INITAL;
      //this.uploadedFiles = []
      this.uploadError = null;
      this.uploadedFileNames = [];
    },
    async save(formData) {
      try {
        this.currentStatus = STATUS_SAVING;
        await UploadService.upload(formData);
        this.currentStatus = STATUS_SUCCESS;
        // update image uploaded display
        let pictureJSON = [];
        this.uploadedFileNames.forEach(uploadFileName => {
          let found = false;
          for (let i = 0; i < this.pictures.length; i++) {
            if (this.pictures[i].name == uploadFileName) {
              found = true;
              break;
            }
          }
          if (!found) {
            this.pictureIndex++;
            let pictureJSON = {
              id: this.pictureIndex,
              name: uploadFileName
            };
            this.pictures.push(pictureJSON);
          }
        });
        this.clearUploadResult();
      } catch (err) {
        console.log(err);
        this.currentStatus = STATUS_FAILED;
      }
    },
    filesChange(fieldName, fileList) {
      //handle file changes
      const formData = new FormData();
      if (!fileList.length) return;

      //append the files to FormData
      Array.from(Array(fileList.length).keys()).map(x => {
        formData.append(fieldName, fileList[x], fileList[x].name);
        this.uploadedFileNames.push(fileList[x].name);
      });
      //save it
      this.save(formData);
    },
    clearUploadResult: function() {
      setTimeout(() => this.reset(), 5000);
    }
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    }
  },
  created() {
    this.reset();
  }
};
</script>

<style scoped>
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lemonchiffon;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}
.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}
.dropbox:hover {
  background: khaki; /* when mouse over to the drop zone, change color */
}
.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
ul.pictures {
  list-style: none;
  padding: 0;
  margin: 0;
  float: left;
  padding-top: 10px;
  padding-bottom: 10px;
}

ul.pictures li {
  float: left;
}

ul.pictures li img {
  max-width: 180px;
  margin-right: 20px;
}

.clearfix {
  clear: both;
}
</style>