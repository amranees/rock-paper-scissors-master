// global
let sec = 1000;
let width = 590;
// Rules Section 
let rules_btn = document.querySelector('.rules-btn');
let rules_container = document.querySelector('.rules-container')
let overlay = document.querySelector('.overlay');
rules_btn.onclick = () => {
    rules_container.classList.add('active');
    if (window.innerWidth > width) {

        overlay.classList.add('active');    
    }
}

let close = document.querySelector('.close');
close.onclick = () => {
    close.parentElement.classList.remove('active');
    overlay.classList.remove('active');
}

// Start Start Game
let elements_container = document.querySelector('.elements-container');
let elements = document.querySelectorAll('.element');

function mePicked(ele) {
    elements_container.classList.add('active');
    if (elements_container.classList.contains('chooseable')) {
        if (window.innerWidth > width) {
            setTimeout(() => {
                elements_container.style.columnGap = '245px';

            }, sec)
        }
        // Change img
        let paper = document.querySelector('.paper');
        let paper_img = paper.querySelector('img');
        let current_img = ele.querySelector('img');
        // change data
        let data_beats = ele.getAttribute('data-beats');
        let data_beats_me = ele.getAttribute('data-beats-me');
        let data_color = ele.getAttribute('data-color');

        let element = current_img.parentElement.parentElement;
        paper_img.src = current_img.src;
        // get background-img
        let current_bg = window.getComputedStyle(element).backgroundImage;
        // Change the bg 
        paper.style.background = current_bg;


        // Set the new beats to ele I picked
        paper.setAttribute('data-beats', data_beats);
        // Set the new (who can beats me) I picked
        paper.setAttribute('data-beats-me', data_beats_me);
        // change data-color
        paper.setAttribute('data-color', data_color);
        // Change computer selection, data-beats
        let computer = computerPicked();
        // ---- Store the computer `data-beats-me` in a variable
        // Now after set all values we need (data-beats, data-beats-me, img, bg)
        //  for of the tow sides, it's time to know who win

        let computer_beats = computer.beats;
        let computer_beats_me = computer.beats_me;

        let scissors = document.querySelector('.scissors')
        whoWin(data_beats, computer_beats, computer_beats_me, paper, scissors);
        // -- data_beats, computer_beats, computer_beats_me: compare these values and know who win
        // -- paper, scissors: Add shadow to the winner

        // Remove choosebale class;
        elements_container.classList.remove('chooseable');

    }

}
elements.forEach(ele => {
    ele.addEventListener('click', () => {
        mePicked(ele);
    }, false)
});

function orginal() {
    // this function will store all the orginal values for the elements, so we can retrun the elements to its orginal state
    let colors = [];
    let imgs = [];
    let color = [];

    let beats = [];
    let beats_me = [];

    elements.forEach(ele => {
        // Get orgianl colors / imgs
        colors.push(window.getComputedStyle(ele, null).getPropertyValue('background'));
        color.push(ele.getAttribute('data-color'));
        imgs.push(ele.querySelector('img').src)
    });

    elements.forEach(ele => {
        // Get orgianl beats / beats_me
        beats.push(ele.getAttribute('data-beats'));
        beats_me.push(ele.getAttribute('data-beats-me'));
    })

    let orgin_features = [{
            // Store the vlues in an obj
            bg: colors[0],
            img: imgs[0],
            color: color[0],

            beats: beats[0],
            beats_me: beats_me[0],
        },
        {
            bg: colors[1],
            img: imgs[1],
            color: color[1],

            beats: beats[1],
            beats_me: beats_me[1],
        },
        {
            bg: colors[2],
            img: imgs[2],
            color: color[2],

            beats: beats[2],
            beats_me: beats_me[2],
        }
    ];
    return orgin_features;
};
let orginal_elements = orginal();

// End Start Game
// What computer picked ( Random )
function computerPicked() {
    let scissors = document.querySelector('.scissors');
    let choosing = scissors.querySelector('.choosing');

    choosing.style.opacity = '1';

    function rondomElement() {
        let random = Math.floor(Math.random() * 3);
        let ele_obj = [
            { 'paper': 'linear-gradient(hsl(230, 89%, 62%), hsl(230, 89%, 65%)' },
            { 'scissors': 'linear-gradient(hsl(39, 89%, 49%), hsl(40, 84%, 53%)' },
            { 'rock': 'linear-gradient(hsl(349, 71%, 52%), hsl(349, 70%, 56%)' },
        ];
        let key = Object.keys(ele_obj[random]);
        let value = Object.values(ele_obj[random]);

        // Set the beats, data-color value to the new ele that computer choosed
        function setBeats() {
            if (key == 'paper') {
                scissors.setAttribute('data-beats', 'rock');
                scissors.setAttribute('data-color', 'blue');

            } else if (key == 'scissors') {
                scissors.setAttribute('data-beats', 'paper');
                scissors.setAttribute('data-color', '#ec9f10'); // Yellow
            } else if (key == 'rock') {
                scissors.setAttribute('data-beats', 'scissors');
                scissors.setAttribute('data-color', 'red');
            }
        }
        setBeats();

        // Who can beats me?
        function beatsMe() {
            if (key == 'paper') {
                scissors.setAttribute('data-beats-me', 'scissors');

            } else if (key == 'scissors') {
                scissors.setAttribute('data-beats-me', 'rock');
            } else if (key == 'rock') {
                scissors.setAttribute('data-beats-me', 'paper');
            }
        }
        beatsMe();
        //  Changing after 3s
        setTimeout(() => {
            let img = scissors.querySelector('img');
            img.src = `../images/icon-${key}.svg`;
            choosing.style.opacity = '0';

            // Change the background
            scissors.style.background = value;
            showState();
        }, sec);
    }

    rondomElement();
    return {
        beats_me: scissors.getAttribute('data-beats-me'),
        beats: scissors.getAttribute('data-beats'),
        data_color: scissors.getAttribute('data-color'),
    }


}

// Now its time to know how win
function whoWin(mine_beats, computer_beats, computer_beats_me, paper, scissors) {
    let state = document.querySelector('.game-state');

    let play_again_color = state.querySelector('.play-again');
    // play_again_color = window.getComputedStyle(paper, null).getPropertyValue('background-image');
    // state.querySelector('.play-again').style.color ;

    function shadow(element) {
        // Add shadow to the Winner
        setTimeout(() => {
            let shadow = element.querySelector('.shadow');
            shadow.style.width = '220%';
            shadow.style.height = '220%';

        }, sec);
    }

    if (mine_beats === computer_beats) {
        state.querySelector('h1').innerHTML = 'Draw';
        let paper_color = paper.getAttribute('data-color');
        play_again_color.style.color = paper_color;

    } else if (mine_beats !== computer_beats_me) {
        state.querySelector('h1').innerHTML = 'You Win';
        shadow(paper);
        let paper_color = paper.getAttribute('data-color');
        play_again_color.style.color = paper_color;
        score('me');

    } else if (mine_beats === computer_beats_me) {
        state.querySelector('h1').innerHTML = 'You Loose';
        shadow(scissors);
        let scissors_color = scissors.getAttribute('data-color');
        play_again_color.style.color = scissors_color;
        score('computer');
    }
}

function showState() {
    // Show the state (resulte) on the page
    // invoke in `computerPicked()`
    let game_state = document.querySelector('.game-state');
    let elements_container = document.querySelector('.elements-container');

    game_state.style.transform = 'translate(0, -10%)';
    if (window.innerWidth > width) {
        game_state.style.transform = 'translate(0, -230%)';
        console.log(true)
    }

    game_state.style.opacity = '1';
    game_state.style.zIndex = '999'
    elements_container.style.transform = 'translate(0, 10%)';


    function playAgain() {
        let play_again = document.querySelector('.game-state .play-again');
        let count = 0;
        play_again.onclick = () => {

            function reset() {
                // Retrun the container to its orginal state
                elements_container.classList.remove('active');
                elements.forEach(ele => {
                    for (; count < orginal_elements.length;) {

                        // Setting the values
                        ele.style.background = orginal_elements[count].bg;
                        ele.setAttribute('data-color', orginal_elements[count].color)
                        ele.querySelector('img').src = orginal_elements[count].img;

                        ele.setAttribute('data-beats', orginal_elements[count].beats);
                        ele.setAttribute('data-beats-me', orginal_elements[count].beats_me);

                        // disappear `game-state`
                        let game_state = document.querySelector('.game-state');

                        if (window.innerWidth > width) {
                            console.log(true);

                            game_state.style.transform = 'translate(0, -50%)';
                            game_state.style.opacity = '0';
                            game_state.style.zIndex = '-1';
                            // game_state.classList.toggle('active');

                            elements_container.style.transform = 'translate(0, 20%)';
                            elements_container.style.columnGap = '140px'
                            elements_container.classList.add('chooseable');

                        } else {

                            game_state.style.transform = 'translate(0, 50%)';
                            game_state.style.opacity = '0';

                            elements_container.style.transform = 'translate(0, 50%)';
                            elements_container.classList.add('chooseable');
                        }

                        let shadow = document.querySelectorAll('.element .shadow');
                        shadow.forEach(ele => {
                            // Clear shadow before Replay
                            ele.style.width = '0px';
                            ele.style.height = '0px';
                        });

                        count++;
                        break;
                    }
                })

            }

            reset();
        }

    }
    playAgain();
}

function score(winning) {
    let score = document.querySelector('.score');
    setTimeout(() => {
        if (winning === 'me') {
            score.textContent++;
        } else {
            score.textContent--;
        }

    }, sec);
}