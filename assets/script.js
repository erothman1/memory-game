//Select all the elements
const newGame = document.getElementById("new-game")
const gameContainer = document.getElementById("game-container")
const controllers = document.getElementById("controllers")
const stats = document.getElementById("stats")
const board = document.getElementById("board")
let score = 100
let flipped = []
let hasFlipped = false
let lockBoard = false
let first = null
let second = null
const correctGuess = 10
const incorrectGuess = -1
let answers = null

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
const pickRandom = (dim = 4) => {
    let arrayCopy = [...items]
    const randPicks = []

    const boardSize = (dim * dim) / 2

    for (let i = 0; i < boardSize; i++) {
        const index = Math.floor(Math.random() * arrayCopy.length)

        //add randomly picked item to the random picks array
        randPicks.push(arrayCopy[index])

        //delete randomly picked item from the array copy to avoid duplicate picks 
        arrayCopy.splice(index, 1)
    }
    console.log("pick rand")
    arrayCopy = []
    return randPicks
}

//Shuffle picks
const shuffle = (arr) => {
    const arrayCopy = [...arr]

    for (let index = arrayCopy.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = arrayCopy[index]

        arrayCopy[index] = arrayCopy[randomIndex]
        arrayCopy[randomIndex] = original
    }
    console.log("shuffle")
    return arrayCopy
}

//Function to create game with cards
const gameCreation = () => {

    console.log("game creation")
    //default of the data-dimensions attribute is 4
    const dimensions = board.getAttribute("data-dimensions")

    const randPicks = pickRandom(dimensions)

    //without the shuffle, only 8 cards will show up because we didn't duplicate them for the matching 
    const shufflePicks = shuffle([...randPicks, ...randPicks])

    board.innerHTML = ""

    for (let i = 0; i < dimensions * dimensions; i++) {
        board.innerHTML += `
        <div class="card" data-id="${i}">
            <div class="card-inner">
                <div class="front">🤷🏽</div>
                <div class="back"></div>
            </div>
        </div>
        `
    }

    answers = shufflePicks.map(item => item.emoji)

    board.addEventListener("click", (event) => {
        const card = event.target.closest(".card")

        console.log(answers)

        if (card && !lockBoard) {
            flipCard(card, answers)
        }
    })

}

//Function to decide correct and wrong answers 
const flipCard = (card, answers) => {
    const cardId = card.getAttribute("data-id")
    const back = card.querySelector(".back")

    if (lockBoard || card.classList.contains("correct")) return
    if (card === first) return

    card.classList.add("flipped")
    back.innerHTML = answers[cardId]

    if (!hasFlipped) {
        hasFlipped = true
        first = card
    } else {
        second = card
        hasFlipped = false
        evaluateSelections()
    }

}

//Function to check if game is over and user won
const checkWin = () => {
    const cards = document.querySelectorAll(".card")
    const matchedCards = document.querySelectorAll(".card.correct")

    if (cards.length === matchedCards.length ) {
        const youWin = document.getElementById("you-win")
        youWin.style.display = "block"

        setTimeout(() => {
            document.location.reload()
        }, 1000)
    }

}

const evaluateSelections = () => {

    console.log("evaluate")

    lockBoard = true

    if (first.innerHTML === second.innerHTML) {
        first.removeEventListener("click", () => {})
        second.removeEventListener("click", () => {})
        first.classList.add("correct")
        second.classList.add("correct")
        flipped.push(first, second)
        givePoints(correctGuess)
        checkWin()
        lockBoard = false
    } else {
        setTimeout(() => {
            first.classList.remove("flipped")
            second.classList.remove("flipped")
            first.querySelector(".back").innerHTML = ""
            second.querySelector(".back").innerHTML = ""
            givePoints(incorrectGuess)
            lockBoard = false
        }, 1500)
    }

}

const givePoints = (points) => {
    score += points

    if ( stats != null ) {
        stats.textContent = `Score: ${score}`
    }

    return
}

//Event listener for new game/starting game button 
newGame.addEventListener("click", () => {

    console.log("Im here")

    //TODO: maybe when button is clicked, something can pop up for the user to choose between 3 choices of dimensions? and then game begins 

    gameCreation()

    //clicking new game button also needs to reset the score to 100
    stats.textContent = "Score: 100"
    score = 100
})