console.log("HEllo")



// Load embeddings from embeddings.json file
let embeddings = [];
let similarity_between_i_j = [[0]]; // Initialize a 2D array for similarity values

fetch('embeddings.json')
    .then(response => response.json())
    .then(data => {
        embeddings = data;
        console.log('Loaded embeddings:', embeddings);

        for (let i = 0; i < embeddings.length; i++) {
            similarity_between_i_j[i] = [];
            for (let j = 0; j < embeddings.length; j++) {
                if (i !== j) {
                    similarity_between_i_j[i][j] = calculateSimilarity(embeddings[i], embeddings[j]);
                } else {
                    similarity_between_i_j[i][j] = 1; // Similarity with itself
                }
            }
        }
        console.log('Similarity matrix:');
        console.table(similarity_between_i_j);

        (index)
        // Example output:
        //          1	        0.7191013327684135	    0.7751889719129308
        // 0.7191013327684135	        1	            0.7745081430238722
        // 0.7751889719129308	0.7745081430238722	            1
    })
    .catch(error => {
        console.error('Error loading embeddings:', error);
    });





function calculateSimilarity(embedding1, embedding2) {
    let dotProduct = 0;
    for (let i = 0; i < embedding1.length; i++) {
        dotProduct += embedding1[i] * embedding2[i];
    }
    return dotProduct;
}



// for(let i = 0; i < embeddings.length; i++) {

// }

// embeddings.forEach((embedding, index) => {
//     if (index > 0) {
//         let distance = Math.sqrt(
//             embedding.reduce((sum, value, i) => sum + Math.pow(value - embeddings[0][i], 2), 0)
//         );
//         distances.push(distance);
//         console.log(`Distance between "${text_to_be_embedded[0]}" and "${text_to_be_embedded[index]}": ${distance}`);
//     }
// });





// let text_to_be_embedded = ["Today is a sunny day and I will get some ice cream."];
// let text_to_be_embedded = ["I love to play football with my friends."];
// let text_to_be_embedded = ["I work at a posticle factory"];

// Uncomment the following lines to test the query function with multiple inputs
// text_to_be_embedded.forEach((text) => {
//     query({ inputs: text }).then((response) => {
//         console.log(JSON.stringify(response, null, 2));
//     });
// });

// Uncomment the following lines to test the query function with a single input
// query({ inputs: text_to_be_embedded[0] }).then((response) => {
//     console.log(JSON.stringify(response));
//     response = response;
// });



async function query(data) {
    const response = await fetch(
        "https://router.huggingface.co/hf-inference/models/intfloat/multilingual-e5-large-instruct/pipeline/feature-extraction",
        {
            headers: {
                Authorization: "Bearer hf_",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result;
}