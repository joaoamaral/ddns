var colors = require('colors');
var request = require('request');
var externalip = require('externalip');
fs = require('fs')

console.log('Dynamic DNS Client for FreeDNS'.bold);

var url = "http://freedns.afraid.org/dynamic/update.php?secretkey"

// Text file with IPv4 Address (0.0.0.0)
var filename = "cachedip.txt"

// Reads local file for latest external IP address
fs.readFile(filename, 'utf8', function (err, oldip) {
  if (err) {
    return console.log(err);
  }
  console.log("Cached External IP Address:" + oldip.bold);

  request('http://myexternalip.com/raw', function (err, resp, newip) {
    console.log("Current External Address: " + newip.bold);

    if(oldip === newip){
      console.log("No update.".bold)
      return
    }
    console.log("Update needed.".bold)
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {

        console.log('Update successful...'+response.statusCode);
        fs.writeFile(filename, newip, function(err) {

          if(err) {
              return console.log(err);
          }

          console.log("New IP Address stored in file.");
        });

      } else {
        console.log('Something went wrong...'+response.statusCode);
        console.log(error)
      }
    })
  })
});
