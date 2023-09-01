//Select all the elements
const newGame = document.getElementById("new-game")
const gameContainer = document.getElementById("game-container")
const controllers = document.getElementById("controllers")
const stats = document.getElementById("stats")
const board = document.getElementById("board")
// const cards = document.querySelectorAll(".card")

//Create array of items 
//using the names to help with match evaluation 
const items = [
    { emoji: "🌳", name: "tree" },
    { emoji: "🍀", name: "clover" },
    { emoji: "🔫", name: "watergun" },
    { emoji: "🐍", name: "snake" },
    { emoji: "🐸", name: "frog" },
    { emoji: "🥑", name: "avocado" },
    { emoji: "🐛", name: "caterpillar" },
    { emoji: "🥒", name: "cucumber" },
    { emoji: "🍏", name: "apple" },
    { emoji: "🥬", name: "lettuce" },
    { emoji: "🧩", name: "puzzle" },
    { emoji: "🐲", name: "dragon" },
    { emoji: "🫒", name: "olive" },
    { emoji: "🪲", name: "beetle" },
    { emoji: "🎄", name: "christmas" },
    { emoji: "💚", name: "heart" },
    { emoji: "🌿", name: "leaf" },
    { emoji: "🦖", name: "dinosaur" },
    { emoji: "🐢", name: "turtle" }
]

//Function to randomly pick items from the array
//default dimensions are 4x4 
const pickRandom = ( dim = 4 ) => {
    const arrayCopy = [...items]
    const randPicks = []

    const boardSize = ( dim * dim ) / 2

    for (let i = 0; i < boardSize; i++) {
        const index = Math.floor(Math.random() * arrayCopy.length)

        //add randomly picked item to the random picks array
        randPicks.push(arrayCopy[index])

        //delete randomly picked item from the array copy to avoid duplicate picks 
        arrayCopy.splice(index, 1)
    }

    return randPicks
}

//Shuffle picks
const shuffle = ( arr ) => {
    const arrayCopy = [...arr]

    for (let index = arrayCopy.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = arrayCopy[index]

        arrayCopy[index] = arrayCopy[randomIndex]
        arrayCopy[randomIndex] = original
    }

    return arrayCopy
}

//Function to create game with cards
const gameCreation = () => {
    //default of the data-dimensions attribute is 4
    const dimensions = board.getAttribute("data-dimensions")

    const randPicks = pickRandom(dimensions)

    //without the shuffle, only 8 cards will show up because we didnt duplicate them for the matching 
    const shufflePicks = shuffle([...randPicks, ...randPicks])

    board.innerHTML = ""

    //TODO: when the cards show up, the back of the card isnt centered for some reason
    for (let i = 0; i < dimensions * dimensions; i++) {
        board.innerHTML += `
        <div class="card" data-card="${shufflePicks[i].name}">
            <div class="card-inner">
                <div class="front">🤷🏽</div>
                <div class="back">${shufflePicks[i].emoji}</div>
            </div>
        </div>
        `
    }

    const cards =  document.querySelectorAll(".card")

    cards.forEach(card => {
        card.addEventListener("click", () => {

            const cardValue = card.getAttribute("data-card")
            console.log(cardValue)

            //flip cards here
            card.classList.toggle("flipped")

            evaluateSelections()
        })
    })

}

//Function to decide correct and wrong answers 
//use the data-card attribute which uses the name of the emoji to evaluate if matches are correct or not?
//if correct, keep cards flipped and add a correct class to those cards
//correct class will add the correct green color to the card 
//if correct class isn"t applied then cards flip back over
const evaluateSelections = () => {

    //TODO: this function works until the first match is found; I think maybe because i'm not taking into account that cards are staying flipped?
    //TODO: score isn't decreasing when answers are wrong, but it does go up when match is correct

    let score = 100
    
    const flippedCards = document.querySelectorAll(".card.flipped")

    if (flippedCards.length === 2) {
        const card1 = flippedCards[0]
        const card2 = flippedCards[1]

        const card1Value = card1.getAttribute("data-card")
        const card2Value = card2.getAttribute("data-card")

        if ( card1Value === card2Value ) {
            card1.classList.add("correct")
            card2.classList.add("correct")
            score += 10
        } else {
            setTimeout(() => {
                card1.classList.remove("flipped")
                card2.classList.remove("flipped")
                score -= 1
            }, 1000)
        }

        stats.textContent = `Score: ${score}`
    }

}

//Event listener for new game/starting game button 
newGame.addEventListener("click", () => {
    console.log("Im here")

    //TODO: maybe when button is clicked, something can pop up for the user to choose between 3 choices of dimensions? and then game begins 

    gameCreation() 

    //clicking new game button also needs to reset the score to 100
    stats.textContent = "Score: 100"
})