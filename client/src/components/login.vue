<template>
  <div>
    <h1>User Login</h1>
    <form v-on:submit.prevent="onLogin">
      <p>Username: <input type="text" v-model="email" /></p>
      <p>Password: <input type="text" v-model="password" /></p>
      <p><button type="submit">Login</button></p>
    </form>
  </div>
</template>

<script>
import AuthenService from "@/services/AuthenService";
export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    async onLogin() {
      try {
        const reponse = await AuthenService.login({
          email: this.email,
          password: this.password
        });
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style>
</style>