var elements = document.getElementsByTagName('*');

for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    for (var j = 0; j < element.childNodes.length; j++) {
        var node = element.childNodes[j];

        if (node.nodeType === 3) {
            var text = node.nodeValue;
            if (text.includes('tiny-kiwi')) {
                var matched = text.match(/kiwi[\d]*/gi);

                //SEND MATCHED DIGIT TO FIREBASE
                sendToFirebase(matched[0].match(/[\d]*/gi), function(response){
                    alert(response);
                });

                // Replace this line with a blue bar
                var votebar = document.createElement('div');
                votebar.className += 'votebar';
                element.parentElement.appendChild(votebar);
                element.textContent = '';
            }
        }
    }
}

function sendToFirebase(id, cb){
    var req = new XMLHttpRequest();
    var FIREBASE_URL = "[URL]";
    req.open("POST", FIREBASE_URL, true);
    req.onreadystatechange = function() { //Call a function when the state changes.
        if(req.readyState == 4 && req.status == 200) {
            cb(req.responseText);
        }
    }
    req.send(id);
}