setTimeout(function() {

var elements = document.getElementsByTagName('*');
var port = chrome.runtime.connect({name: "knockknock"});
var numBuckets = 10;

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

                // Add the vote bar to the post
                var votebar = drawVoteBar(element.parentElement, matched)

                //SEND MATCHED DIGIT TO FIREBASE
                chrome.runtime.sendMessage({id: matched}, function(response) {
                    console.log('firebase response', response);
                    // Replace this line with a blue bar
                    var votebar = document.createElement('div');
                    votebar.className += 'votebar';
                    votebar.id = matched;
                    element.parentElement.appendChild(votebar);
                    element.textContent = '';
                    // Size the vote bar to match the votes
                    sizeVoteBar(votebar, processVotesFromFirebaseResponse(response));
                })
            }
        }
    }
}

function processVotesFromFirebaseResponse(response) {
    var votes = [];

    for (var i = 0; i < numBuckets; i++) {
        votes.push([]);
    }

    for (var key in response.id.values) {
        var value = response.id.values[key].value;
        var targetBucket = Math.floor(value / numBuckets);
        votes[targetBucket].push({key: key, value: value});
    }

    console.log(votes);
    return votes;
}

function drawVoteBar(element, id) {
    // Add a vote bar to the bottom of the post
    var votebar = createVoteBarElement(id);
    element.appendChild(votebar);
    return votebar;
}

function createVoteBarElement(id) {
    var votebar = document.createElement('div');
    votebar.className += 'votebar';
    votebar.id = id;
    for (var i = 0; i < numBuckets; i++) {
        // The vote bucket container
        var voteBucket = document.createElement('div');
        voteBucket.addEventListener("click", function(e) {
            chrome.runtime.sendMessage({push: {id: votebar.id, value: i}})
        });
        voteBucket.className = 'votebucket';
        votebar.appendChild(voteBucket);

        // The vote bucket filler
        var voteBucketFiller = document.createElement('div');
        voteBucketFiller.className = 'votebucketfiller';
        voteBucket.appendChild(voteBucketFiller);

    }

    return votebar;
}

function sizeVoteBar(votebar, votes) {
    var mostVotes = Math.max(...votes.map(function(bucket) {
        return bucket.length;
    }));

    for (var i = 0; i < votebar.childNodes.length; i++) {
        var voteBucket = votebar.childNodes[i];
        var width = voteBucket.offsetWidth - 1;
        voteBucket.setAttribute("style","left:" + (width+2)*i + "px;");

        var voteBucketFiller = voteBucket.childNodes[0];
        voteBucketFiller.setAttribute("style", "height:" + votes[i].length/mostVotes*100 + "%");
    }
}

<<<<<<< HEAD
}, 1000);
=======
}, 5000);
>>>>>>> 3fa398eeadb1f21306f1f19b221a1875fcdc5876
