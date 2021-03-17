export default function ({ $auth, redirect }) {
  if (!$auth.user.status) {
    return redirect('/profil/become')
  }
}
