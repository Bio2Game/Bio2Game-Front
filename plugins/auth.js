export default function ({ $auth }) {
  $auth.onRedirect((_to, from) => {
    if (/^\/parties\/[A-Za-z1-9]{8}$|^\/quiz\/(\d+)-\S+$|^\/petit-bateau$/.test(from)) {
      return from
    }
  })
}
