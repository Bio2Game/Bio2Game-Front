<template>
  <section id="document">
    <nuxt-child class="context" />
  </section>
</template>

<style lang="scss">
#document {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 40px;

  .context {
    display: flex;
    flex-direction: column;
    padding: 32px;
    margin: 0 auto;
    flex: 1;
    background-color: #ffffff;
    max-width: 1400px;
    border-radius: 4px;

    h1 {
      margin: 1rem 0 1rem 0;
      font-size: 2rem;
    }

    h2 {
      margin: 1.5rem 0 0.5rem;
      font-size: 1.4rem;
    }

    h3 {
      margin: 1.5rem 0 0.5rem;
      font-size: 1.3rem;
    }

    h4 {
      margin: 1.5rem 0 0.5rem;
      font-size: 1.2rem;
    }

    h5 {
      margin: 1.5rem 0 0.5rem;
      font-size: 1.1rem;
    }

    h6 {
      margin: 1rem 0 0.5rem;
      font-size: 1rem;
    }

    p {
      margin: 0.3rem 0 0;
      line-height: 20px;
    }

    ul {
      list-style: disc;
      padding-left: 32px;
      margin-top: 8px;

      li {
        margin-bottom: 4px;
      }
    }

    a {
      color: $green;
    }

    table {
      margin-top: 1rem;
    }

    table,
    th,
    td {
      padding: 0.5rem;
      border: 1px solid black;
    }

    thead td {
      text-align: center;
      vertical-align: middle;
    }
  }
}
</style>
