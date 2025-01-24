//get or create html elemnt
const audio_correct = document.createElement('audio');
audio_correct.src = 'https://cdn.pixabay.com/audio/2023/07/05/audio_ea7208a779.mp3';
const audio_flip = document.createElement('audio');
audio_flip.src = 'https://cdn.pixabay.com/audio/2022/03/15/audio_e385f1aa0d.mp3';
const audio_gameover = document.createElement('audio');
audio_gameover.src = 'https://cdn.pixabay.com/audio/2023/04/10/audio_b837c83014.mp3';
const audio_incorect = document.createElement('audio');
audio_incorect.src = 'https://cdn.pixabay.com/audio/2022/03/10/audio_6b59debae7.mp3';
const card_container = document.getElementById('cards_container');
const game_level = document.getElementById('game_level');
const card_style = document.getElementById('card_style');
const game_win_container = document.getElementById('game_win_container');
const game_win_info = document.getElementById('game_win_background');
const move_display = document.getElementById('move');
const restart_button = document.getElementById('play_again_button');
const start_button = document.getElementById('start_button');
const time_display = document.getElementById('time');
const total_move_display = document.getElementById('total_moves');
const total_time_display = document.getElementById('total_time');
//using anonymous function
//and use as callback functions
game_level.addEventListener('change',()=>{start_button.innerText='Restart to apply effect'})
card_style.addEventListener('change',()=>{start_button.innerText='Restart to apply effect'})
// ES6 feature: let
let remain_card = 0;
//add listening to an event
//add button event to restart the game
start_button.addEventListener('click', restart);
restart_button.addEventListener('click',restart)
let time = 0;
let move = 0;
//remove interval loop when done
let id_timer = 0;
let cards = [];
let choices = [];

/**
 * Plays the correct match audio and adds a visual effect to the matched card.
 * @param {HTMLElement} card - The card element that was matched.
 */
function addEffectCardMatched(card){
    const card_img_effect = window.document.createElement('div');
    card_img_effect.classList.add('card_img_correct');
    card.querySelector('.card_inner').appendChild(card_img_effect);
    audio_correct.play()
}

/**
 * Plays the incorrect match audio and adds a visual effect to the incorrect card.
 * @param {HTMLElement} card - The card element that was incorrectly matched.
 */
function addEffectCardIncorrect(card){
    const card_img_effect = window.document.createElement('div');
    const card_inner = card.querySelector('.card_inner');
    card_img_effect.classList.add('card_img_incorrect');
    card_inner.appendChild(card_img_effect);
    setTimeout(() => {
        card_inner.removeChild(card_img_effect);
    }, 600);
    audio_incorect.play()
}

/**
 * Creates a card element with the specified index.
 * @param {number} index_card - The index for the card image.
 * @return {HTMLElement} The created card element.
 */
function createCard(index_card){
    const card = document.createElement('div');
    card.className = 'card';
    // ES6 feature: Template Literals
    card.innerHTML = `
        <div class="card" data-value="${index_card}" data-matched="false">
                <div class="card_inner">
                    <div class="card_front">
                        <img src="images/${card_style.value}/card_back.jpg" alt="2" class="card_image" />
                    </div>
                    <div class="card_back">
                        <img src="images/${card_style.value}/${index_card}.png" alt="1" class="card_image" />
                    </div>
                </div>
            </div>
    `;
    card.dataset.value = index_card;
    card.dataset.matched = false;
    card.addEventListener('click', () => onClickCard(card));
    return card;
}

/**
 * Click event handler for a card. Checks if the card is matched or not.
 * @param {HTMLElement} card - The card element that was clicked.
 */
function onClickCard(card){
    //card already matched then return
    if(card.dataset.matched === 'true'){
        return
    }
    //if card is flipped then check if matched
    if(card.classList.toggle('flipped')){
        choices.push(card);
        if(choices.length==2){
            updateMove();
            const [first, second] = choices;
            if(first.dataset.value === second.dataset.value){
                //set matched to true
                first.dataset.matched = true;
                second.dataset.matched = true;
                //add matched class
                first.classList.add('matched');
                second.classList.add('matched');
                //add effect to card matched
                addEffectCardMatched(first);
                addEffectCardMatched(second);
                //reset choices
                choices = [];
                remain_card -= 2;
                console.log(remain_card)
                //check if all cards are matched
                if(remain_card <= 0){
                    audio_gameover.play();
                    clearInterval(id_timer);
                    setTimeout(() => {
                        game_win_info.style.visibility='visible';
                    }, 300);
                }
            }else{
                //add effect to card incorrect
                addEffectCardIncorrect(first);
                addEffectCardIncorrect(second);
                //wait for 1 second then flip back
                setTimeout(() => {
                    first.classList.remove('flipped');
                    second.classList.remove('flipped');
                }, 1000);
                choices = [];
            }
        }
    }
    // call is flip back, pop the choice
    else{
        choices.pop();
    }
}

/**
 * Updates the move count display.
 * @param {number} [new_move=-1] - The new move count. If not provided, increments the current move count.
 */
function updateMove(new_move=-1){
    if(new_move!==-1) move = new_move;
    else move++;
    total_move_display.innerText=move;
    move_display.innerHTML = move;
}

/**
 * Updates the time display.
 * @param {boolean} [restart=false] - If true, resets the time to 0.
 */
function updateTime(restart = false){
    if(restart){time = 0;}
    else time++;
    const min = Math.floor(time / 60);
    const sec = time % 60;
    const time_str = (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
    time_display.innerHTML = time_str;
    total_time_display.innerHTML = time_str;
}

/**
 * Restarts the game by resetting all variables, shuffling cards, and starting the timer.
 */
function restart(){
    choices = [];
    // DOM manipulation: clearing the inner HTML
    card_container.innerHTML = '';
    start_button.innerText = 'Restart game'
    cards = [];
    remain_card=0;
    const level = Number(game_level.value);
    //calculate card amount needed
    const card_amount = (level * level) / 2;
    //create cards
    for(let i = 1; i <= card_amount; i++){
        remain_card += 2;
        //create 2 pair and put in array
        const card1 = createCard(i);
        const card2 = createCard(i);
        cards.push(card1,card2);
    }
    //shuffle cards
    cards.sort(() => Math.random() - 0.5);
    //change grid style for card container
    card_container.style.gridTemplateColumns = `repeat(${level}, 1fr)`;
    cards.forEach(card => card_container.appendChild(card));
    //reset time and move
    clearInterval(id_timer);
    updateMove(0);
    updateTime(true);
    //hide game_over_info
    game_win_info.style.visibility='hidden';
    id_timer = setInterval(updateTime, 1000);
}