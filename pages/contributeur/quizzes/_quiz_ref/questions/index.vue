<template>
  <div></div>
</template>

<script>
export default {
  middleware({ params, redirect }) {
    redirect(301, `/contributeur/quizzes/${params.quiz_ref}`)
  },
}
</script>
