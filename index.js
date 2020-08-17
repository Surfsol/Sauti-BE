const app = require("./server");
const port = process.env.PORT || 2500;
const cron = require('node-cron')
let shell = require('shelljs')


cron.schedule('5 * * * *', async function(){
    console.log('scheduler sessionsData running')
    try {
        shell.exec("node ./models/sessionsDataParser.js").code
     } catch{
        console.log('error running cronSessions')
    }
})

cron.schedule('0 * * * *', async function(){
    console.log('scheduler tradersData running')
    shell.exec("node ./models/tradersDataParser.js").code
 
})

app.listen(port, () => console.log(`🚀 Server ready at ${port}`));
