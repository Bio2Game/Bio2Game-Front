export default function ({ store, redirect }) {
  if (store.state.auth.user.status < 2) {
    return redirect('/')
  }
}
