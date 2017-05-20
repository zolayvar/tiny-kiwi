var elements = document.getElementsByTagName('*');

for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    for (var j = 0; j < element.childNodes.length; j++) {
        var node = element.childNodes[j];

        if (node.nodeType === 3) {
            var text = node.nodeValue;
            if (text.includes('tiny-kiwi')) {
                var votebar = document.createElement('div');
                votebar.className += 'votebar';
                element.parentElement.appendChild(votebar);
                element.textContent = '';
            }
        }
    }
}