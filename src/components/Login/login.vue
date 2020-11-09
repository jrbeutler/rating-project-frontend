<template>
  <form class="login-form" @submit="checkForm" novalidate="true">
    <div id="topLogo">
      <img id="logo" alt="" src="/EduSourceLogo.png" />
    </div>
    <div id="Login">
      <form class="input-form">
        <ul class="wrapper">
          <li id="welcome">
            <label class="welcome">Welcome back,</label>
            <label class="welcome">Login here</label>
          </li>
          <li id="emailInput">
            <div class="email-group">
              <label for="Login" class="Input-label" v-show="showEmail"
                >Email</label
              >
              <input
                class="inputLine"
                :class="showmode ? 'active' : 'inputLine'"
                placeholder="Email"
                type="email"
                id="email"
                name="email"
                v-model="email"
              />
            </div>
            <!--<label class="notice">Inactive</label>-->
            <label class="warning" v-for="error in errors" :key="error">{{
              error
            }}</label>
          </li>
          <li id="passwordInput">
            <label for="Login" class="Input-label" v-show="showPassword"
              >Password</label
            >
            <div class="password-group">
              <input
                :type="typePwd"
                class="inputLine"
                :class="showmode ? 'active' : 'inputLine'"
                placeholder="Password"
                v-model="passWord"
                id="passWord"
                name="passWord"
              />
              <img class="eyes" @click="showPwd" src="/eye.ico" />
            </div>
            <!--<label class="notice" @click="showPwd">Hover</label>-->
            <label
              class="warning"
              v-for="passwordError in passwordErrors"
              :key="passwordError"
              >{{ passwordError }}</label
            >
          </li>
        </ul>
      </form>
    </div>
    <div>
      <div class="actions">
        <input id="loginButton" type="submit" @click="login" value="LOG IN" />
      </div>
      <div class="actions">
        <button id="signupButton" type="button" @click="signup">SIGN UP</button>
      </div>
    </div>
  </form>
</template>

<style lang="less" src="./login.less"></style>
<script lang="ts">
export default {
  name: "login",
  data() {
    return {
      typePwd: "password",
      email: null,
      account: "",
      passWord: null,
      showEmail: false,
      showPassword: false,
      errors: [],
      passwordErrors: [],
      showmode: false
    };
  },
  methods: {
    showPwd() {
      (this as any).typePwd =
        (this as any).typePwd === "password" ? "text" : "password";
    },
    myFocus() {
      (this as any).showmode = true;
    },
    checkForm: function(e: { preventDefault: () => void }) {
      (this as any).errors = [];
      if (!(this as any).passWord)
        (this as any).passwordErrors.push("Password required.");
      this.myFocus();
      if (!(this as any).email) {
        (this as any).errors.push("Email required.");
        this.myFocus();
      } else if (!this.validEmail((this as any).email)) {
        (this as any).errors.push("Valid email required.");
        this.myFocus();
      }
      if (!(this as any).errors.length) return true;
      e.preventDefault();
    },
    validEmail: function(email: string) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  },
  watch: {
    email: function() {
      (this as any).showEmail = (this as any).email != "";
    },
    passWord: function() {
      (this as any).showPassword = (this as any).password != "";
    }
  }
};
</script>
