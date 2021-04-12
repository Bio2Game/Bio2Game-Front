export default function ({ $auth, redirect }) {
  if ($auth.user.status < 1000) {
    return redirect('/')
  }
}
