const mailDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com'
]


const getRandomQuote = () => {
    
    const quoteOfTheDay = [
      "Believe you can and you're halfway there.",
      "Dreams don't work unless you do.",
      "Success is the sum of small efforts repeated daily.",
      "The only way to do great work is to love what you do.",
      "Courage is grace under pressure.",
      "What you do today can improve all your tomorrows.",
      "Don't watch the clock; do what it does—keep going.",
      "The harder you work for something, the greater you'll feel when you achieve it.",
      "Act as if what you do makes a difference—it does.",
      "It always seems impossible until it's done.",
      "Start where you are. Use what you have. Do what you can.",
      "Great things never come from comfort zones.",
      "Failure is not falling down but refusing to get up.",
      "Small steps every day lead to big results.",
      "The future depends on what you do today.",
      "You miss 100% of the shots you don't take.",
      "Stay hungry, stay foolish.",
      "Success doesn't come from what you do occasionally. It comes from what you do consistently.",
      "Push yourself, because no one else is going to do it for you.",
      "If you get tired, learn to rest, not to quit.",
      "Don't limit your challenges. Challenge your limits.",
      "Discipline is the bridge between goals and accomplishment.",
      "Hard work beats talent when talent doesn't work hard.",
      "Work hard in silence, let your success be your noise.",
      "Don't stop until you're proud.",
      "Great minds discuss ideas; average minds discuss events; small minds discuss people.",
      "Everything you've ever wanted is on the other side of fear.",
      "A river cuts through rock not because of its power, but its persistence.",
      "Stay away from those people who try to disparage your ambitions.",
      "Happiness is not something ready made. It comes from your own actions.",
      "If you can dream it, you can do it.",
      "Don't count the days, make the days count.",
      "In the middle of difficulty lies opportunity.",
      "Your time is limited, don't waste it living someone else's life.",
      "The best revenge is massive success.",
      "Your limitation—it's only your imagination.",
      "Sometimes later becomes never. Do it now.",
      "Dream it. Wish it. Do it.",
      "Success doesn't just find you. You have to go out and get it.",
      "The harder you work, the luckier you get.",
      "Don't wait for opportunity. Create it.",
      "Wake up with determination. Go to bed with satisfaction.",
      "Do something today that your future self will thank you for.",
      "Little things make big days.",
      "It's going to be hard, but hard does not mean impossible.",
      "Don't let yesterday take up too much of today.",
      "You don't have to be great to start, but you have to start to be great.",
      "Motivation gets you going, but discipline keeps you growing.",
      "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
      "Be stronger than your excuses."
    ]

    const random = Math.floor(Math.random() * quoteOfTheDay.length)

    return quoteOfTheDay[random]

}

export default { mailDomains , getRandomQuote}