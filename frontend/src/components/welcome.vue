<style scoped>
@import "./welcome.css";
</style>

<template>
  <div class="hello">
    <h3>Search & Replace</h3>
    <form @submit.prevent="onSubmit()">
      <p>
        <label for="search">Find this...</label> <br />
        <input
          type="text"
          placeholder="Search"
          id="search"
          name="search"
          v-model="formData.search"
          required
        />
      </p>
      <p>
        <label for="replace">Replace with...</label> <br />
        <input
          type="text"
          placeholder="Replace"
          id="replace"
          name="replace"
          v-model="formData.replace"
          required
        />
      </p>
      <p v-if="message">
        {{ message }}
      </p>
      <button type="submit">Replace</button>
    </form>
    <!-- User Feedback is good -->
    <div class="lds-ellipsis" v-if="busy">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script src="./welcome.ts"></script>