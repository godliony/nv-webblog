<template>
  <div>
    <h1>Show User</h1>
    <p>ID: {{ user.id }}</p>
    <p>ชื่อ-นามสกุล: {{ user.name }} - {{ user.lastname }}</p>
    <p>email: {{ user.email }}</p>
    <p>password: {{ user.password }}</p>
  </div>
</template>

<script>
import UsersService from "@/services/UsersService";
export default {
  data() {
    return {
      user: []
    };
  },
  async created() {
    try {
      this.user = (await UsersService.show(this.$route.params.userId)).data;
    } catch (err) {
      console.log(err);
    }
  }
};
</script>

<style scoped>
</style>