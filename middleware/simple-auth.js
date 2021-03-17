export default function ({ $auth, redirect }) {
  if ($auth.strategy.name === 'user' && $auth.loggedIn) {
    return redirect('/')
  }
}
