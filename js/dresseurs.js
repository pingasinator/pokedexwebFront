async function loadDresseurs() {
    const tbody = document.querySelector("#table-dresseurs tbody");
    tbody.innerHTML = "";

    try{
        const response_dresseurs = await fetch(`${API_URL}/dresseurs`);
        const dresseurs = await response_dresseurs.json();

        dresseurs.map(async (dresseur) => {
            let content = `<tr> 
                                    <td>${dresseur.nom_dress}</td>`;
            content += `</tr>`;
            tbody.innerHTML += content;
        });
    }catch (error){

    }
}

loadDresseurs();