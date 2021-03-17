export default function ({ $auth, redirect }) {
  if ($auth.strategy.name !== 'user') {
    return redirect('/login')
  }
}
