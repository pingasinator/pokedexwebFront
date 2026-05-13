let currentPokemon;
let currentId = 0;

let pokemon_orientation = 0;
let pokemon_shiny = 0;

const pokemon_sprite_element = document.getElementById('pokemon-sprite');
const pokemon_stats_element = document.getElementById(`pokemon-stats`);
const pokemon_title_element = document.getElementById(`pokemon-title`);
const pokemon_id_element = document.getElementById('pokemon-id');
const pokemon_types_element = document.getElementById('pokemon-types');
const pokemon_height_element = document.getElementById('pokemon-height');
const pokemon_weight_element = document.getElementById('pokemon-weight');

async function chargerPokemons(){
    const tbody = document.querySelector("#pokemons");
    tbody.innerHTML = "";

    try{
        // Récupérer tous les pokémons - GET /api/pokemons
        const response_pokemon = await fetch(`${API_URL}/pokemons`);
        const pokemons = await response_pokemon.json();


        pokemons.map(async (pokemon) => {

            let content = `<li id="pokemon_${pokemon.id_pok}" class="pokemon">
                                  </li> `;
            content += `</tr>`;
            tbody.innerHTML += content;

            const response_pokemon_sprite = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id_pok}`);
            const pokemon_info = await response_pokemon_sprite.json();
            const pokemon_sprite = await pokemon_info.sprites.front_default;

            const pokemon_element = document.getElementById(`pokemon_${pokemon.id_pok}`);
            pokemon_element.innerHTML = `<button onClick="loadPokemon(${pokemon.id_pok})">
                ${pokemon.id_pok < 10 ? "00" + pokemon.id_pok : pokemon.id_pok < 100 ? "0" + pokemon.id_pok : pokemon.id_pok}
                <img src="${pokemon_sprite}" alt="${pokemon.nom_pok}_sprite"/>
            </button>`;

        });
        // Tout l'affichage pour la liste des pokémons
        // Vous avez le droit de faire d'autres fetch
        // Promise.all (plusieurs promesses en même temps)
    } catch (error) {
        error.status().json();
    }
}

async function loadPokemon(id) {

    currentId = id;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const response_pokemon_db = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    currentPokemon = await response.json();
    const evolution_tree = await getEvelutionTree(id);

    const stats_names = {0:"Point de vie", 1:"Attaque", 2:"Défence", 3:"Vitesse", 4:"Attaque Spé.", 5:"Défence Spé."};

    console.log(currentPokemon);

    pokemon_title_element.innerText = `${id < 10 ? "00" + id : id < 100 ? "0" + id : id } ${currentPokemon.name}`;
    pokemon_id_element.innerText = `${id < 10 ? "00" + id : id < 100 ? "0" + id : id }`;

    pokemon_height_element.innerHTML = `<div>Taille</div><div>${currentPokemon.height / 10}m</div>`;
    pokemon_weight_element.innerHTML = `<div>Poids</div><div>${currentPokemon.weight / 10}kg</div>`;

    loadTypes(id);
    swicth_sprite('reset');


    for(let i = 0; i < 3; i++) {
        const evolution_sprite_element = document.getElementById(`evolution-${i}-sprite`);
        const evolution_name_element = document.getElementById(`evolution-${i}-name`);
        if(evolution_tree[i] !== undefined){
            const response_evolution = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolution_tree[i]}`);
            const evolution = await response_evolution.json();
            evolution_sprite_element.innerHTML = `<button class="evolution-sprite pokemon-sprite" onClick="loadPokemon(${evolution_tree[i]})"><img src="${evolution.sprites.front_default}" alt="${evolution.name}"></button>`;
            evolution_name_element.innerText = `${evolution.name}`;
        }else{
            evolution_name_element.innerText = `No data`;
            evolution_sprite_element.innerHTML = `<button class="evolution-sprite pokemon-sprite"><img src="img/pokeball.png" alt="No data"></button>`;
        }
    }

    let stats_content =`<table>
                                    <tbody>`;

                            for(let i = 0; i < 6; i++){
                                stats_content += `<tr>
                                <td>${stats_names[i]}</td>
                                    <td>${currentPokemon.stats[i].base_stat}</td>
                                </tr>`;
                            }

    stats_content +=`    </tbody>
                            </table>`;

    pokemon_stats_element.innerHTML = stats_content;
}

async function getEvelutionTree(id){

    const response_base = await fetch(`${API_URL}/pokemons/${id}/base`);
    const base = await response_base.json();

    const response_first_evolution = await fetch(`${API_URL}/pokemons/${id}/evolutions`);
    const first_evolution = await response_first_evolution.json();

    let bases = [];
    let evolutions = [];
    let tree = [];

    if(base.length > 0) {
        const response_sec_base = await fetch(`${API_URL}/pokemons/${base[0].id_pok_base}/base`);
        const sec_base = await response_sec_base.json();

        if (sec_base.length > 0){
            bases.push(sec_base[0].id_pok_base);
        }
        bases.push(base[0].id_pok_base);
    }

    bases.push(id);

    if(first_evolution.length > 0){
        const response_sec_evolution = await fetch(`${API_URL}/pokemons/${first_evolution[0].id_pok_evol}/evolutions`);
        const sec_evolution = await response_sec_evolution.json();
        evolutions.push(first_evolution[0].id_pok_evol);
        if(sec_evolution.length > 0)
        {
            evolutions.push(sec_evolution[0].id_pok_evol);
        }
    }

    tree = bases.concat(evolutions);
    return tree;

}

async function swicth_sprite(mode){
    if(currentPokemon !== undefined && pokemon_sprite_element !== undefined){
        switch (mode){
            case 'reset':
                pokemon_orientation = 0;
                pokemon_shiny = 0;
                break;

            case 'orientation':
                pokemon_orientation++;
                pokemon_orientation = pokemon_orientation%2;
                break;

            case 'shiny':
                pokemon_shiny++;
                pokemon_shiny = pokemon_shiny%2;
                break;

        }
    }

    if(pokemon_shiny === 0)
    {
        pokemon_sprite_element.innerHTML = pokemon_orientation === 0 ?
            `<img src="${currentPokemon.sprites.front_default}" alt="${currentPokemon.name}">
       ` : `<img src="${currentPokemon.sprites.back_default}" alt="${currentPokemon.name}">`;
    }else{
        pokemon_sprite_element.innerHTML = pokemon_orientation === 0 ?
            `<img src="${currentPokemon.sprites.front_shiny}" alt="${currentPokemon.name}">
       ` : `<img src="${currentPokemon.sprites.back_shiny}" alt="${currentPokemon.name}">`;
    }
}

async function loadTypes(id){
    response = await fetch(`${API_URL}/pokemons/${id}/types`);
    const types = await response.json();

    let content = ``;

    types.map(type => {
        content += `<div class="pokemon-type type ${type.type_pok}"> ${type.type_pok}</div>`;
    })

    pokemon_types_element.innerHTML = content;

    console.log(types);
}

function nextPokemon(i){
    currentId = currentId + i <= 1 ? 1 : currentId + i >= 150 ? 150 : currentId + i;
    loadPokemon(currentId);
}

chargerPokemons();