const d = document,
    $main = d.querySelector("main"),
    $links = d.querySelector(".links");
let pokeAPI = "https://pokeapi.co/api/v2/pokemon/";
//para mostrar los pokemon me tengo que conectar a todos los end points para poder traer todos los datos

async function loadPokemons(url){
    try {
        //cargo todo el contenido del html con inner.html
        $main.innerHTML = `<img class="loader" src ="assets/loader.svg" alt="Cargando...">`;
        //le digo que espere la respuesta de la PokeAPI
        let res= await fetch(url),
        //de la respuesta de fetch la convierto a formato json
            json = await res.json(),
        //creo un template para los elementos (pokemons) traidos
            $template ="",
            //como la url de la API el "/" significa que puedo acceder a cosas anteriores y posteriores
            //creo dos variables vacías que se van a ir llenando con esta información
            $prevLink,
            $nextLink;


            //verifico que traiga todos los pokemons con sus url
            console.log(json);

            if(!res.ok) throw {status: res.status, statusText: res.statusText}

            //creo un for para recorrer los pokemons, que están en el array "results"
            for(let i=0; i< json.results.length; i++){
                //verifico iteración
                    //Sconsole.log(json.results[i]);
                //ahora consulto la propiedad url de cada pokemon
                try {
                    let res = await fetch (json.results[i].url),
                        pokemon = await res.json();
                        

                    console.log(res, pokemon);

                    //manipulo error, si algun pokemon da error lo mando al catch
                    if(!res.ok) throw {status: res.status, statusText: res.statusText}

                    //si no hay error, por cada iteracion creo un "figure" por cada pokemon
                    $template += `
                    <figure>
                        
                        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                        <figcaption>${pokemon.name}</figcaption>
                                             
                    
                    </figure>
                    ` ;
                   //esto debería mostrar las habilidades pero no lo hace
                    // for(let m = 0; m <= pokemon.abilities.length; m++  ){
                    //     `<figcaption>${pokemon.abilities[m].ability.name}</figcaption>`
                    // };
                    

                } catch (error) {
                    //console.log(err);
                    let message = err.statusText || "Ocurrió un error";
                    //creo un figcaption para cada pokemon que tenga un error
                    $template += `
                        <figure>
                            <figcaption>Error ${err.status}: ${message}</figcaption>
                        </figure>
                    `;
                }
            }//for
            //finalmente agrego cada template al html
            $main.innerHTML = $template;

            //ahora busco usar las variables nextLink y prevLink para poder cambiar de página, 
            //estas vienen en una propiedad de lo que se trae desde la api como "next y previous"
            $prevLink = json.previous ?  `<a href="${json.previous}">⏮️</a>`:"";
            $nextLink = json.next ? `<a href = "${json.next}">⏭️</a>`:"";
             //concateno
            $links.innerHTML = $prevLink + " " + $nextLink;
    }catch (err) {
        console.log(err);
        let message = err.statusText || "Ocurrió un error";
        $main.innerHTML = `<p>Error ${err.status}: ${message} </p>`;
    }
}
//llamo a la función cuando cargue el documento y recibe la url de la API
d.addEventListener("DOMContentLoaded", (e) => loadPokemons(pokeAPI));

d.addEventListener("click", e => {
     //creo el evento para cuando pase de página, además le saco el comportamiento por defecto para manipularlo
     if(e.target.matches(".links a")){
         e.preventDefault();
         loadPokemons(e.target.getAttribute("href"));   
         }
 });