const cron = require('node-cron')
let shell = require('shelljs')

// cron.schedule('* 1 * * * *', function(){
//     console.log('scheduler MarketsFetch running')
//     if(shell.exec("node ./models/MarketsFetch.js").code !== 0){ 
//         console.log('Something went wrong')
//     }
// })