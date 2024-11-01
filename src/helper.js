const log = (...value) => console.log('Log****   ',__filename,': ', value.map(item => ' ' + item + '\n').toString())

module.exports = {
    log
}