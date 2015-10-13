// Ch19.1+Ch19.4 printout1 module

exports.print_out = function (word_freqs){
    for (var i in word_freqs.slice(0,25)){
        console.log(word_freqs[i][0] + "  -  " + word_freqs[i][1]);   
    }
};