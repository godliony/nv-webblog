<template>
  <!-- new navbar -->
  <div class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
      <div class="navbar-header">
        <a
          class="navbar-brand navbar-link"
          href="#"
          v-on:click.prevent="navigateTo('/dashboard')"
        >
          <img src="../assets/logo.png" id="logo" />
        </a>
        <button
          class="navbar-toggle collapsed"
          data-toggle="collapse"
          data-target="#navcol-1"
        >
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span><span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
      </div>
      <div class="collapse navbar-collapse" id="navcol-1">
        <ul class="nav navbar-nav navbar-right">
          <li role="presentation">
            <router-link :to="{ name: 'blogs' }">Blogs</router-link>
          </li>
          <li role="presentation">
            <router-link :to="{ name: 'users' }">User</router-link>
          </li>
          <li role="presentation">
            <router-link :to="{ name: 'comments' }">Comments</router-link>
          </li>
          <li role="presentation">
            <router-link :to="{ name: 'login' }">Login</router-link>
          </li>
          <li role="presentation"><a v-on:click.prevent="logout">Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
  <!--
  <div class="nv-navbar">
    <ul class="nav">
      <li><router-link :to="{ name: 'blogs' }">Blogs</router-link></li>
      <li><router-link :to="{ name: 'users' }">User</router-link></li>
      <li><router-link :to="{ name: 'comments' }">Comments</router-link></li>
      <li><router-link :to="{ name: 'login' }">Login</router-link></li>
      <li><a v-on:click.prevent="logout">Logout</a></li>
    </ul>
    <div class="clearfix"></div>
  </div>
  -->
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      error: ""
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("setToken", null);
      this.$store.dispatch("setUser", null);
      this.$router.push({
        name: "login"
      });
    }
  }
};
</script>

<style>
.navbar-brand > img {
  width: 36px;
  padding: 12px 0;
  margin-top: -20px;
}
a.router-link-active {
  color: yellowgreen !important;
}
</style>