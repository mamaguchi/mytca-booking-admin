export default ({ store, $axios, redirect, route }) => {
  if (store.state.auth.auth === null || !store.state.auth.auth.token) {
    // Handle error
    // error({
    //   message: 'No JWT token',
    //   statusCode: 403
    // })

    // or Redirect to login page
    return redirect('/login')
  } else {
    $axios.setHeader('Authorization', `Bearer: ${store.state.auth.auth.token}`)
  }
}
