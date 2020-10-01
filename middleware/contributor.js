export default function ({ $auth, redirect }) {
  if ($auth.user.status < 1) {
    return redirect('/profil/become')
  }
}
