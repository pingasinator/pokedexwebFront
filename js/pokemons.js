async function chargerPokemons(){
    const tbody = document.querySelector("#table-pokemons tbody");
    tbody.innerHTML = "";

    try{
        // Récupérer tous les pokémons - GET /api/pokemons
        const response_pokemon = await fetch(`${API_URL}/pokemons`);
        const pokemons = await response_pokemon.json();


        pokemons.map(async (pokemon) => {
            const response_type = await fetch(`${API_URL}/pokemons/${pokemon.id_pok}/types`);
            const type = await response_type.json();
            const response_evolution = await fetch(`${API_URL}/pokemons/${pokemon.id_pok}/evolutions`);
            const evolution = await response_evolution.json();
            let content = `<tr> 
                                    <td>${pokemon.id_pok}</td>
                                    <td>${pokemon.nom_pok}</td>`;
            try{
                content += `<td>${type[0].type_pok}, ${type[1].type_pok}</td>`;
            }catch{
                content += `<td>${type[0].type_pok}}</td>`;
            }

            try{
                content += `<td>${evolution[0].nom_pok}</td>`;
            }catch{
                content += `<td></td>`;
            }

            content += `</tr>`;
            tbody.innerHTML += content;
            console.log(evolution)});
        // Tout l'affichage pour la liste des pokémons
        // Vous avez le droit de faire d'autres fetch
        // Promise.all (plusieurs promesses en même temps)
    }catch (error) {

    }
}

chargerPokemons();