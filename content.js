var elements = document.getElementsByTagName('*');
var port = chrome.runtime.connect({name: "knockknock"});

for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    for (var j = 0; j < element.childNodes.length; j++) {
        var node = element.childNodes[j];

        if (node.nodeType === 3) {
            var text = node.nodeValue;

            if (text.includes('tiny-kiwi')) {
                var matched = text.match(/kiwi[\d]*/gi);

                // Delete the [tiny-kiwi 234235] line
                element.textContent = '';

                //SEND MATCHED DIGIT TO FIREBASE
                chrome.runtime.sendMessage({id: matched}, function(response) {
                    console.log(response);
                })

                // Add a vote bar to the bottom of the post
                var votebar = createVoteBarElement()
                element.parentElement.appendChild(votebar);
                sizeVoteBar(votebar);
            }
        }
    }
}

function createVoteBarElement() {
    var votebar = document.createElement('div');
    votebar.className += 'votebar';

    for (var i = 0; i < 10; i++) {
        var voteBucket = document.createElement('div');
        voteBucket.className = 'votebucket';
        votebar.appendChild(voteBucket);
    }

    return votebar;
}

function sizeVoteBar(votebar) {
    for (var i = 0; i < votebar.childNodes.length; i++) {
        var voteBucket = votebar.childNodes[i];
        var width = voteBucket.offsetWidth - 1;
        voteBucket.setAttribute("style","left:" + width*i + "px; height:" + Math.random()*100 + "%");
    }
}