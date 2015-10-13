// Ch19.1+Ch19.4 printout2 module

exports.print_out = function (word_freqs){
    var i = 0;
    while(1){
        console.log(word_freqs[i][0] + "  -  " + word_freqs[i][1]);  
        if (i >= 24) {
            break;
        }
        i++;
    }
};