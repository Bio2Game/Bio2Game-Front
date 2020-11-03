<template>
  <div></div>
</template>

<script>
export default {
  middleware({ params, redirect }) {
    redirect(301, `/admin/users`)
  },
}
</script>
