
var numBuckets = 10;
var kiwiIds = [];

function scanForKiwis() {
    var elements = document.getElementsByTagName('*');

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        for (var j = 0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];

            if (node.nodeType === 3) {
                var text = node.nodeValue;

                if (text.includes('tiny-kiwi')) {
                    var kiwiId = text.match(/\d+/)[0];

                    // Delete the [tiny-kiwi 234235] line
                    element.textContent = element.textContent.replace(/\[tiny-kiwi.*\]/gi, '');

                    // Add the vote bar to the post
                    drawVoteBar(element.parentElement, kiwiId)

                    // Fetch the firebase data and draw the votes
                    fetchFirebaseAndSizeVotes(kiwiId);

                    kiwiIds.push(kiwiId);
                }
            }
        }
    }
}
setInterval(scanForKiwis, 1000);

setInterval(function() {
    for (var i = 0; i < kiwiIds.length; i++) {
        fetchFirebaseAndSizeVotes(kiwiIds[i]);
    }
}, 1000);

function getVotebar(id) {
    return document.getElementById(id);
}

function fetchFirebaseAndSizeVotes(id) {
    var votebar = getVotebar(id);

    chrome.runtime.sendMessage({id: id}, function(response) {
        //console.log('kiwiId', id, 'firebase response', response);

        // Size the vote bar to match the votes
        sizeVoteBar(votebar, processVotesFromFirebaseResponse(response));
    });
}

function handleVote(id, value) {
    chrome.runtime.sendMessage({push: {id: id, value: value}});
    fetchFirebaseAndSizeVotes(id);
}

function processVotesFromFirebaseResponse(response) {
    var votes = [];

    for (var i = 0; i < numBuckets; i++) {
        votes.push([]);
    }

    for (var key in response.id.values) {
        var value = response.id.values[key].value;
        var targetBucket = Math.floor(value / numBuckets);
        votes[targetBucket].push({key: key, value: value, name: response.id.values[key].name});
    }

    return votes;
}

function drawVoteBar(element, id) {
    var votebar = createVoteBarElement(id);
    element.appendChild(votebar);
}

function createVoteBarElement(id) {
    var votebar = document.createElement('div');
    votebar.className += 'votebar';
    votebar.id = id;
    for (var i = 0; i < numBuckets; i++) {
        // The vote bucket container
        var voteBucket = document.createElement('div');
        voteBucket.addEventListener("click", function(e) {
            handleVote(id, e.target.value*10);
        });
        voteBucket.addEventListener("mouseover", showVoters);
        voteBucket.className = 'votebucket';
        voteBucket.value = i;
        votebar.appendChild(voteBucket);

        // The vote bucket filler
        var voteBucketFiller = document.createElement('div');
        voteBucketFiller.className = 'votebucketfiller';
        voteBucketFiller.value = i;
        voteBucketFiller.addEventListener("click", function(e) {
            handleVote(id, e.target.value*10);
        });
        voteBucketFiller.addEventListener("mouseover", showVoters);
        voteBucket.appendChild(voteBucketFiller);
    }

    return votebar;
}

function showVoters(e) {
    var voters = e.target.voters;

    var votersPopup = document.createElement('div');
    votersPopup.className = 'votersPopup';
    e.target.appendChild(votersPopup);
    votersPopup.textContent = voters.join('\n');
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

        var voters = votes[i].map(function(vote) {
            return vote.name;
        });
        voteBucket.voters = voters;
        voteBucketFiller.voters = voters;
    }
}


