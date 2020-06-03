
// this script constructs a 'timeline' - an array of structures where each
// structure references a 'plugin' that will be run, in that order

// which plugins we can call were loaded on the index.html page
// jspsych has lots of pre-defined plugins
// for this one, i made one called 'jspsych-evan-example', in the evan plugins folder
// this has the name 'evan-twostim-choice'

var timeline = [];

var full_screen = { // this plugin will prompt the full screen
  type: 'fullscreen',
  fullscreen_mode: true
};


/* define instructions trial */
var instructions = {
  // there's multiple plugins for displaying instructions, for my task i use one where i show powerpoint slides
  //  it uses the jspsych instruction plugin
  type: "html-keyboard-response",
  stimulus: "<p>In this experiment, you'll choose between three doors. " +
      "</p><p> Each door has some chance of leading to one of three types of coins... " +
      "<p>. </p> " +
      "<div style='width: 700px;'>"+
      "</div>"+
      "<p>Press any key to begin.</p>",
  post_trial_gap: 1000
};

//var outcome_images = ["Stimuli/Evan_Stimuli/Girl.png", // image paths
//                  "Stimuli/Evan_Stimuli/House.png",
//                  "Stimuli/Evan_Stimuli/Banana.png"];


var choice_images = ["Stimuli/Evan_Stimuli/fractal_A.png",
                  "Stimuli/Evan_Stimuli/fractal_B.png",
                  "Stimuli/Evan_Stimuli/fractal_C.png",
                ];



var choice_trial = { // this calls the plugin that i made in - jspsych-evan-explugin.js
  // it sets parameters for the plugin
  type: 'evan-feature33',
  feature_rewards: [-6, 0, 1],
  c1_image: choice_images[0],
  c2_image: choice_images[1],
  c3_image: choice_images[2],
  c1_feature_probs: [1,0,1],
  c2_feature_probs: [0,0,1],
  c3_feature_probs: [1,1,0],
  choice_prompt: true,
}

// place choie stim, wait for response
n_choice_trials = 10; // define 10 of these trials and push them onto the array.

timeline = [full_screen];
timeline.push(instructions)
for (var i = 0; i < n_choice_trials; i++){
  timeline.push(choice_trial);
}

jsPsych.init({ // this runs the exmperiment and does a local save of the results.
    timeline: timeline,
    show_preload_progress_bar: false,
    on_finish: function() {
      jsPsych.data.get().localSave('csv','results.csv');
  }
});
