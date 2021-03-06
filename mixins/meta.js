export default {
  /**
   *
   * @param {String} d.name
   * @param {String} d.description
   * @param {String} d.slug
   */
  get: d => {
    const title = d.name
      ? `${d.name} Bio2Game - Consommateur mieux informé, plus responsable et respectueux de l'environnement`
      : "Bio2Game - Consommateur mieux informé, plus responsable et respectueux de l'environnement"

    const meta = [
      {
        hid: 'description',
        name: 'description',
        content: d.description,
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: d.title || title,
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: d.description,
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: d.slug
          ? `${process.env.BASE_URL}/${d.slug}`
          : process.env.BASE_URL,
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: d.title || title,
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: d.description,
      },
    ]

    return { title, meta }
  },
}
