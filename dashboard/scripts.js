fetch('/dashboard/sync')
  .then(data => data.text())
  .then(text => console.log(text));
