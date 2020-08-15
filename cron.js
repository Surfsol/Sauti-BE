const cron = require('node-cron')
let shell = require('shelljs')


cron.schedule('* 4 * * * *', async function(){
    console.log('scheduler tradersData running')
    shell.exec("node ./models/tradersDataParser.js").code
 
})

// cron.schedule('4 * * * * *', function(){
//     console.log('scheduler sessions running')
//     if(shell.exec("node ./models/sessionsDataParser.js").code !== 0){ 
//         console.log('Something went wrong')
//     }
// })



// cron.schedule('3 * * * * *', function(){
//     console.log('scheduler ProductsFetch running')
//     if(shell.exec("node ./models/ProductsFetch.js").code !== 0){ 
//         console.log('Something went wrong')
//     }
// })