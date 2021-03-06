export default function ({ $auth, redirect }) {
  if ($auth.user.status < 2) {
    return redirect('/')
  }
}
