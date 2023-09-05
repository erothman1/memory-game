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

    const answers = shufflePicks.map(item => item.emoji)
    // const cards =  document.querySelectorAll(".card")

    // cards.forEach(card => {
    //     card.addEventListener("click", () => {

    //         const cardValue = card.getAttribute("data-card")
    //         console.log(cardValue)

    //         //flip cards here
    //         card.classList.toggle("flipped")

    //         evaluateSelections()
    //     })
    // })

    // cards.forEach(card => {
    //     card.addEventListener("click", evaluateSelections, false)
    // })

    board.addEventListener("click", (event) => {
        const card = event.target.closest(".card")
    
        if (card) {
            evaluateSelections(card, answers)
        }
    })

}

//Function to decide correct and wrong answers 

// const count = 0
// const selected = 0
let score = 100
let flipped = []

const evaluateSelections = (card, answers) => {

    console.log(answers, card)

    // const emoji = card.getAttribute("data-card")
    const cardId = card.getAttribute("data-id")

    const back = card.querySelector(".back")
    // back.innerHTML = emoji

    if (!card.classList.contains("flipped")){
        card.classList.add("flipped")
        flipped.push(card)

        back.innerHTML = answers[cardId]

    }

    const flippedCards = document.querySelectorAll(".card.flipped")

    if (flippedCards.length === 2) {
        const card1 = flippedCards[0]
        const card2 = flippedCards[1]

        const answer1 = card1.querySelector(".back")
        const answer2 = card2.querySelector(".back")

        // const card1Value = card1.getAttribute("data-card")
        // const card2Value = card2.getAttribute("data-card")

        if ( answer1.textContent === answer2.textContent ) {
            card1.classList.add("correct")
            card2.classList.add("correct")
            card1.classList.remove("flipped")
            card2.classList.remove("flipped")
            flipped = []
            score += 10
            
            console.log(answer1.textContent, answer2.textContent)
        } else {
            setTimeout(() => {
                card1.classList.remove("flipped")
                card2.classList.remove("flipped")
                answer1.innerHTML = ""
                answer2.innerHTML = ""
                // card1.querySelector(".back").innerHTML = ""
                // card2.querySelector(".back").innerHTML = ""
                score -= 1

                console.log(answer1.textContent, answer2.textContent)
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