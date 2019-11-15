<template>
  <div class="container">
    <div class="blog-header">
      <h2>ส่วนจัดการบล็อก</h2>
      <div>
        <form class="form-inline form-search">
          <div class="form-group">
            <div class="input-group">
              <input
                type="text"
                v-model="search"
                class="form-control"
                id="exampleInputAmount"
                placeholder="Search"
              />
              <div class="input-group-addon"><i class="fas fasearch"></i></div>
            </div>
          </div>
        </form>
      </div>
      <div class="create-blog">
        <button
          class="btn btn-success btn-sm"
          v-on:click="navigateTo('/blog/create')"
        >
          Create blog
        </button>
        <strong> จาํนวน blog: </strong> {{ results.length }}
      </div>
      <ul class="categories">
        <li v-for="cate in category" v-bind:key="cate.index">
          <a v-on:click.prevent="setCategory(cate)" href="#">{{ cate }}</a>
        </li>
        <li class="clear">
          <a v-on:click.prevent="setCategory(' ')" href="#">Clear</a>
        </li>
      </ul>
      <div class="clearfix"></div>
    </div>
    <transition-group name="fade">
      <div v-for="blog in blogs" v-bind:key="blog.id" class="blog-list">
        <!-- <p>id: {{ blog.id }}</p> -->
        <div class="blog-pic">
          <!-- <transition name="fade"> -->
          <div class="thumbnail-pic" v-if="blog.thumbnail != 'null'">
            <img :src="BASE_URL + blog.thumbnail" alt="thumbnail" />
          </div>
          <!-- </transition>   -->
        </div>
        <h3>{{ blog.title }}</h3>
        <div v-html="blog.content.slice(0, 200) + '...'"></div>
        <div class="blog-info">
          <p><strong>Category:</strong> {{ blog.category }}</p>
          <p><strong>Create:</strong> {{ blog.createdAt }}</p>
          <!-- <p>status: {{ blog.status }}</p> -->
          <p>
            <button
              class="btn btn-sm btn-info"
              v-on:click="navigateTo('/blog/' + blog.id)"
            >
              View Blog
            </button>
            <button
              class="btn btn-sm btn-warning"
              v-on:click="navigateTo('/blog/edit/' + blog.id)"
            >
              Edit blog
            </button>
            <button class="btn btn-sm btn-danger" v-on:click="deleteBlog(blog)">
              Delete
            </button>
          </p>
        </div>
        <div class="clearfix"></div>
      </div>
    </transition-group>
    <div v-if="blogs.length === 0 && loading === false" class="emptyblog">
      *** ไม่มีข้อมูล ***
    </div>
    <div id="blog-list-bottom">
      <div
        class="blog-load-finished"
        v-if="blogs.length === results.length && results.length > 0"
      >
        โหลดขอ้มูลครบแลว้
      </div>
    </div>
  </div>
</template> 

<script>
import BlogsService from "@/services/BlogsService";
import ScrollMonitor from "scrollmonitor";
import _ from "lodash";
let LOAD_NUM = 3;
let pageWatcher;
export default {
  watch: {
    search: _.debounce(async function(value) {
      const route = {
        name: "blogs"
      };
      if (this.search !== "") {
        route.query = {
          search: this.search
        };
      }
      console.log("search: " + this.search);
      this.$router.push(route);
    }, 700),
    "$route.query.search": {
      immediate: true,
      async handler(value) {
        this.blogs = [];
        this.results = [];
        this.loading = true;
        this.results = (await BlogsService.index(value)).data;
        this.appendResults();

        this.results.forEach(blog => {
          if (this.category.indexOf(blog.category) === -1) {
            this.category.push(blog.category);
          }
        });
        this.loading = false;
        this.search = value;
      }
    }
  },
  data() {
    return {
      BASE_URL: "http://localhost:8081/assets/uploads/",
      blogs: [],
      results: [],
      search: "",
      category: [],
      loading: false
    };
  },
  methods: {
    setCategory(keyword) {
      if (keyword === " ") {
        this.search = "";
        console.log("null");
      } else {
        this.search = keyword;
      }
    },
    appendResults: function() {
      if (this.blogs.length < this.results.length) {
        let toAppend = this.results.slice(
          this.blogs.length,
          LOAD_NUM + this.blogs.length
        );
        this.blogs = this.blogs.concat(toAppend);
      }
    },
    logout() {
      this.$store.dispatch("setToken", null);
      this.$store.dispatch("setBlog", null);
      this.$route.push({
        name: "login"
      });
    },
    navigateTo(route) {
      this.$router.push(route);
    },
    async deleteBlog(blog) {
      let result = confirm("Want to delete");
      if (result) {
        try {
          await BlogsService.delete(blog);
          this.refreshData();
        } catch (err) {
          console.log(err);
        }
      }
    },
    async refreshData() {
      this.blogs = (await BlogsService.index()).data;
    }
  },
  updated() {
    let sens = document.querySelector("#blog-list-bottom");
    pageWatcher = ScrollMonitor.create(sens);
    pageWatcher.enterViewport(this.appendResults);
  },
  beforeUpdate() {
    if (pageWatcher) {
      pageWatcher.destroy();
      pageWatcher = null;
    }
  }
};
</script>

<style scoped>
.categories {
  padding: 0;
  list-style: none;
  float: left;
}

.categories li {
  float: left;
  padding: 2px;
}

.categories li a {
  padding: 5px 10px 5px 10px;
  background: paleturquoise;
  color: black;
  text-decoration: none;
}

.categories li.clear a {
  background: tomato;
  color: white;
}
.empty-blog {
  width: 100%;
  text-align: center;
  padding: 10px;
  background: darksalmon;
  color: white;
}

/* thumbnail */
.thumbnail-pic img {
  width: 200px;
  padding: 5px 10px 0px 0px;
}

.blog-info {
  float: left;
}

.blog-pic {
  float: left;
}

.clearfix {
  clear: both;
}

.blog-list {
  border: solid 1px #dfdfdf;
  margin-bottom: 10px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
#blog-list-bottom {
  padding: 4px;
  text-align: center;
  background: seagreen;
  color: white;
}
.blog-header {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.empty-blog {
  width: 100%;
  text-align: center;
  padding: 10px;
  background: darksalmon;
  color: white;
}
</style>