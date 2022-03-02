<template>
  <div class="notif-container-v2">
    <div class="notif">
      <h3 class="title">Journée Mondiale de l’eau</h3>
      <div class="wrapper">
        <p>
          Retrouvez un quiz par jour en<br />
          colaboration avec la Water Family<br />
          <strong>7 mars</strong> au <strong>22 mars 2022</strong> !
        </p>

        <a
          class="button md green"
          href="https://www.bio2game.com/quiz?query=WaterFamily"
          target="blank"
        >
          L'eau vous challenge
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotifHandler',
}
</script>

<style lang="scss">
.notif-container-v2 {
  position: absolute;
  z-index: 1000;
  top: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  height: 100vh;

  .notif {
    position: relative;
    overflow: hidden;
    padding: 24px;
    margin: 0 32px 32px 0;
    max-width: 370px;
    background-color: #f5f5f5;
    border-radius: 12px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    @media screen and (max-width: 1024px) {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-left: 40px;
      max-width: 100%;
    }

    .title {
      color: $green;
      font-size: 22px;
      font-weight: 700;
      line-height: 27px;
      text-align: center;
      margin-bottom: 16px;
      min-width: 296px;
      @media screen and (max-width: 1024px) {
        width: 100%;
      }
    }

    .wrapper {
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-size: 17px;
      font-weight: 500;
      line-height: 20px;
      text-align: center;
      flex-direction: column;
      transition: 0.1s opacity ease-in-out, 0.2s transform ease-in-out;

      .button {
        margin-top: 24px;
      }
    }
  }
}
</style>
