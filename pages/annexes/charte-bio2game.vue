<template>
  <div>
    <h1>La Charte Bio2Game</h1>
    <p>
      Bio2Game est un jeu produit par l'assocition Bio2game "Loi 1901". Il est
      constitué d’un socle de connaissances sur les thématiques du Développement
      Durable (DD) et proposé sous forme de quiz.
    </p>
    <p>
      <strong>Bio2Game</strong> permet aux utilisateurs et aux acteurs du DD :
    </p>
    <ul>
      <li>de lutter contre la désinformation,</li>
      <li>de tester leurs connaissances,</li>
      <li>
        de partager les meilleures pratiques et les avancées connues pour
        l’optimisation d’une consommation responsable,
      </li>
      <li>
        de permettre aux experts l’utilisation des quiz pour se positionner en
        tant que tels,
      </li>
      <li>
        de valoriser les engagements des acteurs, en dynamisant leurs
        communications par le biais de parties en ligne.
      </li>
    </ul>
    <h4>L’engagement de Bio2Game :</h4>
    <ul>
      <li>
        Permettre à ceux qui ont acquis une expertise dans le domaine du DD, de
        communiquer, de partager leurs connaissances tout en les enrichissant.
      </li>
      <li>Offrir à chacun une plateforme pour animer ses réseaux.</li>
      <li>
        Proposer deux modes d’identification aux joueurs :
        <ul>
          <li>
            par pseudo : dans ce cas, aucune donnée n’est conservée d’une
            session à l’autre et le joueur n’a pas accès à sa progression,
          </li>
          <li>
            par identification : le joueur peut suivre sa progression. Bio2Game
            s’engage à utiliser les données personnelles exclusivement dans le
            cadre de l’identification du joueur : aucune donnée personnelle ne
            sera communiquée à des tiers.
          </li>
        </ul>
      </li>
      <li>
        Rendre publiques les données du contributeur et des auteurs afin de :
        <ul>
          <li>permettre aux joueurs de découvrir de nouveaux experts,</li>
          <li>
            informer le contributeur ou l’auteur en cas de contestation sur les
            informations fournies.
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import meta from '@/mixins/meta.js'

export default {
  head() {
    return meta.get({
      name: 'La Charte',
      description:
        'Jeu pour apprendre à consommer de façon responsable en testant vos connaissances dans le développement durable. En adhérant à BIO2GAME vous partagerez vos préoccupations environnementales.',
    })
  },
}
</script>
