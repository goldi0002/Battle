let votes = {
    image1: 0,
    image2: 0
};

function vote(imageId) {
    votes[imageId]++;
    updateVoteCount(imageId);
}

function updateVoteCount(imageId) {
    const countElement = $(`#${imageId} .vote-count`);
    countElement.text(`Votes: ${votes[imageId]}`);
}
