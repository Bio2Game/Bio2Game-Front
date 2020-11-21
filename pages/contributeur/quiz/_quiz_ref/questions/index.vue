<template>
  <div></div>
</template>

<script>
export default {
  middleware({ params, redirect }) {
    redirect(301, `/contributeur/quiz/${params.quiz_ref}`)
  },
}
</script>
