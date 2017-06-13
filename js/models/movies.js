const getMovies = (callback) => {
  const xhr = new HMLHttpRequest();

  xhr.addEventListener("load", _ => {
    if(xhr.status != 200) callback( new Error("Error al obtener datos"));
    callback(null, response);
  });

  xhr.open("GET", "api/movies");
  xhr.responseType = "json";
  xhr.send();

}
