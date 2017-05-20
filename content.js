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
                //SEND MATCHED DIGIT TO FIREBASE
                chrome.runtime.sendMessage({id: matched}, function(response) {
                    console.log(response.id);
                })

                // Replace this line with a blue bar
                var votebar = document.createElement('div');
                votebar.className += 'votebar';
                element.parentElement.appendChild(votebar);
                element.textContent = '';
            }
            //REPLACE WITH FRAME
        }
    }
}
