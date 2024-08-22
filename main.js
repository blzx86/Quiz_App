// Select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown")

// Set Options
let currentIndex = 0;
let rightAnswer = 0;
let countdownInterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200){
            let questionObject = JSON.parse(this.responseText);
            let qCount = questionObject.length;
            
            //createBullets + set qCount
            createBullets(qCount);

            // Add Question Data
            addQuestionData(questionObject[currentIndex], qCount);

            // Start CountDown
            countdown(15, qCount);

            // Click On Submit
            submitButton.onclick = () => {
                // Get Right Answer
                let theRightAnswer = questionObject[currentIndex].right_answer;
                
                // Increase Index
                currentIndex++;

                // Check The Answer
                checkAnswer(theRightAnswer, qCount);

                // Remove Previous Question
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";

                // Add Question Data
                addQuestionData(questionObject[currentIndex], qCount);

                // Handle Bullets Class
                hundlebullets();

                // Start CountDown
                clearInterval(countdownInterval);
                countdown(15, qCount);

                // Show Results 
                showResults(qCount);
            };
        }
    };

    myRequest.open("GET", "html_question.json", true);
    myRequest.send();
}

getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;

    // Create Spans
    for (let i = 0; i < num; i++) {
        // Create Bullet
        let theBullet = document.createElement("span");

        // Check If Its First Span
        if(i === 0) {
            theBullet.className = "on";
        }

        // Append Bullets To Main Bullet Container 
        bulletsSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj, count) {
    if(currentIndex < count){
        // Create H2 Question Title
        let questionTitle = document.createElement("h2");

        // Create Question Text 
        let questionText = document.createTextNode(obj['title']);
        
        // Append Text To H2
        questionTitle.appendChild(questionText);
    
        // Append The H2 To Quiz Area
        quizArea.appendChild(questionTitle);
    
        // Create The Answers 
        for (let i = 1; i <= 4; i++) {
    
            // Create Main Answer Div
            let mainDiv = document.createElement("div");
    
            // Add Class To Main Div
            mainDiv.className = 'answer';
    
            // Create Radio Input
            let radioInput = document.createElement("input");
    
            // Add Type + Name + Id + Data-Attribute
            radioInput.name = 'question';
            radioInput.type = 'radio';
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];
            // Make First Option Selected
            if (i === 1){
                radioInput.checked = true;
            }
            // Create label
            let theLabel = document.createElement("label");
    
            // Add For Attri
            theLabel.htmlFor = `answer_${i}`;
    
            // Create Label Text
            let theLabelText = document.createTextNode(obj[`answer_${i}`]);
    
            // Add The Text To Label
            theLabel.appendChild(theLabelText);
    
            // Add Input + Label To Main Div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);
    
            // Append All Divs To Answers Area
            answersArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rAnswer, count){
    
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for(let i = 0; i < answers.length; i++){
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if (rAnswer === theChoosenAnswer) {
        rightAnswer++;
        console.log("Good Answer");
    }
}

function hundlebullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        
        if(currentIndex === index){
            span.className = "on";
        }
    });
}

function showResults(count){
    let theResults;
    if(currentIndex === count){
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if(rightAnswer > (count / 2) && rightAnswer < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswer} From ${count} Is Good.`;
        } else if (rightAnswer === count){
            theResults = `<span class="perfect">Perfect</span>, All Answer Is Right.`;
        } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswer} From ${count} GG.`;
        }
        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.backgroundColor = "white";
        resultsContainer.style.marginTop = "10px";
    }
}

function countdown(duration, count){
    if (currentIndex < count){
        let minutes, seconds;
        countdownInterval = setInterval(function (){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes ;
            seconds = seconds < 10 ? `0${seconds}` : seconds ;

            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0 ){
                clearInterval(countdownInterval);
                submitButton.click();
            }
        },1000)
    }
}