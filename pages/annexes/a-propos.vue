<template>
  <section id="document">
    <div class="context">
      <h1 class="no-m">À propos</h1>
      <h4>Vous vous intéressez au développement durable ?</h4>

      <p>
        Bio2Game est là pour tester vos connaissances, les approfondir d’une
        manière ludique et pour éventuellement partager vos expériences.
      </p>

      <ul>
        <li>
          Des quiz sur tous les sujets environnementaux réalisés par des
          experts, des acteurs économiques travaillant sur des sujets innovants
          et des anonymes qui ont acquis des savoirs.
        </li>
        <li>
          Un lieu virtuel de rencontres et de partages d'informations entre tous
          ceux qui cherchent à vivre en harmonie avec l’Environnement.
        </li>
      </ul>

      <h4>Pourquoi un jeu ?</h4>

      <ul>
        <li>
          C’est une méthode rapide et conviviale pour tester, transmettre et
          enrichir ses connaissances.
        </li>
        <li>
          En posant des questions précises, Bio2Game génère l’intérêt et stimule
          l’apprentissage.
        </li>
        <li>
          En générant de nouvelles prises de conscience, Bio2Game initie le
          désir d’approfondissement et de développement de solutions efficaces.
        </li>
      </ul>

      <h4>Pourquoi Bio2Game est-il fédérateur ?</h4>

      <ul>
        <li>
          Bio2Game traite de l’ensemble des sujet environnementaux en
          interaction avec tous ceux qui s’y impliquent.
        </li>
        <li>
          Bio2Game permet d’établir de nouveaux rapports constructifs entre les
          joueurs et les acteurs du développement durable.
        </li>
      </ul>

      <h4>Comment contribuer à Bio2Game ?</h4>

      <p>
        Bio2Game est une plateforme ouverte à tous : chacun peut ouvrir un
        compte et accéder à l’interface pour créer des quiz sur son sujet de
        prédilection.
      </p>

      <p>
        Si vous souhaitez partager une expertise personnelle vous devenez «
        contributeur » et vous vous identifiez avec le pseudo du « compte
        contributeur ».
      </p>

      <p>Vous pouvez obtenir le niveau de « contributeur habilité »</p>

      <ul>
        <li>
          Si vous êtes une institution reconnue, il vous suffit d’en faire la
          demande à Bio2Game.
        </li>
        <li>
          Si vous êtes un particulier, vous devrez démontrer votre expertise sur
          le sujet en répondant correctement à de nombreuses questions sur le
          domaine.
        </li>
      </ul>

      <p>
        Un Conseil Scientifique sera mis en place pour valider l’habilitation
        des « contributeurs ».
      </p>

      <h4>Quel peut être l’apport de Bio2Game dans votre activité ?</h4>

      <p>Si vous êtes joueur :</p>

      <ul>
        <li>Apprendre et tester vos connaissances.</li>
        <li>Découvrir des sources d’information et de formation.</li>
      </ul>

      <p>Si vous êtes un Institut de formation, une association…</p>

      <ul>
        <li>
          Créer des quiz qui s’intégreront à vos communications digitales pour
          susciter l’intérêt de votre public.
        </li>
        <li>
          Animer vos séminaires/webinaires avec des parties utilisant les quiz.
        </li>
        <li>
          Publier dans Bio2Game des quiz faisant connaître vos formations en
          ligne.
        </li>
        <li>
          Utiliser Bio2Game pour permettre aux étudiants/élèves de tester et
          d’approfondir leurs connaissances sur les enseignements dispensés.
        </li>
      </ul>

      <h4>Politique de Bio2Game</h4>

      <ul>
        <li>
          Utiliser les données personnelles des joueurs exclusivement pour leur
          identification
        </li>
        <li>
          Ne pas partager les données et les coordonnées des joueurs avec des
          partenaires.
        </li>
        <li>
          Réinvestir d’éventuels bénéfices dans des projets de développement
          alternatif choisis par les joueurs.
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import meta from '@/mixins/meta.js'

export default {
  head() {
    return meta.get({
      name: 'À Propos',
      description:
        'Jeu pour apprendre à consommer de façon responsable en testant vos connaissances dans le développement durable. En adhérant à BIO2GAME vous partagerez vos préoccupations environnementales.',
    })
  },
}
</script>

<style lang="scss">
#document {
  display: flex;
  align-items: center;
  padding: 50px 40px;
  flex-direction: column;
  .context {
    display: flex;
    padding: 32px;
    flex-direction: column;
    flex: 1;
    background-color: #ffffff;
    max-width: 1400px;
    margin: 0 auto;
    border-radius: 4px;

    h1 {
      margin: 1rem 0 1rem 0;
      font-size: 2rem;
      &.no-m {
        margin-bottom: 0;
      }
    }
    h4 {
      margin: 1.5rem 0 0.5rem;
      font-size: 1.4rem;
    }
    h6 {
      margin: 1rem 0 0.5rem;
      font-size: 1.2rem;
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
