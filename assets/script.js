//Select all the elements
const newGame = document.getElementById("new-game")
const gameContainer = document.getElementById("game-container")
const controllers = document.getElementById("controllers")
const stats = document.getElementById("stats")
const board = document.getElementById("board")
const youWin = document.getElementById("you-win")
const dropdownSelect = document.getElementById("dropdown-select")
const attempts = document.getElementById("attempts")
const endGame = document.getElementById("end-game")
let score = 100
let attemptCount = 500
let flipped = []
let hasFlipped = false
let lockBoard = false
const correctGuess = 10
const incorrectGuess = -1
let answers = null
let count = 0
let flipTimeout = null
const unsplashAccessKey = "YuhhDhVQBQxxn-OYxkuiw2AJWeIw5PJIuXWCLJ0CLUo"
let unsplashArray = []

//Function to fetch random photos from unsplash
const fetchUnsplash = () => {

    const dimensions = board.getAttribute("data-dimensions")

    unsplashArray = []

    let numPhotos = 8

    if (dimensions === "2") {
        numPhotos = 2
    } else if (dimensions === "6") {
        numPhotos = 18
    } else {
        numPhotos = 8
    }

    const apiURL = `https://api.unsplash.com/photos/random/?count=${numPhotos}&orientation=landscape&client_id=${unsplashAccessKey}`

    fetch(apiURL)
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error(response.status)
            }
        })
        .then((data) => {
            // console.log(data)
            for (let i = 0; i < data.length; i++) {
                // console.log(data[i].urls.regular)
                unsplashArray.push(data[i].urls.regular)
            }
            gameCreation()
        })
        .catch((error) => {
            console.log(error.message)
        })

    console.log(unsplashArray)
}

//User selects the dimensions of the game board 
dropdownSelect.addEventListener("change", () => {
    const selected = dropdownSelect.value

    console.log("SELECTED", selected)

    board.setAttribute("data-dimensions", selected)
})

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

    count = 0

    attemptCount -= 1
    attempts.textContent = `Attempts: ${attemptCount}`
    // stats.textContent = "Score: 100"
    // score = 100

    if (youWin) {
        youWin.style.display = "none"
    }

    //default of the data-dimensions attribute is 4
    const dimensions = board.getAttribute("data-dimensions")

    //without the shuffle, only 8 cards will show up because we didn't duplicate them for the matching 
    const shuffleUnsplash = shuffle([...unsplashArray, ...unsplashArray])

    board.innerHTML = ""

    let cardClass = "four-by-four"

    if (dimensions === "2") {
        cardClass = "two-by-two"
    } else if (dimensions === "6") {
        cardClass = "six-by-six"
    }

    for (let i = 0; i < dimensions * dimensions; i++) {
        board.innerHTML += `
        <div class="card ${cardClass}" data-id="${i}">
            <div class="card-inner">
                <div class="front">🤷🏽</div>
                <div class="back"></div>
            </div>
        </div>
        `
    }

    answers = shuffleUnsplash

    board.removeEventListener("click", cardClickHandler)

    board.addEventListener("click", cardClickHandler)

}

//Function to handle card clicks
const cardClickHandler = (event) => {
    const card = event.target.closest(".card")

    if (card && !card.classList.contains("correct")) {
        flipCard(card, answers)
    }
}

//Function to flip cards
const flipCard = (card, answers) => {
    const cardId = card.getAttribute("data-id")
    const back = card.querySelector(".back")
    let clickIsValid = true

    if (card.classList.contains("correct") || card.classList.contains("flipped")) {
        clickIsValid = false
    }

    if (clickIsValid) {
        count++

        if (count > 2) {
            console.log("INCORRECT GUESS: CLEAR TIMEOUT")
            lockBoard = false
            clearTimeout(flipTimeout)
            timeoutLogic()
            count = 1
        }

        card.classList.add("flipped")

        const image = document.createElement("img")
        image.src = answers[cardId]
        image.style.width = "100%"
        image.style.height = "100%"
        back.style.backgroundSize = "cover"
        back.style.backgroundPosition = "center"
        back.innerHTML = ""
        back.appendChild(image)

        console.log("FLIP CARD COUNT:", count)

        if (!hasFlipped) {
            hasFlipped = true
        } else {
            hasFlipped = false

            evaluateSelections()
        }
    }

    return

}

//Function to check if game is over and user won
const checkWin = () => {
    const cards = document.querySelectorAll(".card")
    const matchedCards = document.querySelectorAll(".card.correct")

    if (cards.length === matchedCards.length) {
        youWin.style.display = "block"
    }
}

//Function to evaluate correct and incorrect matches 
const evaluateSelections = () => {
    lockBoard = true

    const flippedStateCards = document.querySelectorAll(".flipped")

    if (flippedStateCards.length === 2) {
        const card1 = flippedStateCards[0]
        const card2 = flippedStateCards[1]

        const img1 = card1.querySelector(".back img")
        const img2 = card2.querySelector(".back img")

        console.log("CARD1", img1.src)
        console.log("CARD2", img2.src)

        if (img1.src === img2.src) {
            card1.classList.add("correct")
            card2.classList.add("correct")
            card1.classList.remove("flipped")
            card2.classList.remove("flipped")
            givePoints(correctGuess)
            checkWin()
            lockBoard = false
            count = 0
        } else {
            card1.classList.add("wrong")
            card2.classList.add("wrong")
            flipTimeout = setTimeout(() => {
                console.log("IN TIMEOUT: INCORRECT GUESS")
                timeoutLogic()
            }, 800)
        }
    }

    hasFlipped = false

}

//Function to handle the logic for incorrect match during the timeout
const timeoutLogic = () => {

    const flippedStateCards = document.querySelectorAll(".flipped")
    for (let i = 0; i < flippedStateCards.length; i++) {
        const card = flippedStateCards[i]
        card.classList.remove("flipped")
        card.classList.remove("wrong")

        const backEl = card.querySelector(".back")
        const imageEl = backEl.querySelector("img")

        if (imageEl) {
            backEl.removeChild(imageEl)
        }

        backEl.style.backgroundImage = "none"
    }

    givePoints(incorrectGuess)
    lockBoard = false
    count = 0
}

//Function to handle giving and taking points
const givePoints = (points) => {
    score += points

    if (stats != null) {
        stats.textContent = `Score: ${score}`
    }

    return
}

//Event listener for new game/starting game button 
newGame.addEventListener("click",
    fetchUnsplash
    //gameCreation
)