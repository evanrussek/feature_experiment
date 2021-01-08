// define paramters for the subject... shuffle these
var choice_images = ["Stimuli/Evan_Stimuli/fractal_A.png",
                  "Stimuli/Evan_Stimuli/fractal_C.png",
                ];
var emotional_images = new Array ( );
emotional_images[0] = new Array ( "Stimuli/Evan_Stimuli/Dog6.jpg",
					"Stimuli/Evan_Stimuli/Nudecouple5.jpg",
                  "Stimuli/Evan_Stimuli/Fireworks2.jpg",
                  "Stimuli/Evan_Stimuli/Pinecone.png",
                  "Stimuli/Evan_Stimuli/Rainbow2.jpg");
emotional_images[1] = new Array ( "Stimuli/Evan_Stimuli/Explosion5.jpg",
					"Stimuli/Evan_Stimuli/Fire11.jpg",
                  "Stimuli/Evan_Stimuli/Explosion2.jpg",
                  "Stimuli/Evan_Stimuli/Pinecone.png",
                  "Stimuli/Evan_Stimuli/Tornado4.jpg" );
     
var practice_image = "Stimuli/Evan_Stimuli/fractal_D.png";

var safe_first = true;

var feature_probs = feature_prob_safe_first;
var rewards = rewards_safe;

jsPsych.data.addProperties({safe_first: safe_first});
jsPsych.data.addProperties({version: "emot_fl"});
