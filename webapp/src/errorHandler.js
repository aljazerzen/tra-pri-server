export function errorHandler(vue) {
  return (e) => {
    switch (e.status) {
      case 0:
        vue.errors = ['Strežnik nedosegljiv.'];
        break;

      case 500:
        vue.errors = ['Napaka na strežniku.'];
        return;

      case 401:
        vue.$router.push('/login');
        vue.errors = ['Prosimo višite geslo.'];
        return;

      case 400:
        switch (e.body.error) {
          case 'DELETE_FOREIGN_KEY_VIOLATION':
            vue.errors = ['Ne morem izbrisati, ker obstajajo odvisni objekti'];
            return;

          case 'INCORRECT_PASSWORD':
            vue.$router.push('/login');
            vue.errors = ['Napačno geslo'];
            return;
          default:
            vue.errors = Array.isArray(e.body.message) ? e.body.message : [e.body.message];
            console.error(e.body);
            return;
        }

      default:
        console.error(e);
    }
  };
}
