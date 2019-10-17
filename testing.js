// const readline = require('readline').createInterface({
//     input: process.stdin,
//     output: process.stdout
// })

// let total = [0]
// let next = []

// for(i=0; i<100; i++){
//     next.push(Math.round(Math.pow(i+1,1.9)) + 10)
//     total.push(total[i] + next[i])
// }
// next.push('End')

// readline.question(`(l) List\n(m) Messages to level ...\n(a) Level amount\n(c) Calculation\n`, async (first) => {
//     if(first == 'l'){
//         console.log(`Lvl | LvlUp| Total required to be here`)
//         for(i=0; i<=100; i++){
//             console.log(`${i}   |  ${next[i]}  | ${total[i]}`)
//         }
//     } else if (first == 'm') {
//         readline.question(`\nWhat is your current lvl count?\n`, (cur) => {
//             readline.question(`\nWhat level do you want to be?\n`, (want) => {
//                 console.log(`You need ${total[want] - cur} more messages.`)
//             })
//         })
//     } else if (first == 'a') {
//         readline.question(`\nWhat level do you want to check?\n`, (lvlam) => {
//             console.log(`Level ${lvlam} | Total to get to this level - ${total[lvlam]}`)
//         })
//     } else if (first == 'c') {
//         console.log(`The calculation to get the amount of messages for the next level is\n(next level) ^ 1.9 + 10`)
//     } else console.log(`Please enter either l, m, a, or c.`)
// })

// let arr = [3, 5, 7, 9]
// let outarr = ['Fizz', 'Buzz', 'Bizz', "Fuzz"]

// let out;
// for(i=1; i<=100; i++){
//     out = ''
//     for(j=0; j<arr.length; j++){
//         if(i % arr[j] === 0) out += outarr[j]
//     }
//     if(out == '') out = i
//     console.log(out)
// }

// var arr = []
// arr[3000] = 3
// arr[3000] += 10
// console.log(`${arr} | ${arr[3000]}`)

// // Import FS, which will read the text file to get the info
// const fs = require('fs');
// // Set dictionaryimport to the entire dictionary file
// var dictionaryimport = fs.readFileSync('engmix.txt').toString();
// // Because the dictionary file, and therefor dictionaryimport, have words seperated by a new line, we can split them with .split('\n') and itll put each word into the 'dic' array
// var dic = dictionaryimport.split("\n")

// // These are the characters that can't be in the word.
// var badchar = 'abcdefgtuvwxyz'
// // Set this to a new array with nothing in it. This will contain the longest words later.
// var best = new Array('');

// // Create a loop that will, for each item in the dic array, set that item to word.
// dicloop:
// for(const word of dic){
//     // Set length to the length of the bad characters string we set earlier.
//     let length = badchar.length
//     // Length will gradually go down by 1. Once it reaches -1, it quits.
//     while(length--) {
//         // If the word contains the character in badchar at position (length), go onto the next word in the for loop
//         if(word.includes(badchar[length])) {
//             continue dicloop;
//         }
//     }
//     // If word passes the bad character test & is longer than the current best word, set the best array to just the word.
//     if(word.length > best[0].length) {
//         best = [word]
//     // Otherwise, if it is the same length as the current best word, add it to the end of the best array.
//     } else if(word.length == best[0].length) {
//         best.push(word)
//     }
// }
// // Send the output!
// console.log(`The longest words without the letters - ${badchar} - are - ${best.join(', ')}`)

// const ytdl = require('ytdl-core');
// const fs = require('fs');
// youtubeurl = 'https://www.youtube.com/watch?v=mUAhK1TTWQY'
// exportname = 'Delete!'
// ytdl(youtubeurl, { quality: 'highest' }).pipe(fs.createWriteStream(`${exportname}.mp4`));
// console.log('Finished!')