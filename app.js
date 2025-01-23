const card_container = document.getElementById('cards_container');
const move_display = document.getElementById('move');
const time_display = document.getElementById('time');
//lear the state of the game
let id_timer = 0;
const cards = [];
const choices = [];
let move = 0;
console.log(card_container);
function createCard(index_card){
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card">
                <div class="card_inner">
                    <div class="card_front">
                        <img src="images/card_back.jpg" alt="2" class="card_image" />
                    </div>
                    <div class="card_back">
                        <img src="images/${index_card}.png" alt="1" class="card_image" />
                    </div>
                </div>
            </div>
    `;
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
        // updateMove(move + 1);
    });
    cards.push(card);
    card_container.appendChild(card);
}
for(let i = 1; i <= 12; i++){
    createCard(i);
}
function updateMove(new_move){
    move = new_move;
    move_display.innerHTML = move;
}