var elements = document.getElementsByTagName('*');
var port = chrome.runtime.connect({name: "knockknock"});

for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    for (var j = 0; j < element.childNodes.length; j++) {
        var node = element.childNodes[j];

        if (node.nodeType === 3) {
            var text = node.nodeValue;
            var matched = text.match(/kiwi[\d]*/gi);
            //SEND MATCHED DIGIT TO FIREBASE
            if(matched !== null){
                chrome.runtime.sendMessage({id: matched}, function(response) {
                    console.log(response.id);
                });
            }
            //REPLACE WITH FRAME
        }
    }
}
