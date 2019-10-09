const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

let total = [0]
let next = []

for(i=0; i<100; i++){
    next.push(Math.round(Math.pow(i+1,1.9)) + 10)
    total.push(total[i] + next[i])
}
next.push('End')

readline.question(`(l) List\n(m) Messages to level ...\n(a) Level amount\n(c) Calculation\n`, async (first) => {
    if(first == 'l'){
        console.log(`Lvl | LvlUp| Total required to be here`)
        for(i=0; i<=100; i++){
            console.log(`${i}   |  ${next[i]}  | ${total[i]}`)
        }
    } else if (first == 'm') {
        readline.question(`\nWhat is your current lvl count?\n`, (cur) => {
            readline.question(`\nWhat level do you want to be?\n`, (want) => {
                console.log(`You need ${total[want] - cur} more messages.`)
            })
        })
    } else if (first == 'a') {
        readline.question(`\nWhat level do you want to check?\n`, (lvlam) => {
            console.log(`Level ${lvlam} | Total to get to this level - ${total[lvlam]}`)
        })
    } else if (first == 'c') {
        console.log(`The calculation to get the amount of messages for the next level is\n(next level) ^ 1.9 + 10`)
    } else console.log(`Please enter either l, m, a, or c.`)
})

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