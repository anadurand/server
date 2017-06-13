//obtengo las librerias, importar codigo ajeno
const express = require("express");
const bodyParser = require("body-parser");
const levelup = require("levelup");


//crear aplicacion que va levantar server
const app = express();
//config base de datos
const db = levelup("./data", { valueEncoding: "json"});
//dos parametros donde guarda data y el valor se guarda de tipo json sino se hace string
//data aparece cuando se levante el sistema y haga push
//app utiliza la libreria de body parser, transforma el formulario http a un formato json que puedo usar en mi sistema
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(express.static("public"));

//crea un router, rutas reales de trabajo, puedo definir un monton de rutas, si hay mas rutas se agregan despues de api
const router = express.Router();

router.get("/", (req, res) => {
  //res.send("Hello world!");
  res.json({message: "Hola soy el API de cine laboratoria"});
  //para que se vea mejor instalo una extencio postman, simula los req de cualquier tipo

});

//ahora uso post

router.post("/movies", (req, res) => {
  console.log(req.body); //body donde viene el formulario en si
  //la-momia
  const id = req.body.nombre.toLowerCase().split(" ").join("-");
  db.put(id, req.body, (err) => {
    if(err) return res.json({message: "hubo un error al guardar los datos"});
  });
  res.json({ message: "la pelicula se grabo con exito"});
});

router.get("/movies", (req,res) => {
  let movies = [];
  db.createValueStream().on("data", (data) => {
    movies.push(data);
  }).on("end", _ => {
    res.json(movies);
  });
});

router.get("/movies/:id", (req, res) => {
  if(req.params.id){
    db.get(req.params.id, (err, movie) => {
      if(err) return res.json({ message: "hubo un error al obtener"});
      res.json(movie);
    })

  }
})

//a todas esas rutas se le antepone esto api
//localhost:3000/api/...
app.use("/api", router);

//luego al router le pongo una ruta especifica
//le vinculo una ruta
app.get("/", (req, res) => {
  res.send("hello world!");
});
//escuche el puerto 300, cuando este listo mande un mensaje
// app.listen(3000, () => {
//   console.log("El server esta corriendo en el 3000!");
// });

//aqui asigno el puerto cambiante si es que me ingresan el puerto, flexibilizo el servidor
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("El server esta corriendo en el "+ port + "!");
});
//se jecuta en el  node index.js, voy al local host 300 y corro, sale hello world
//ayuda node --help
//las rutas deben ser el api o subdominio,


//usualmente no se devuelve txt plano sino json, entonces cambiamos send por json
