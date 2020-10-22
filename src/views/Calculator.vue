<template>
  <section>
    <h1>Calculator</h1>
    <article>
      <h3>{{ current || "0" }}</h3>
      <div>
        <button @click="clear">AC</button>
        <button @click="sign">+/-</button>
        <button @click="percent">%</button>
        <button @click="divide">/</button>
      </div>
      <div>
        <button @click="append(7)">7</button>
        <button @click="append(8)">8</button>
        <button @click="append(9)">9</button>
        <button @click="times">X</button>
      </div>
      <div>
        <button @click="append(4)">4</button>
        <button @click="append(5)">5</button>
        <button @click="append(6)">6</button>
        <button @click="subtract">-</button>
      </div>
      <div>
        <button @click="append(1)">1</button>
        <button @click="append(2)">2</button>
        <button @click="append(3)">3</button>
        <button @click="add">+</button>
      </div>
      <div>
        <button @click="append(0)">0</button>
        <button @click="dot">.</button>
        <button @click="equal">=</button>
      </div>
    </article>
  </section>
</template>

<script>
import { defineComponent } from "vue";

const Calculator = defineComponent({
  name: "Calculator",
  data() {
    return {
      current: "",
      previous: "",
      operatorClicked: false,
      operator: null
    };
  },

  methods: {
    clear() {
      this.current = "";
    },
    sign() {
      this.current =
        this.current.charAt(0) === "-"
          ? this.current.slice(1)
          : `-${this.current}`;
    },
    percent() {
      this.current = `${parseFloat(this.current) / 100}`;
    },
    setPrevious() {
      this.previous = this.current;
      this.operatorClicked = true;
    },
    divide() {
      this.operator = (a, b) => a / b;
      this.setPrevious();
    },
    times() {
      this.operator = (a, b) => a * b;
      this.setPrevious();
    },
    subtract() {
      this.operator = (a, b) => a - b;
      this.setPrevious();
    },
    add() {
      this.operator = (a, b) => a + b;
      this.setPrevious();
    },
    append(number) {
      if (this.operatorClicked) {
        this.current = "";
        this.operatorClicked = false;
      }
      if (this.current === "0" && number === 0) {
        return;
      }
      this.current = `${this.current}${number}`;
    },
    dot() {
      if (this.current.indexOf(".") === -1) {
        this.append(".");
      }
    },
    equal() {
      this.current = `${this.operator(
        parseFloat(this.previous),
        parseFloat(this.current)
      )}`;
      this.previous = null;
    }
  }
});

export default Calculator;
</script>

<style scoped></style>
